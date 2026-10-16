# SiteNav
The site header: the `prassanna.io` wordmark in mono on the left, and lowercase mono sections on the right over a `rule` hairline.

- Provide `items` ({label, href}) and `current` (the href of the page's section). The current item gets a `marigold-soft` highlight and `aria-current="page"`.
- Defaults: log (home), projects, writing, verse, podcast, about. They point at `/`, `/projects/`, `/blog/`, `/verses/`, `/podcasts/` and `/about/`, so existing URLs keep working.
- Labels are lowercase because they read as identifiers, like the wordmark. The nav spans `wide-max`.
- It sits in the page flow, not fixed or floating, with no blur, pill container or shadow. On narrow screens the list wraps under the wordmark.
