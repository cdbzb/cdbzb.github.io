# artist-site

Michael Webster's artist archive site. Plain HTML/CSS/JS, no build step.
Deployed via GitHub Pages (see `CNAME`) — **the repo root is web-served, so
anything committed here is publicly fetchable.**

## Project state lives elsewhere

Current status, next actions, open threads, and asset provenance are in
`~/home/org_roam_files/artist-site.org`, not in this repo. Read that first.

Planning notes, decisions, and to-do lists belong there. Keep this repo to
code, content, and media.

## Conventions

- New HTML pages must include the GoatCounter analytics snippet.
- Heavy video is symlinked into `media/` for local dev and not committed.
  Small tile clips (<5MB) are real files.
- Local dev: `python3 -m http.server 8080` from this directory.

## Content docs already in this repo

- `return-to-tomorrow-build.md` — the Hacker News build page draft. Gating
  item tracked in `~/home/org_roam_files/rtt-hn-post.org`.
- `return-to-tomorrow-brief.md` — shorter RTT brief.
- `xinghe-notes.md` — ImageMagick steps for `images/xinghe-cover.jpg`.
