# ArticleHeader
The top of an essay: date, reading time and series in the margin column; title, italic lead and topics in the text column.

- Provide `title`, and optionally `kind` (default `essay`; also `poem`, `episode`), `lead` (the subtitle, one sentence), `date` (ISO `2026-02-24`), `readingTime` (`9 min`), `series`, and `topics` (strings or {label, href}).
- Title in `title`, lead in `lead` in `ink-muted`. Use one lead at most, and leave it out rather than repeat the description.
- Metadata goes in the margin, never stacked above the title as an eyebrow.
- Under 760px the margin collapses into a single wrapped mono line above the title.
