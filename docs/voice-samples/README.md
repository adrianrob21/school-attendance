# Raluca High attendance samples

These examples use Piper 1.8.0 and `ro_RO-raluca-high.onnx`, with `length_scale=1.12` and `noise_w_scale=0`. The model can omit the final consonants of a sentence. The updated preparation checks the final **n** and **t**, then removes a generated continuation at a verified quiet pause after the complete status word. Only the child's name and status remain, followed by 300 milliseconds of silence. The app generates separate clips from each child's actual name when that child is saved.

- [“Ștefan-Andrei, prezent”](raluca-high-v3-present.wav)
- [“Ștefan-Andrei, absent”](raluca-high-v3-absent.wav)

For comparison, the previous version slowed the voice and added silence but could still omit the final consonants: [v2 prezent](raluca-high-v2-present.wav), [v2 absent](raluca-high-v2-absent.wav). The original samples are also retained: [v1 prezent](raluca-present.wav), [v1 absent](raluca-absent.wav).

The corrected preparation passed an acoustic check of 32 recordings across 16 names: both final consonants were audible in their phoneme intervals and the cut fell in a quiet pause before the extra word. The final preview files were also checked with an independent local speech recognizer for complete status words.

Both files are mono, 16-bit, 22,050 Hz WAV audio. The model is by **eduardem**, from [piper-tts-romanian](https://huggingface.co/eduardem/piper-tts-romanian), under [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/). See [setup and attribution](../todays-page.md#voice-setup).
