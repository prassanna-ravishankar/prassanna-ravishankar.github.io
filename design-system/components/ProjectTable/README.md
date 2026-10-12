# ProjectTable
The projects index as a spec sheet, with columns for name, what it does, language, last push and the year it started.

- Provide `projects`: `{name, href, summary, language, lastPush, since}`, plus `today`, and optionally `count` (shown at the right of the head, e.g. "14 projects"), `title` (default `projects`; false hides the head) and `moreHref`.
- `name` is the package or repo name in mono, exactly as published. `summary` is one sentence in plain words, saying what it does rather than what it's built with.
- `lastPush` comes from GitHub at build time. A marigold dot marks pushes in the last 30 days. Don't add a hand-set status column; the dates show what's alive.
- Order rows by last push, newest first. On narrow screens each row stacks: the name, the summary, then a line of mono data.
- No logos, screenshots or star counts in the table. Those belong on a project's own page.
