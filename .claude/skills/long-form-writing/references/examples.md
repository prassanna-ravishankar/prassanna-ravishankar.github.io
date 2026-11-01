# Examples

The "after" passages come from Prass's three original posts (`ml-fragmentation.md`, `full-stack-ml.md`, `pipenv-pyenv.md`), lightly edited for typos and dashes. Several "before" passages are real lines from later, AI-assisted posts.

---

## Frame the post

### Before

> As machine learning matures, the ecosystem has grown increasingly complex. This article examines the challenges posed by framework fragmentation and explores potential solutions.

### After (`ml-fragmentation.md`)

> Okay, this is a bit of a rant-post. I've been developing this library called torchwebio. [...] While building it, I was not-so-gently reminded of how fragmented the ML ecosystem looks. It looks a lot like the state of JavaScript frameworks in 2015.
>
> **A small warning**: I am a computer vision guy by trade, so most of this article is going to have computer vision bias. I *try* to be general, but my brain cheats me often.

The reader knows what kind of post this is, why it exists, and where the author's blind spots are, all before the first heading.

---

## Dated history as evidence

### Before

> Newcomers often find fragmented ecosystems difficult to navigate, which can slow adoption and discourage contribution.

### After (`ml-fragmentation.md`)

> I was a web designer back in my university days, up until 2011. My world was HTML4, CSS2 and the good old jQuery. In the subsequent years, HTML5 became a thing, CSS3 happened, and nodejs took over. I wanted to make a website in 2015 and I did not know where to start!

The claim about newcomers is made by one specific newcomer, with years attached.

---

## Question the artifact

### Before

> Configuration files in some frameworks contain parameters irrelevant to the task at hand, which can lead to confusion.

### After (`ml-fragmentation.md`)

> ```yaml
> _BASE_: "../Base-RCNN-FPN.yaml"
> SOLVER:
>   STEPS: (210000, 250000)
>   MAX_ITER: 270000
> ```
>
> Why does an inference step on a single image need to know about `STEPS` or `MAX_ITER`? Why does it even matter? Why does the configuration have a `_BASE_` configuration? What if you send this config over to a friend and forget the base configuration?

The real config is on the page, so every question is one the reader can check.

---

## Think out loud

### Before

> The design evolved from a checkpoint-watching approach to an in-loop hook, which proved more elegant.

### After (`ml-fragmentation.md`)

> My first thought was: "Oh! I could checkpoint my model and have a script run watchdog to look at my checkpoint folder and update an application based on a new checkpoint." Something about that design felt off, it felt too circuitous. I didn't want a separate "training" stage and a separate "inference" stage, no matter how granular it was.
>
> The next thought was to have it in the training loop itself. Oh! I was onto something.

The reader gets the rejected idea and the reason, which is what makes the final design convincing.

---

## Blunt, with a reason

### Before

> Some frameworks arguably take a more ecosystem-centric approach than others, which may offer certain advantages.

### After (`ml-fragmentation.md`)

> ### Some ML frameworks are doing it right
>
> Tensorflow isn't. Tensorflow aims to "own" your ecosystem and experience and asks you to lock into the framework heavily. [...] Don't even try using these extended APIs with your non-tensorflow library. PyTorch takes a different approach: they promote an ecosystem of libraries and tooling, and let the community pick the parts they like.

---

## Narrate the terminal

### After (`pipenv-pyenv.md`)

> ```bash
> # I forget to put a version number
> $ (project_env) vim requirements.txt
> $ (project_env) cat requirements.txt
> BeautifulSoup
>
> # Just because I like autocomplete
> $ (project_env) pip install bpython
> ```

The comments are the author talking, and the forgotten version number sets up the argument for lock files a few paragraphs later.

---

## Labelled points

### After (`full-stack-ml.md`)

> - **Data ingest**: Nothing happens without data. In order to ingest large amounts of data across different silos and warehouses, one has to write queries in different forms. [...] The whole objective in this layer of the stack is to curate unstructured, often distributed data into ML-ready datasets.

Short label, colon, and text that doesn't repeat the label.

---

## Manufactured contrast

### Before (`agent-drift.md`)

> That gap is not a capability problem. It is a duration problem.

### After

> The models were the same; the tasks were longer. That is why I think of drift as a problem of duration.

---

## Split the overloaded sentence

### Before (`vibe-bottleneck.md`)

> The superfolder hack involves cloning all your repos into one parent directory and pointing your agent there, which technically grants visibility across everything but causes your repo-specific CLAUDE.md files to conflict, confuses your rules, and fills the context window with code the agent doesn't need.

### After

> The superfolder hack: clone every repo into one parent directory and point the agent at it. Now it can see everything. It also loads every CLAUDE.md at once, the rules conflict, and the context fills with code it doesn't need.

---

## Don't invent the stake

### Before (fabricated)

> I've spent countless late nights wrestling with flaky multi-agent handoffs, and it's taught me one thing above all.

### After

Either drop the anecdote and argue the point directly, or leave a note:

> [Ask Prass: has a handoff failure actually bitten you? A specific incident would anchor this section.]

---

## Endings

### Before (`ml-fragmentation.md`)

> It's a small step, but I hope it helps.

### After

End on the thing itself: what torchwebio does now, what it still can't do, or what you'd build next.
