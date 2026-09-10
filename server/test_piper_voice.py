"""Model-free tests for complete-word cropping, using explicit PCM and timings."""

import base64
import builtins
import importlib.util
import io
import json
import os
from pathlib import Path
import sys
from types import ModuleType, SimpleNamespace
import unittest
from unittest.mock import Mock, patch
import wave

import numpy as np


PIPER = ModuleType("piper")
PIPER.PiperVoice = SimpleNamespace(load=Mock())
PIPER.SynthesisConfig = lambda **options: SimpleNamespace(**options)


def load_helper():
    spec = importlib.util.spec_from_file_location(
        "piper_voice_test_subject", Path(__file__).with_name("piper_voice.py")
    )
    module = importlib.util.module_from_spec(spec)
    with patch.dict(sys.modules, {"piper": PIPER}):
        spec.loader.exec_module(module)
    return module


HELPER = load_helper()


def make_chunk(separator=",", mode="good"):
    phones = [("^", 20), ("a", 100), (",", 50), (" ", 20), ("n", 80),
              ("t", 100), (separator, 180), (" ", 100), ("m", 100), ("$", 50)]
    pcm = np.zeros(sum(length for _, length in phones), dtype=np.int16)
    pcm[:370] = np.resize(np.array([1200, -900], dtype=np.int16), 370)
    # The acoustic release extends beyond the predicted /t/ boundary.
    pcm[370:430] = np.resize(np.array([600, -500], dtype=np.int16), 60)
    pcm[650:750] = 16000  # A distinctive continuation that must never survive.
    if mode == "silent_n":
        pcm[190:270] = 0
    if mode == "silent_t":
        pcm[270:370] = 0
    if mode == "no_gap":
        pcm[370:650] = 800
    if mode == "spikes":
        pcm[370:650] = 0
        pcm[370:650:20] = 400  # Low RMS alone would wrongly allow these peaks.
    alignments = [SimpleNamespace(phoneme=phone, num_samples=length) for phone, length in phones]
    if mode == "missing_alignment":
        alignments = None
    if mode == "wrong_length":
        alignments[-1].num_samples += 1
    return SimpleNamespace(
        sample_rate=1000, sample_width=2, sample_channels=1,
        audio_int16_array=pcm, audio_int16_bytes=pcm.tobytes(),
        phoneme_alignments=alignments,
    )


class FakeVoice:
    def __init__(self, first="good", fallback=None, prefix=None):
        self.first = first
        self.fallback = fallback if fallback is not None else first
        self.prefix = prefix
        self.calls = []
        self.chunks = []

    def synthesize(self, text, config, include_alignments=False):
        self.calls.append((text, config, include_alignments))
        separator = ";" if text.endswith("; mulțumesc.") else ","
        mode = self.fallback if separator == ";" else self.first
        chunk = make_chunk(separator, mode)
        self.chunks.append(chunk)
        return [self.prefix, chunk] if self.prefix is not None else [chunk]


def read_pcm(audio):
    with wave.open(io.BytesIO(audio), "rb") as wav_file:
        assert (wav_file.getframerate(), wav_file.getsampwidth(), wav_file.getnchannels()) == (1000, 2, 1)
        return np.frombuffer(wav_file.readframes(wav_file.getnframes()), dtype="<i2")


class CompleteWordTests(unittest.TestCase):
    def test_preserves_complete_nt_and_release_then_cuts_before_context(self):
        voice = FakeVoice()
        pcm = read_pcm(HELPER.synthesize_complete_word(voice, "Ilinca Ștefania", "prezent"))
        retained, padding = pcm[:-300], pcm[-300:]
        self.assertGreaterEqual(len(retained), 430)
        self.assertLess(len(retained), 650 - 40)
        np.testing.assert_array_equal(retained, voice.chunks[0].audio_int16_array[:len(retained)])
        np.testing.assert_array_equal(retained[190:370], voice.chunks[0].audio_int16_array[190:370])
        np.testing.assert_array_equal(padding, np.zeros(300, dtype=np.int16))
        self.assertFalse(np.any(retained == 16000))
        self.assertEqual(voice.calls[0][0], "Ilinca Ștefania, prezent, mulțumesc.")
        self.assertEqual(len(voice.calls), 1)

    def test_preserves_all_chunks_before_the_guarded_final_chunk(self):
        prefix = make_chunk()
        prefix.phoneme_alignments = None
        voice = FakeVoice(prefix=prefix)
        pcm = read_pcm(HELPER.synthesize_complete_word(voice, "A. Ilinca", "absent"))
        np.testing.assert_array_equal(pcm[:len(prefix.audio_int16_array)], prefix.audio_int16_array)

    def test_rejects_silent_phones_missing_alignment_and_unusable_pauses(self):
        for mode in ("silent_n", "silent_t", "missing_alignment", "wrong_length", "no_gap", "spikes"):
            with self.subTest(mode=mode):
                voice = FakeVoice(first=mode)
                with self.assertRaises(ValueError):
                    HELPER.synthesize_complete_word(voice, "Ilinca", "absent")
                self.assertEqual(len(voice.calls), 2)

    def test_semicolon_fallback_after_an_unusable_comma_guard(self):
        for mode in ("silent_t", "no_gap"):
            with self.subTest(mode=mode):
                voice = FakeVoice(first=mode, fallback="good")
                pcm = read_pcm(HELPER.synthesize_complete_word(voice, "Ilinca", "absent"))
                self.assertEqual([call[0] for call in voice.calls], [
                    "Ilinca, absent, mulțumesc.", "Ilinca, absent; mulțumesc.",
                ])
                retained = pcm[:-300]
                np.testing.assert_array_equal(retained, voice.chunks[1].audio_int16_array[:len(retained)])

    def test_main_loads_model_once_and_returns_only_the_two_guarded_clips(self):
        voice = FakeVoice()
        output = io.StringIO()
        with patch.object(PIPER.PiperVoice, "load", return_value=voice) as load, \
             patch.object(sys, "argv", ["piper_voice.py", "/local/raluca-high.onnx"]), \
             patch.object(sys, "stdin", io.StringIO('{"name":"Ilinca Ștefania"}')), \
             patch.object(sys, "stdout", output):
            HELPER.main()
        load.assert_called_once_with("/local/raluca-high.onnx", include_alignments=True)
        result = json.loads(output.getvalue())
        self.assertEqual(set(result), {"present", "absent", "mimeType", "voiceId"})
        self.assertEqual(result["mimeType"], "audio/wav")
        self.assertEqual(result["voiceId"], "raluca-high-v3")
        self.assertEqual([call[0] for call in voice.calls], [
            "Ilinca Ștefania, prezent, mulțumesc.", "Ilinca Ștefania, absent, mulțumesc.",
        ])
        for _, config, alignments in voice.calls:
            self.assertEqual((config.length_scale, config.noise_w_scale), (1.12, 0.0))
            self.assertTrue(alignments)
        for status in ("present", "absent"):
            pcm = read_pcm(base64.b64decode(result[status]))
            self.assertFalse(np.any(pcm == 16000))

    def test_failed_pair_never_writes_partial_json(self):
        voice = FakeVoice(first="silent_t")
        output = io.StringIO()
        with patch.object(PIPER.PiperVoice, "load", return_value=voice), \
             patch.object(sys, "argv", ["piper_voice.py", "/private/model"]), \
             patch.object(sys, "stdin", io.StringIO('{"name":"Ilinca"}')), \
             patch.object(sys, "stdout", output):
            with self.assertRaises(ValueError):
                HELPER.main()
        self.assertEqual(output.getvalue(), "")

    def test_telemetry_is_disabled_before_piper_import(self):
        original_import = builtins.__import__
        observed = []

        def inspect_import(name, *args, **kwargs):
            if name == "piper":
                observed.append(os.environ.get("ORT_DISABLE_TELEMETRY"))
            return original_import(name, *args, **kwargs)

        with patch.dict(os.environ, {"ORT_DISABLE_TELEMETRY": "0"}), \
             patch("builtins.__import__", side_effect=inspect_import):
            load_helper()
        self.assertEqual(observed, ["1"])


if __name__ == "__main__":
    unittest.main()
