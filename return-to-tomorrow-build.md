# Compiling SuperCollider to a Vocal Synth for an Opera

I spent the last few years writing an opera by typing it.

Every note, every word, every breath is in a text file. The instrumental
parts run in [SuperCollider](https://supercollider.github.io/). The
singing is rendered by [Synthesizer V](https://dreamtonics.com/synthesizerv/),
a Vocaloid-style voice synth. They talk to each other through a small
pipeline I wrote: SuperCollider code emits Synthesizer V project files,
SV renders them to audio, and the audio streams back into SC for
playback alongside the rest of the score.

The piece is called *Return to Tomorrow*, after the Star Trek episode
it's based on.

> **\[Embed: 30-second demo clip — code-on-left, Star Trek footage, singing voices, SC post window on right\]**

---

## The pipeline

```
  Neovim (scnvim)
       │
       ▼
  SuperCollider                                    Synthesizer V
  ┌────────────────────┐                          ┌──────────────────┐
  │ Songs/*.scd        │                          │ .svp project     │
  │  ├─ lyrics         │   .svp JSON              │ (notes, lyrics,  │
  │  ├─ MIDI notes     │ ───────────────────────► │  phonemes,       │
  │  ├─ Pseq durations │                          │  vocal params)   │
  │  └─ vocal params   │                          └────────┬─────────┘
  │                    │                                   │ render
  │   PlayBuf ◄──────────────────── synthV_MixDown.wav ◄───┘
  │   alongside synths │
  └────────────────────┘
```

The system is bidirectional. SuperCollider drives the timeline and
orchestration. Synthesizer V is, in effect, a sampler that I shell out
to. When I change a lyric or shift a rhythm, the relevant section gets
recompiled, re-rendered, and the new audio buffer drops into the
playback graph.

## A song, as text

Songs live in `Songs/01-becoming-visual.scd` and similar files. A
section looks like this:

```supercollider
Song(\visual,[]).current;

["The reading's growing stronger, Captain.",
 "1 -6.5 1 3 5 11 5 4 3".dm('c#', \whole)].addLine;
```

The string is the lyric. The `"1 -6.5 1 3 5 11 5 4 3".dm('c#', \whole)`
is a tiny DSL for the melody: scale degrees in C# whole-tone, with `-6.5`
meaning "a microtonal step below". I wrote `.dm` (degrees-to-midi) so I
could think in scale degrees instead of MIDI numbers, the way I'd
sketch a tune on paper.

A part declaration assigns the section to a singer:

```supercollider
P.synthVs(role: \sulu, take: [\lead, \double], params: {|p b| [
  lyrics: "the readings + growing + stronger + captain +",
  legato: [[1, 1, 1, 1, 1, 1, 0.7, 1, 0.9]],
  filter: (midinote: _ - 12),
  pitchTake: [1, 3],
  paramTension: 1
]}, music: { ... });
```

`role: \sulu` says: render this with the Sulu voice. `take: [\lead, \double]`
says render two takes and double them. `params` is the closure that
gets called at render-time with the current durations and produces the
key/value pairs Synthesizer V cares about.

## The translator

Here's the core of the SC→SV translator
(`MW-Classes/SynthV.sc`, abridged):

```supercollider
set { |event|
    // Convert durations to "blicks" (SynthV's internal time unit)
    event.dur = [0] ++ event.dur.integrate + (event.lag ? 0)
                  => _.differentiate => _.drop(1);
    event.dur = event.dur + firstNoteOffset * 2 * 70560 => _.asInteger;

    // Compute note onsets from duration deltas
    event.onset = [0] ++ event.dur.integrate => _.dropLast()
                    + ((event.lag !? _[0] ? 0) * 70560 * 2);

    // Format as SynthV expects: integer string with "0000" suffix
    event.duration = event.dur * (event.legato ? 1)
                       => _.collect{|i| i.asInteger.asString ++ "0000"};
    event.onset = event.onset.collect{|i| i.asInteger.asString ++ "0000"};

    event.keys.do{|i|
        case
        { [\dur, \legato, \lag].includes(i) }{ nil }
        { i == \vocalMode } { /* set voice preset params */ }
        { envelopes.includes(i) } { this.setEnv(i, event.at(i)) }
        { true } { this.setNotes(i, event.at(i)) }
    };

    this.filterRests;
    this.setGroupEnd;
}
```

It's a small compiler. SC durations become blicks. Lyrics get split
on spaces, with `+` as a hold-over syllable. Pitches become MIDI ints.
Envelope curves (pitch bend, breathiness, gender) become SV envelope
points. At the end, `writeProject` dumps the .svp JSON, a shell script
shells out to Synthesizer V to render, and the resulting .wav lands at
a known path:

```supercollider
render {
    this.buildFunc.value;
    this.writeProject;
    directory +/+ "SCRIPTS/renderSynthesizerV.sh".standardizePath
        + file => _.unixCmd;
    fork{ this.buffer.wait; this.buffer.() };
}
```

The render script is AppleScript GUI automation — Synthesizer V doesn't
have a real headless mode. It's deeply unglamorous. It works.

## Why Neovim, and what it turned into

I had spent a few years trying to write electronic music in Ableton
Live, and I was tired of it. Tired of mousing to the same six panels,
tired of the conceptual seams between MIDI editor and arrangement
view, tired of working through someone else's metaphors for what
music is.

SuperCollider is text. Text is editable. So I edit it in Neovim with
[scnvim](https://github.com/davidgranstrom/scnvim), which talks to a
running SC interpreter, and I get the thing I actually wanted: a
composition environment where the source of truth is files in a
directory, and where the editor itself is a programmable instrument.

Over time the whichkey config grew into something I think of as a
DAW IDE — the editor itself became the transport panel. Some real
bindings, abbreviated from `~/.config/nvim/lua/config/which-key.lua`:

```lua
{ "<localleader>p",  function() sc.send("Song.play") end,        desc = "play Song" },
{ "<localleader>n",  function() sc.send("Song.playOnly()") end,  desc = "play only again" },
{ "<localleader>,",  ":call SCSend('Part.play')<CR>",            desc = "play Part" },
{ "<localleader>ii", "yaw:call SCSend('Song.current.<word>.play')<CR>",
                                                                  desc = "play part under cursor" },
{ "<localleader>cd", function() sc.send("Song.cursor_(Song.cursor - 1)") end,
                                                                  desc = "decrement cursor" },
{ "<localleader>se", function() sc.send("Nvim.e(Song.currentSong.loadedFrom)") end,
                                                                  desc = "edit current Song" },

-- SynthV bindings: open the .svp in the SV app, re-render, etc.
{ "<localleader>vo", function() sc.send("Part.current.synthV.open") end,
                                                                  desc = "open synthV" },
{ "<localleader>vr", function() sc.send("Part.current.synthV.render") end,
                                                                  desc = "render synthV" },
{ "<localleader>vs", function() sc.send("SynthV.renderSection") end,
                                                                  desc = "render SynthVs in section" },
```

There's a `<localleader>i` group called `"ii for part name under cursor"`
— I put my cursor on a part identifier in the score, type `ii`, and
that part plays. There's `<localleader>se` that jumps me back to the
Song file I'm currently working on, no matter where I am. There's an
`<localleader>r` group that pipes a part out to Reaper for the live
instrumentalists who play alongside the synths.

It is a DAW. It's just that every button is something I typed.

The "what do I want to type to get this result" question is the whole
discipline. `"1 -6.5 1 3 5 11 5 4 3".dm('c#', \whole)` is what fell
out of asking it about melodies. `P.synthVs(role: \sulu, take: [\lead, \double], ...)`
is what fell out of asking it about vocal parts. The keybindings are
what fell out of asking it about *operating* the score.

## Tapping rhythms

This is the part of the system I'm most fond of.

You can write durations as numbers — `Pseq([0.5, 0.5, 1, 0.25, ...])` —
but human rhythm doesn't sit on a grid. So there's a small tool called
`rhythmRecorder` that lets me tap the rhythm in on a MIDI keyboard while
a click and a "stepper" play the corresponding notes. Each tap records
the interval since the last tap. When I'm done, those intervals become
the durations the synth will sing.

```supercollider
recorder = (
    time: Main.elapsedTime,
    item: List.new,

    captureLoop: { |self char|
        Routine({
            loop {
                self.item = self.item.add(Main.elapsedTime - self.time);
                synth.set(\t_trigger, 1);
                self.time = Main.elapsedTime;
                char = 0.yield;
            }
        })
    },

    ret: { |self|
        var recorded = self.item.round(0.001)[1..(self.item.size)];
        (self.range[0] .. self.range.clipAt(1)).do({ |i|
            var returnChunk = List.new;
            var elements = song.tune[i].list.size;
            elements.do({ |i|
                if (recorded.size > 0) { returnChunk.add(recorded.removeAt(0)) }
            });
            if (returnChunk[0].notNil) {
                song.durs[i] = Pseq(returnChunk)
            };
        });
    }
);
```

I tap a line. I hit `r` to commit. The captured times slide into
`song.durs[section]` as a `Pseq`. The next time the part renders, the
synth sings the line with my rhythm — including all the lopsidedness
I tapped in.

It's the moment where the pipeline stops being a compiler and starts
being a duet. I'm performing the timing into the score. The synth
performs the syllables back.

## A note on AI vocals

Synthesizer V is sometimes called an "AI voice synth," and that term
has a lot of baggage right now. To be precise: Synthesizer V is a
**sampler with a neural vocoder**. It doesn't generate lyrics. It
doesn't decide pitches. It doesn't improvise. Every word, every note,
every phoneme, every breath comes from a project file I wrote. The
"AI" part is the rendering — the way the model interpolates between
sampled phonemes to produce a continuous sung line.

Calling it AI is technically correct, but it's the same kind of AI as
upscaling a texture. The composition is mine.

## What this is and isn't

It isn't a framework. It isn't a library you can install. It's the
custom toolchain that one piece of music happens to be made of. The
SuperCollider classes — `Song`, `Part`, `SynthV`, `rhythmRecorder` —
are shaped by the needs of *Return to Tomorrow* and would probably
need surgery to fit a different piece.

But the shape of it might be useful. The compiler-pattern for vocal
synths in particular feels like it generalizes: any text-based
composition environment could emit .svp files for SV, or .vsqx for
Vocaloid, and shell out to render. The hard part — keeping the
rendered audio in sync with a live composition — turns out to be
mostly bookkeeping.

## Watch / read more

- **Full piece:** \[link to opera/return-to-tomorrow.html\]
- **Code:** \[TBD — open subset? gist? "ping me"?\]
- **About me:** [cdbzb.com](https://cdbzb.com)

If you've built anything like this — or want to — I'd love to hear from
you.
