# HomePage
The landing page at prassanna.io, built as a work log: one sentence on what you do, then the dated record of what you've made, then the projects table.

Order, top to bottom:
1. `SiteNav` with `current: '/'` (the "log" item).
2. **Intro.** One `statement` sentence ("I build infrastructure for AI agents."), then one body paragraph. The margin holds location, role and lowercase profile links (github, x, linkedin, rss) in `meta`. Under 760px the margin moves below the paragraph.
3. **Log.** The latest 12 entries of everything (pushes, essays, poems, episodes) with filters. Pushes come from GitHub at build time, so the page stays current without hand edits.
4. **Projects.** A `ProjectTable` of about six projects ordered by last push, with the total count at the right of the head.
5. **Footer:** copyright, rss and site source in `meta` over a `rule`.

There's no hero image, featured project, "Now" line or call-to-action pair. The log's dates and the recent-activity dots show what's alive. Data sections span `wide-max`; the intro keeps the reading frame.
