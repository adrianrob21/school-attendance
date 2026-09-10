"""Generate one child's two attendance clips with the local Raluca model."""

import base64
import io
import json
import os
import sys
import wave

# Disable ONNX Runtime telemetry before Piper initializes the runtime.
os.environ["ORT_DISABLE_TELEMETRY"] = "1"

from piper import PiperVoice, SynthesisConfig
import numpy as np


CONFIG = SynthesisConfig(length_scale=1.12, noise_w_scale=0.0)


def rms_db(samples):
    if not len(samples):
        return -240.0
    values = samples.astype(np.float64) / 32768.0
    return float(20 * np.log10(max(np.sqrt(np.mean(values**2)), 1e-12)))


def synthesize_complete_word(voice, name, word):
    """Use following context to finish /nt/, then remove it in a verified pause."""
    for separator in (",", ";"):
        chunks = list(voice.synthesize(
            f"{name}, {word}{separator} mulțumesc.",
            CONFIG,
            include_alignments=True,
        ))
        if not chunks or not chunks[-1].phoneme_alignments:
            continue
        chunk = chunks[-1]
        rate = chunk.sample_rate
        if any((item.sample_rate, item.sample_width, item.sample_channels) != (rate, 2, 1)
               for item in chunks):
            continue
        positions = []
        cursor = 0
        for alignment in chunk.phoneme_alignments:
            end = cursor + int(alignment.num_samples)
            positions.append((alignment.phoneme, cursor, end))
            cursor = end
        audio = chunk.audio_int16_array
        if cursor != len(audio):
            continue
        separators = [index for index, item in enumerate(positions) if item[0] == separator]
        if not separators:
            continue
        pause = separators[-1]
        if pause < 2 or [item[0] for item in positions[pause - 2:pause]] != ["n", "t"]:
            continue
        context = pause + 1
        while context < len(positions) and positions[context][0] == " ":
            context += 1
        if context >= len(positions) or positions[context][0] != "m":
            continue
        _, n_start, n_end = positions[pause - 2]
        _, t_start, t_end = positions[pause - 1]
        if rms_db(audio[n_start:n_end]) < -50 or rms_db(audio[t_start:t_end]) < -55:
            continue
        # Keep the whole final consonant and stop before any continuation onset.
        low = t_end + round(0.020 * rate)
        high = positions[context][1] - round(0.040 * rate)
        width = round(0.020 * rate)
        if high - low < width:
            continue
        starts = range(low, high - width + 1, max(1, round(0.002 * rate)))
        start = min(starts, key=lambda index: float(np.mean(
            audio[index:index + width].astype(np.float64)**2
        )))
        quiet = audio[start:start + width]
        peak = float(np.max(np.abs(quiet.astype(np.int32)))) / 32768.0
        if rms_db(quiet) > -50 or peak > 10**(-40 / 20):
            continue
        center = start + width // 2
        radius = max(1, round(0.001 * rate))
        cut = center - radius + int(np.argmin(np.abs(
            audio[center - radius:center + radius + 1].astype(np.int32)
        )))
        pcm = b"".join(item.audio_int16_bytes for item in chunks[:-1])
        pcm += chunk.audio_int16_bytes[:cut * 2]
        result = io.BytesIO()
        with wave.open(result, "wb") as wav_file:
            wav_file.setnchannels(1)
            wav_file.setsampwidth(2)
            wav_file.setframerate(rate)
            wav_file.writeframes(pcm)
            wav_file.writeframes(bytes(round(0.3 * rate) * 2))
        return result.getvalue()
    raise ValueError("The local voice could not produce a complete, safely separated ending.")


def main():
    name = json.load(sys.stdin)["name"]
    voice = PiperVoice.load(sys.argv[1], include_alignments=True)
    clips = {"mimeType": "audio/wav", "voiceId": "raluca-high-v3"}
    for status, word in (("present", "prezent"), ("absent", "absent")):
        audio = synthesize_complete_word(voice, name, word)
        clips[status] = base64.b64encode(audio).decode("ascii")
    json.dump(clips, sys.stdout)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        print("Local voice generation failed.", file=sys.stderr)
        sys.exit(1)
