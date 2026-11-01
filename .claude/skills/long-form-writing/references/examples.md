# Examples

Before/after pairs. Most "after" passages are taken from, or edited from, posts on this site; "Show the work" and "Write from the question" paraphrase Armin Ronacher and Julia Evans.

---

## Open with the position

### Before

> As autonomous agents become more prevalent, understanding their failure modes is increasingly important. Recent research has shed new light on how agents behave over long-horizon tasks, and these findings have significant implications for how we think about reliability.

### After (`when-the-output-lies.md`)

> A few months ago I wrote about agent drift, the phenomenon where autonomous AI agents degrade over long-horizon tasks through accumulated context pollution. [...] All of them, at root, problems of what the agent knows and how it attends to what it knows.
>
> That framing is incomplete.

The reader knows the argument by the second paragraph, and the short line carries it.

---

## Write as one person

### Before

> We believe this approach represents a meaningful step toward more reliable coordination, though we acknowledge there is much work still to be done.

### After

> I think pull-based context is what's missing. Every option today makes you write things down ahead of time and hope they're still true when someone needs them.

---

## Split the overloaded sentence

### Before (`vibe-bottleneck.md`)

> The superfolder hack involves cloning all your repos into one parent directory and pointing your agent there, which technically grants visibility across everything but causes your repo-specific CLAUDE.md files to conflict, confuses your rules, and fills the context window with code the agent doesn't need.

### After

> The superfolder hack: clone every repo into one parent directory and point the agent at it. Now it can see everything. It also loads every CLAUDE.md at once, the rules conflict, and the context fills with code it doesn't need. You've traded specialization for visibility and got neither.

---

## Answer the doubt in the reader's words

### Before

> While some may argue that this advantage could be temporary, there are arguably several reasons to believe it may persist.

### After

> At this point you might object: this works today, but why would it still work in a year?
>
> Fair question. Two reasons.

---

## Show the work

### Before

> I give my agents a high degree of autonomy and keep tooling lightweight, which has worked well in practice.

### After

> I run Claude Code with every permission check off, inside a container. My custom tools are plain scripts it can call. When it needs the database it uses `psql`, which is more than good enough.

The reader can copy the setup or argue with it. "A high degree of autonomy" gives them nothing to do either.

---

## Write from the question

### Before

> Git's terminology around HEAD can be a source of confusion for developers.

### After

> A head is a branch and `HEAD` is the current branch. I think that's the weirdest naming choice in git, and after years of using it I still have to look up which side is "ours" during a rebase.

No authority claimed, nothing invented, and it's still first person.

---

## Don't invent the stake

### Before (fabricated)

> I've spent countless late nights wrestling with flaky multi-agent handoffs, and it's taught me one thing above all.

### After

Either drop the anecdote and argue the point directly, or leave a note for the author:

> [Ask Prass: has a handoff failure actually bitten you? A specific incident would anchor this section.]

---

## Story carrying depth

### After (`vibe-bottleneck.md`)

> The root cause was Cloudflare: ExternalDNS was auto-activating the Cloudflare proxy regardless of how many times I manually disabled it, and that proxy was interfering with certificate validation. The SSL error was real but it was a symptom rather than the cause [...] Instead I was the relay, transmitting "SSL error" because that's what I understood from the surface, and two hours of downtime followed because the human in the loop was a lossy channel.

A real failure, told plainly, makes the abstract claim (humans are lossy relays) concrete before the post generalises it.

---

## Depth that still lands

### Before (`agent-drift.md`)

> On earlier, shorter benchmarks, frontier models routinely scored above 70%. On SWE-bench Pro, those same models landed around 23%. Claude Opus 4.1 and GPT-5 both. A fifty-point collapse with no change to the underlying model.
>
> That gap is not a capability problem. It is a duration problem.

### After

> On earlier, shorter benchmarks, frontier models routinely scored above 70%. On SWE-bench Pro, Claude Opus 4.1 and GPT-5 both landed around 23%. The models were the same; the tasks were longer. That is why I think of drift as a problem of duration.

The numbers keep their comparison. The "not X, it is Y" verdict and the dramatic fragments go: they are the cadence that makes prose read as generated.
