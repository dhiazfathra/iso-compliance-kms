# Evidence

Executed proof for claims made in a task, PR, or session — kept as artifacts,
not just prose in a chat transcript. Response discipline requires "verified,
not claimed"; this folder is where the verification is preserved so a
reviewer (or a later agent) can check it without re-running everything.

## Why this exists

A commit message or PR description can say "tested, works." Six months
later nobody can tell whether that was true, what was actually run, or
what it looked like. This folder answers those questions permanently:

- **What command was run** — exact, copy-pasteable.
- **What it returned** — exit codes, HTTP statuses, full output, not a
  summary.
- **What it looked like** — a screenshot or short video when the claim is
  about UI, rendering, or something a status code alone can't prove (a
  page loading vs. rendering correctly, a broken layout, a wrong value on
  screen).

Code and text logs are not always enough. `curl -o /dev/null -w
"%{http_code}"` proves a server responded; it does not prove the Scalar
viewer actually rendered a usable page instead of a blank div with a JS
error. A screenshot or a short recording closes that gap.

## Structure

One folder per task, numbered sequentially, git-tracked next to the code
it verifies:

```
docs/evidence/
├── README.md                              this file
├── 0001-<task-slug>/
│   ├── <finding>.md                        narrative + exact commands + output
│   ├── <finding>-screenshot.png
│   └── <finding>-walkthrough.webm
└── 0002-<next-task-slug>/
    └── ...
```

- **Number**: monotonically increasing, matches `registry.jsonl` entries
  where useful but is its own sequence — it never gets reused or reordered.
- **Slug**: short, matches the task/commit it backs (`docker-compose-podman-support`).
- **One `.md` per finding or claim**, not one giant file per task. A
  reviewer checking "does the health check work" shouldn't have to wade
  through unrelated build logs.

## What goes in the `.md`

Same shape as an RCA/verification section, self-contained:

```markdown
# Evidence: <claim being verified>

Task: <what this backs> (commit `<sha>`).

## Command run

​`
<exact command>
​`

## Output

​`
<full output, not a paraphrase>
​`

## Screenshots / video

![alt text](./<file>.png)

## Cleanup

​`
<teardown command, if the verification stood up state>
​`
```

Rules:

- Paste real output from a command actually run in the session. Never
  write an example from memory or "what it should look like."
- Include exit codes / HTTP status codes explicitly, not just "it worked."
- If something failed or behaved unexpectedly (like a bind interface
  making an endpoint unreachable from outside a container), record that
  too, with the explanation — that's evidence a design decision holds, not
  noise to omit.

## Screenshots and video

Use when a status code or log line can't prove the claim on its own —
UI rendering, visual layout, an interactive flow, anything a reviewer
would otherwise have to reproduce locally to trust.

- **Screenshot**: PNG, named `<finding>-<what-it-shows>.png`. Caption it
  in the markdown with what to look for, not just "screenshot of the page."
- **Video**: short (a few seconds is enough — a walkthrough of the exact
  flow being verified, not a long unattended recording). WebM from
  `agent-browser record start/stop` is the default; keep it under a few
  hundred KB. Confirm it's non-empty and playable before committing
  (`ffprobe -show_entries format=duration,size`) — a corrupt or 0-byte
  recording is worse than no recording, it's a false claim of evidence.
- Don't screenshot text that a `curl` output already proves adequately
  (a raw JSON response, a plain 200 status). Save images for what only an
  image can show.

## Capturing it

This repo has no running browser session by default; build it, serve it,
spin a browser up for the capture, then tear both down:

```bash
bun run build
PORT=3111 bun run start &                       # or whatever the task needs running
npx --yes agent-browser record start docs/evidence/000N-slug/name.webm http://localhost:3111/local/import
npx --yes agent-browser upload 'input[type=file]' "$PWD/compliance-pack"
npx --yes agent-browser screenshot docs/evidence/000N-slug/name.png
npx --yes agent-browser record stop
npx --yes agent-browser close --all
lsof -ti:3111 | xargs kill -9
```

Serve the build you actually changed. A stale `next start` still holding the
port makes the new one exit with `EADDRINUSE` and the browser keeps loading
the old bundle — which looks exactly like the fix not working. Check the
server log, not just the page.

## What doesn't belong here

- Speculative "expected output" — evidence is post-hoc, not planned.
- Duplicated content already in `registry.jsonl` or an ADR — link to
  those instead of repeating them.
- Anything containing secrets, tokens, or real user data captured
  incidentally in a screenshot — redact or don't capture.
