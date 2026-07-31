# Return to Tomorrow — Website Update Brief

## Goal

Improve the `opera/return-to-tomorrow.html` page on cdbzb.com.

## Changes to Make

### 1. Replace the short description

Current text:
> Opera by Michael Webster, 2025.
> "Return to Tomorrow" is an opera based on a Star Trek episode written in the SuperCollider programming language, every note entered by hand. All sounds are synthesized, including the singing. Still images from the original 1968 TV show are seen fading into and out of the code that is being interpreted: a mashup of live-coding and classic TV. A voice emanates from a dead planet. Aliens who have lost their bodies seek to build humanoid robots to house their consciousnesses. Drama ensues…

Replace with:

> Opera by Michael Webster. Developed 2022–2025. [dates TBC]
>
> A composed opera in which code serves as both score and instrument — every note, rhythm, and sung syllable entered by hand in SuperCollider, performed by the software reading its own instructions.

Notes:
- Remove "2025" standalone date (implies just finished; replace with development span)
- Remove "mashup of live-coding and classic TV" — the work is **not** live coding or generative; it is a fixed composed work
- "live-coding" and "generative" are both inaccurate and should not appear anywhere on the page

### 2. Add program note with "Read more" toggle

After the short description above, add a "Read more" expander containing the full program note below. First two sentences of the description serve as the visible lede; the program note provides depth for curators and presenters.

**Program note text:**

All of the music in "Return to Tomorrow" was made by typing text files in the Supercollider programming language. I had gotten sick of interacting with music applications - having to learn where all the controls and buttons are and having to work through someone's metaphors - and decided to code my own. Supercollider is a text-based system, so designing an interface was a matter of asking myself "what do you want to type to get a certain result?".

Something I could never really get to work for me, whether using musical notation or commercial music software, is representing speech-like rhythms. Bars are divided into beats and beats into halves and quarters – but our speech is not so tidy, and in a lot of my music I want the rhythms to be like speech rather than like whole-number divisions of beats or bars.

So in my system, I index all of the music not to bars and beats, or minutes and seconds, but to lines of text (in this case the whole script of a Star Trek episode). Musical notes and gestures are attached to syllables. If I were setting the phrase "you are a lively hipopotamus" I might have a trill which swells up starting at the 'li' in 'lively' and stops at the 'pot' in 'potamus'. To tell the software how much time belongs to each syllable, I have a little tool that lets me tap out the rhythms on my laptop keyboard. And if I re-tap those rhythms at any time, say to draw out the word 'lively' for emphasis, all of the music, even the "singing", will reflow to adapt to the new rhythms - my trill will still stop at 'pot'.

The "singing" is rendered by a voice synth called SynthesizerV (a newer competitor to Vocaloid). These voice synths are part of a burgeoning subculture of people who re-make pop songs and host channels with the voices' avatars... For the regular Star Trek crew I used newer AI voices (Xuan Yu, Feng Li, Cheng Xiou, and Kevin) - the aliens (spoiler alert!) had to get older sample-based voices (Aiko and Genbu) who can't really do English phonemes... For this project I wrote some code that "translates" my Supercollider code into SynthesizerV project files which then renders them and sends them back to Supercollider to play, so that they can re-flow with the rest of the music. So there's nothing "recorded" other than the timing of the syllables - when you hear the piece, you are hearing the poor computer reading through the instructions and sending out the results. You can see the code being interpreted in the left panel, and responses from the interpreter in the "Post" window on the right.

And that's not unlike how I wrote the piece, once the system was working... I read the lines of text, hear what they say if I can, and render a musical thought by typing code. The lines just burble by. And what did I hear? A story about a voice with no body from a dead planet - its yearnings and regrets. And weirdly, the AI that sings the disembodied voice's lines was trained on the performances of a real person who might be dead for all I know... As I wrote the piece I found myself meditating on our situation; some part of *us* has left *our* bodies perhaps! And sometimes I felt as though the whole script was itself some charming awkward bodiless voice reaching out from a dead planet (the 1960s!), or that my voice(s) are...

**Note:** The program note ends mid-sentence. Michael may have a longer version. If not, either complete the final thought or end at a previous sentence before the ellipsis. Flag this for Michael to resolve.

### 3. Add contact line at bottom of page

After the Screenings & Presentations section, add:

> For inquiries about presenting this work, please [contact Michael Webster](../contact.html).

---

## Site Notes

- Static HTML site
- Existing page: `opera/return-to-tomorrow.html`
- The "Read more" toggle can be implemented with a simple `<details>/<summary>` HTML element (no JavaScript needed) or a small JS toggle — match whatever pattern exists elsewhere on the site
- Check whether the site has a shared stylesheet before adding any inline styles

## Open Questions for Michael

1. Confirm development date span (replacing "2025")
2. Complete or truncate the program note ending
3. Confirm whether The Box / Mara McCarthy should be noted anywhere (e.g. "developed in association with The Box, Los Angeles")
4. Consider adding a sentence to the Proposed Installation section describing room/technical requirements
