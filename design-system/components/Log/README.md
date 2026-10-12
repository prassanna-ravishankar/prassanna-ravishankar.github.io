# Log
Everything you make, in one dated list: pushes, releases, essays, poems, episodes. It's the home page and the site's front door.

- Provide `entries`: `{date, kind, title, href, detail}`. `kind` is one of `pushed`, `release`, `project` (things built) or `essay`, `poem`, `episode` (things written). Also pass `today` (ISO date) so recent activity can be marked, plus optionally `limit`, `title` (default `log`), `filters` (false hides them), `initialFilter`, `moreHref` and `moreLabel`.
- Built things are named in mono (`item`), and written things in serif (`entry`). That alternation is the point: the page shows both kinds of work interleaved.
- A marigold dot marks built entries from the last 30 days. It's computed from the date, never set by hand.
- `detail` is optional and short (a one-line description, the series, an episode length). It truncates on one line on desktop.
- Generate `pushed` entries at build time from the GitHub API (pushed_at per public repo, excluding forks and the site repo itself), and `release` entries from GitHub Releases. Don't hand-write them.
- The filters are all, built, essays, verse and podcast. With no entries for a filter, the log shows "Nothing here yet."
