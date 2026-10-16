/* @ds-bundle: {"format":4,"namespace":"Prass","components":[{"name":"SiteNav"},{"name":"Log"},{"name":"ProjectTable"},{"name":"ArticleHeader"},{"name":"PostListItem"},{"name":"Verse"},{"name":"CodeBlock"},{"name":"Tag"},{"name":"Button"},{"name":"Mark"}]} */
(function () {
  var React = window.React;
  var h = React.createElement;
  function cx() { return Array.prototype.filter.call(arguments, Boolean).join(' '); }
  var BUILT = { pushed: 1, release: 1, project: 1 };
  var DAY = 86400000;
  function daysBetween(a, b) { return Math.round((new Date(b) - new Date(a)) / DAY); }
  function isRecent(date, today, within) { if (!date) return false; var d = daysBetween(date, today || new Date().toISOString().slice(0, 10)); return d >= 0 && d <= (within || 30); }

  function Meta(props) {
    var items = (props.items || []).filter(function (x) { return x != null && x !== ''; });
    if (!items.length) return null;
    return h('ul', { className: 'pr-meta pr-meta-list' }, items.map(function (it, i) { return h('li', { key: i }, it); }));
  }

  function Tag(props) {
    var p = Object.assign({}, props); var href = p.href; delete p.href;
    var cls = cx('pr-tag', 'pr-focus', p.className); delete p.className;
    return href ? h('a', Object.assign({ href: href, className: cls }, p)) : h('span', Object.assign({ className: cls }, p));
  }

  function Button(props) {
    var p = Object.assign({}, props);
    var variant = p.variant || 'quiet'; delete p.variant;
    var cls = cx('pr-btn', 'pr-focus', variant !== 'quiet' && 'pr-btn-' + variant, p.className); delete p.className;
    if (p.href) return h('a', Object.assign({ className: cls }, p));
    return h('button', Object.assign({ type: 'button', className: cls }, p));
  }

  function Mark(props) { return h('mark', { className: 'pr-mark' }, props.children); }

  function RecentDot(props) {
    return props.on ? h('span', { className: 'pr-dot pr-dot-active', role: 'img', 'aria-label': 'Active in the last 30 days', title: 'Active in the last 30 days' }) : h('span', { className: 'pr-dot-space', 'aria-hidden': 'true' });
  }

  function SiteNav(props) {
    var items = props.items || [
      { label: 'log', href: '/' }, { label: 'projects', href: '/projects/' }, { label: 'writing', href: '/blog/' },
      { label: 'verse', href: '/verses/' }, { label: 'podcast', href: '/podcasts/' }, { label: 'about', href: '/about/' }
    ];
    return h('nav', { className: 'pr-nav pr-root', 'aria-label': 'Site' },
      h('a', { className: 'pr-wordmark pr-focus', href: props.homeHref || '/' }, props.name || 'prassanna.io'),
      h('ul', { className: 'pr-nav-list' }, items.map(function (it) {
        return h('li', { key: it.href }, h('a', { className: 'pr-nav-link pr-focus', href: it.href, 'aria-current': it.href === props.current ? 'page' : undefined }, it.label));
      }))
    );
  }

  /* Log: everything made, in one dated list. Built things are named in mono, written things in serif. */
  var FILTERS = [
    { id: 'all', label: 'all' }, { id: 'built', label: 'built', kinds: ['pushed', 'release', 'project'] },
    { id: 'essay', label: 'essays', kinds: ['essay'] }, { id: 'poem', label: 'verse', kinds: ['poem'] }, { id: 'episode', label: 'podcast', kinds: ['episode'] }
  ];
  function LogEntry(props) {
    var e = props.entry, built = !!BUILT[e.kind];
    return h('li', { className: cx('pr-log-row', built ? 'pr-log-built' : 'pr-log-written') },
      h('span', { className: 'pr-log-date pr-meta' }, h(RecentDot, { on: built && isRecent(e.date, props.today) }), h('time', { dateTime: e.date }, e.date)),
      h('span', { className: 'pr-log-kind pr-meta' }, e.kind),
      h('span', { className: 'pr-log-title' }, h('a', { href: e.href || '#', className: 'pr-focus' }, e.title)),
      e.detail ? h('span', { className: 'pr-log-detail' }, e.detail) : null
    );
  }
  function Log(props) {
    var s = React.useState(props.initialFilter || 'all'), filter = s[0], setFilter = s[1];
    var f = FILTERS.filter(function (x) { return x.id === filter; })[0] || FILTERS[0];
    var entries = (props.entries || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; })
      .filter(function (e) { return !f.kinds || f.kinds.indexOf(e.kind) >= 0; });
    if (props.limit) entries = entries.slice(0, props.limit);
    return h('section', { className: 'pr-log pr-root', 'aria-label': props.title || 'log' },
      h('div', { className: 'pr-log-head' },
        h('h2', { className: 'pr-section' }, props.title || 'log'),
        props.filters === false ? null : h('div', { className: 'pr-filters', role: 'group', 'aria-label': 'Filter the log' }, FILTERS.map(function (x) {
          return h('button', { key: x.id, type: 'button', className: 'pr-filter pr-focus', 'aria-pressed': x.id === filter, onClick: function () { setFilter(x.id); } }, x.label);
        }))
      ),
      entries.length ? h('ol', { className: 'pr-log-list' }, entries.map(function (e, i) { return h(LogEntry, { key: e.date + e.title + i, entry: e, today: props.today }); }))
        : h('p', { className: 'pr-empty pr-meta' }, 'Nothing here yet.'),
      props.moreHref ? h('div', { className: 'pr-log-more' }, h(Button, { variant: 'text', href: props.moreHref }, props.moreLabel || 'Full log')) : null
    );
  }

  /* ProjectTable: a spec sheet of projects. */
  function ProjectTable(props) {
    var rows = props.projects || [];
    return h('section', { className: 'pr-projects pr-root', 'aria-label': props.title || 'projects' },
      props.title === false ? null : h('div', { className: 'pr-log-head' }, h('h2', { className: 'pr-section' }, props.title || 'projects'),
        props.count ? h('span', { className: 'pr-meta' }, props.count) : null),
      h('table', { className: 'pr-table' },
        h('thead', null, h('tr', null,
          h('th', { scope: 'col' }, 'name'), h('th', { scope: 'col' }, 'what it does'), h('th', { scope: 'col' }, 'lang'),
          h('th', { scope: 'col' }, 'last push'), h('th', { scope: 'col' }, 'since'))),
        h('tbody', null, rows.map(function (p) {
          return h('tr', { key: p.name },
            h('th', { scope: 'row', className: 'pr-td-name' }, h('a', { href: p.href || '#', className: 'pr-focus' }, p.name)),
            h('td', { className: 'pr-td-what' }, p.summary),
            h('td', { className: 'pr-td-data', 'data-label': 'lang' }, p.language),
            h('td', { className: 'pr-td-data', 'data-label': 'last push' }, h('span', { className: 'pr-push' }, h(RecentDot, { on: isRecent(p.lastPush, props.today) }), p.lastPush)),
            h('td', { className: 'pr-td-data', 'data-label': 'since' }, p.since));
        }))
      ),
      props.moreHref ? h('div', { className: 'pr-log-more' }, h(Button, { variant: 'text', href: props.moreHref }, props.moreLabel || 'All projects')) : null
    );
  }

  function ArticleHeader(props) {
    return h('header', { className: 'pr-frame pr-article-head pr-root' },
      h('div', { className: 'pr-margin' }, h(Meta, { items: [props.kind || 'essay', props.date, props.readingTime, props.series] })),
      h('div', null,
        h('h1', { className: 'pr-title' }, props.title),
        props.lead ? h('p', { className: 'pr-lead' }, props.lead) : null,
        props.topics && props.topics.length ? h('ul', { className: 'pr-tags' }, props.topics.map(function (t) {
          var label = typeof t === 'string' ? t : t.label;
          return h('li', { key: label }, h(Tag, { href: typeof t === 'string' ? undefined : t.href }, label));
        })) : null
      )
    );
  }

  function PostListItem(props) {
    return h('li', { className: 'pr-frame pr-post pr-root' },
      h('div', { className: 'pr-margin' }, h(Meta, { items: [props.date, props.series] })),
      h('div', null,
        h('h3', { className: 'pr-post-title' }, h('a', { href: props.href || '#', className: 'pr-focus' }, props.title)),
        props.summary ? h('p', { className: 'pr-post-summary' }, props.summary) : null
      )
    );
  }

  function Verse(props) {
    var stanzas = props.stanzas || [];
    var every = props.numberEvery || 4;
    var n = 0;
    return h('article', { className: 'pr-verse pr-root' },
      props.title ? h('h2', { className: 'pr-verse-title' }, props.title) : null,
      stanzas.map(function (lines, si) {
        return h('ol', { className: 'pr-stanza', key: si, start: n + 1 }, lines.map(function (line, li) {
          n += 1;
          return h('li', { className: 'pr-line', key: li },
            h('span', { className: 'pr-line-no', 'aria-hidden': 'true' }, n % every === 0 ? String(n) : ''),
            h('span', { className: 'pr-line-text' }, line));
        }));
      })
    );
  }

  function CodeBlock(props) {
    var s = React.useState(false), copied = s[0], setCopied = s[1];
    function copy() {
      try { navigator.clipboard.writeText(props.code || ''); } catch (e) {}
      setCopied(true); setTimeout(function () { setCopied(false); }, 1600);
    }
    return h('figure', { className: 'pr-code pr-root' },
      h('figcaption', { className: 'pr-code-head pr-meta' },
        h('span', null, props.filename || props.lang || ''),
        h('button', { type: 'button', className: 'pr-code-copy pr-focus', onClick: copy }, copied ? 'Copied' : 'Copy')),
      h('pre', null, h('code', null, props.code))
    );
  }

  var api = { SiteNav: SiteNav, Log: Log, ProjectTable: ProjectTable, ArticleHeader: ArticleHeader, PostListItem: PostListItem, Verse: Verse, CodeBlock: CodeBlock, Tag: Tag, Button: Button, Mark: Mark };
  window.Prass = Object.assign(window.Prass || {}, api);
})();
