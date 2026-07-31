# 星河乐队 cover image — processing notes

## Source

`~/tank/Mandarin-media/semiquaver__Album_cover_of_chinese_synth-pop_album_cover_for__eeca2d51-133a-4ace-83cf-f92aaa05d26a_3.png` — 1024×1024 PNG. The band photo and overall layout are kept as-is; only the two large yellow "characters" on the left vertical band were replaced (the originals were hallucinated glyphs, not readable Chinese).

## Output

`images/xinghe-cover.jpg` — 1024×1024 JPEG, quality 88.

## Method (ImageMagick 7)

1. **Sampled a clean band texture** from the only large region of the magenta band that was free of glyphs and scratches: a 145×40 strip at `+0+380` (just below the second original glyph).
2. **Stretched the strip to 240×40**, tiled it vertically to **240×460**, and composited over the original at `+0+0`. This covers the wide upper section of the band; the narrow lower section (y>460) is untouched and preserves the original scribbly small text.
3. **Rendered 星 and 河** with `Hiragino-Sans-GB-W6` at 240pt, trimmed, then **resized each glyph to 234×160** (wider than tall) to match the squat proportions of the original AI glyphs. Fill color `#f0b048` (yellow-orange, sampled from the original glyph color).
4. Composited at `+5+34` and `+5+208` to align with the y-positions of the originals.

## Why the band patch is 240 wide

The wide upper section of the magenta band runs `x=0..240`, not `x=0..145` as I first assumed — the original glyphs hang off the band and a first-pass patch that was only as wide as the glyphs themselves left a thin dark strip of the original band visible at the right.

## Why the clean tile was tricky to find

Most "clean-looking" strips of the band contain small orange characters or scratches. Sampling a strip with even one such artifact creates a horizontal repeat band of fake glyph residue across the whole patch. The `x=0..145, y=380..420` region was the largest contiguous purple area I could find.

## Reproduction

The original is preserved; the work can be redone by re-rendering the chars (Hiragino Sans GB W6 → resize 234×160 → composite at +5+34 / +5+208) over a freshly sampled band patch.
