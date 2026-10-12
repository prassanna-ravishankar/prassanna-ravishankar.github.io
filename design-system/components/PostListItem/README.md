# PostListItem
One row of the writing index: date and series in the margin, title and one-line summary beside it.

- Render inside a `<ul class="pr-list">`. Rows are divided by `rule` hairlines; there are no cards and no thumbnails.
- Provide `title`, `href`, `date`, and optionally `series` and `summary` (the post's description, cut to one sentence).
- Title hover turns `indigo` with an underline. The row itself is not a click target.
