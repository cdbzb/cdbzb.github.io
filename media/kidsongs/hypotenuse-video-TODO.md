# Hypotenuse — YouTube video TODO

Goal: turn `hypotenuse.mp3` into a YouTube video with **burned-in** subtitles.

## Assets (all in `media/kidsongs/`)
- `hypotenuse.mp3` — audio (~1:22)
- `hypotenuse.srt` — subtitles, force-aligned to the audio (13 cues, one per lyric line)
- `hypotenuse-lyrics.txt` — source lyrics used for alignment

## TODO
- [ ] Check `hypotenuse.srt` cue timings against the audio; fix any that drift
- [ ] (optional) Tidy lyric text / line breaks in `hypotenuse-lyrics.txt`, then re-align
- [ ] Choose the background visual (still image or footage)
- [ ] Burn subtitles in with ffmpeg (command below)
- [ ] Preview the MP4, adjust `force_style`
- [ ] Upload to YouTube

## Burn-in command (static image background)

Run from `media/kidsongs/`. Replace `cover.jpg` with the chosen image.

```sh
ffmpeg -loop 1 -i cover.jpg -i hypotenuse.mp3 \
  -vf "scale=1920:1080,subtitles=hypotenuse.srt:force_style='Fontsize=28,Alignment=2,MarginV=60'" \
  -c:v libx264 -tune stillimage -c:a aac -b:a 192k -shortest -pix_fmt yuv420p hypotenuse.mp4
```

### Notes
- `-loop 1 -i cover.jpg` holds the still for the whole song; `-shortest` ends the video when the audio ends.
- `subtitles=...` burns the captions into the pixels (not a toggleable track).
- `force_style` (libass ASS style) controls appearance:
  - `Fontsize` — point size
  - `Alignment=2` — bottom-center (numpad layout: 1–3 bottom, 4–6 middle, 7–9 top)
  - `MarginV=60` — vertical margin from the edge (px)
  - add e.g. `PrimaryColour=&H00FFFFFF` (white), `OutlineColour=&H00000000`, `Outline=2`, `FontName=...`
- If the image isn't 16:9, swap `scale=1920:1080` for
  `scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2`
  to letterbox instead of stretch.

## Re-align subtitles (if lyrics change)

Env: `/private/tmp/.../scratchpad/aeneas-env` (stable-ts + torch, Python 3.12).
Tool: `stable-ts` forced alignment — aligns known lyrics to audio.

```python
import stable_whisper
model = stable_whisper.load_model('small.en')
text = open('hypotenuse-lyrics.txt').read()
result = model.align('hypotenuse.mp3', text, language='en', original_split=True)
result.to_srt_vtt('hypotenuse.srt', word_level=False)
```

- `original_split=True` keeps each line of the lyrics file as its own subtitle cue.
- Plain transcription (`model.transcribe`) does NOT work here — Whisper mishears the
  sung lyrics and drops the verses. Always align against the known text.
