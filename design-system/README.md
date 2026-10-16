A work log for someone who builds agent infrastructure and also writes. The site holds four kinds of output: open-source projects, essays on agents and ML systems, a podcast on technology and philosophy, and verse. The system treats them as one record of work, with dates on everything and things built shown alongside things written. Mono carries the structure and names what was made. Serif carries anything meant to be read. One indigo accent carries every link and action, and marigold marks what is recent or what matters.

## Principles

- **Show the work.** Lead with evidence of making, not claims about it: dated entries, last-push dates, real names of real repos. Generate activity from GitHub at build time rather than writing it by hand.
- **Chrome last.** No cards, glows, floating pills or hover lifts. If an element doesn't help someone read, scan or find something, remove it.
- **Facts in columns.** On data pages (log, projects) facts sit in fixed columns at `wide-max`. On reading pages they sit in the `margin-col` beside the text, never as an eyebrow above a heading. Under 760px the margin folds into one mono line.
- **Two voices, mono first.** IBM Plex Mono is structure and things built: the wordmark, nav, section heads, project and repo names, dates, data. Newsreader (serif) is the writing: statements, essays, verse, the titles of written work. In the log the two alternate row by row, and that alternation is the identity.
- **One accent, one signal.** `indigo` means "you can act on this". `marigold` means "recent or important": the dot on activity in the last 30 days, the current nav item and filter, and the highlighter used at most once in an essay.

## Content fundamentals

- Write in first person, in plain declarative sentences, as the essays already do: "I have been thinking about this problem for months." Don't hype and don't use exclamation marks.
- Titles keep the case they are published in. UI labels use sentence case: "Subscribe by RSS", "View on GitHub", "Copied".
- Don't use emoji in the UI. Don't use all-caps labels. Don't append arrows to links.
- Dates are ISO (`2026-02-24`) in mono. Reading time is `11 min`. Separate metadata items by space, not by bullets or middle dots.
- Project names are written as their package names, in mono: `repowire`, `modalkit`, `phlow`.
- Structural labels are lowercase mono, like identifiers: nav (log, projects, writing, verse, podcast, about), section heads (log, projects), filters, table headers. Kinds in the log: pushed, release, project, essay, poem, episode.
- Write project summaries as what the thing does, in plain words: "Let your coding agents talk to each other." Don't list the stack.

## Colour

Use two themes, Light and Dark, swapped with `data-theme`. The palette is a cool paper with graphite ink, one indigo and one marigold. Indigo and marigold were chosen as a pair: two old pigments, one for ink and one for the mark.

- Ground: `paper` for every page. `paper-sunk` for code and recessed areas. `paper-raised` only for menus and the command palette.
- Text: `ink` for prose and headings, and `ink-muted` for metadata, leads and summaries. Both clear 5.5:1 on every paper in both themes.
- Lines: `rule` hairlines separate list rows and sit under the nav, and are decorative. `rule-strong` draws borders that carry meaning (button outlines, inputs) at ≥3:1.
- Accent: `indigo` for links, the primary button, tag text and focus. Put white-ish text on it via `on-indigo`. `indigo-soft` is the tag fill.
- Signal: `marigold-soft` sits behind ink for the current nav item, the pressed filter, `Mark` and text selection. Full `marigold` is only for the recent-activity dot (ringed in `on-marigold` so it holds 3:1) and the cover. It is never text on paper.
- Focus ring: 2px solid `focus` (= `indigo`), offset 2px, on every interactive element.

## Type

- Set essays in `body` (Newsreader 19/31) at `measure` (36rem, about 68 characters), left-aligned and ragged right. Never justify.
- Use `title` for the page's single h1, `lead` (italic, `ink-muted`) for its subtitle, `heading` for h2 and `subheading` for h3 and list titles.
- Use `statement` once, for the home page's opening sentence. Use `entry` for written titles in the log, beside `item` (mono) for built names.
- Set poems in `verse` (20/36). The extra leading is deliberate.
- Mono styles: `wordmark` (18px, 500) for `prassanna.io`, `section` (15px, 500) for section heads, `item` (16px, 500) for project and repo names, `label` (14px, 500) for nav, buttons, filters and tags, `table` (14px) for data cells, `meta` (13px) for dates, kinds and margin facts, and `code` (14.5px) for listings. Set inline code at 0.85em.
- Newsreader is a variable font with an optical-size axis. Keep `font-optical-sizing: auto` so titles take the sharper display cut and body text the sturdier text cut.

## Layout and spacing

- There are two widths. Reading pages use `page-max` (50rem): `margin-col`, a `space-6` gap, then `measure`. Data (the nav, log and projects table) uses `wide-max` (64rem). Both are left-aligned with a `space-24` left offset on wide screens, not centred.
- Use the 4px spacing scale from `space-1` to `space-24`. Prose paragraphs are separated by one body line (`space-8`), and h2s get `space-12` above.
- Log and table rows are dense: `space-3` top and bottom, divided by `rule`. A data section's head sits over a 1px `ink` line, the only full-strength rule. Essay lists keep `space-6` rows. No grids of cards.

## Shape, depth and motion

- Radii are nearly square: `radius-sm` (2px) for tags, code and marks, `radius-md` (4px) for buttons, code blocks and images, and `radius-lg` (8px) for menus only.
- There are no shadows. Depth comes from `paper-sunk` and `paper-raised`, never from blur.
- Motion is only feedback: link underline thickening, a Copy that becomes Copied. There are no entrance animations, scroll reveals or floating gradients. Respect `prefers-reduced-motion`.

## Imagery and iconography

- Images sit in the text column at `measure` width with `radius-md`, with a mono `meta` caption below. Hero images are optional and go above the title, never behind it.
- There is no icon set. Recency is a dot plus a date, and links say where they go. If an icon is ever required (RSS, GitHub), use a single 16px outline glyph in `ink-muted`.
- The mark is a mono "p" followed by the marigold dot, on an `indigo` tile for the favicon and app icons, or bare in `ink` or `paper` elsewhere (see the Logos group). The wordmark is `prassanna.io` set in `wordmark`. Use the mark where space is square and small, and the wordmark everywhere else.

## Components

`SiteNav`, `Log`, `ProjectTable`, `ArticleHeader`, `PostListItem`, `Verse`, `CodeBlock`, `Tag`, `Button`, `Mark`, plus `HomePage`, the landing page composed from them. Each component's guidelines say what props to provide. All of them read tokens only, so a theme switch needs no component changes.
