---
name: long-form-writing
description: Write blog posts and long-form articles for prassanna.io in Prass's voice. One person thinking out loud about what he built, broke, or believes, with storytelling and technical depth mixed to suit the post. Use when drafting, rewriting, or editing posts, essays, or technical explanations, or when asked for "better flow" or less AI-sounding prose.
---

# Long-Form Writing

A post is one person telling the reader what he thinks and why. The voice stays the same in every post. What changes is the mix: some posts are a story, some are a technical deep dive, many blend the two. Decide the mix before writing.

## The voice reference

Prass's own voice is in three posts: `src/content/blog/ml-fragmentation.md`, `full-stack-ml.md`, and `pipenv-pyenv.md` (2019 to 2022). Read at least one before drafting. Every later post is AI-assisted in some form and is not a voice reference; treat its cadence as something to avoid.

## Voice

- **Frame the post**: Say what kind of post it is and where your bias sits before getting going. "Okay, this is a bit of a rant-post." "A small warning: I am a computer vision guy by trade, so most of this article is going to have computer vision bias."
- **Write as one person**: "I" for opinions and experience, "you" for the reader. Never the institutional "we" of a company announcement.
- **Think out loud**: For anything built or designed, show the path: the first idea, why it felt off, the next idea, and what clicked. "My first thought was... Something about that design felt off, it felt too circuitous." The reader follows the reasoning, not a cleaned-up conclusion.
- **Question the artifact**: Put the real config, diff, output, or schema on the page and ask the questions it raises. "Why does an inference step on a single image need to know about `STEPS` or `MAX_ITER`?"
- **Use dated personal history as evidence**: "I was a web designer back in my university days, up until 2011." "Back in 2017 when I quit my PhD." Specific and checkable.
- **Never invent a stake**: Experience earns a claim only when it is real. If a section would be stronger with a story and none was supplied, ask Prass for one. Do not fabricate anecdotes, numbers, or "I've been thinking about this for months" openers. A post can work without a story, and an invented one reads as forced.
- **Curiosity is a voice too**: When there is no stake, write from the question: what was confusing, what you looked up, what you still don't get.
- **Show the work**: Earn claims with things the reader can check: the exact command, error message, prompt, config, version, price, or file name. Comment terminal sessions the way you'd narrate them to a friend (`# I forget to put a version number`). Link to the repo, the transcript, the earlier post.
- **Be blunt, with a reason**: "Tensorflow isn't. Tensorflow aims to 'own' your ecosystem." "Detectron2 introduces a configuration language for the sake of it." State the opinion, then why.
- **Say what isn't working**: Name the annoyance, the part you're unhappy with, the thing that will date the post. Admitting the rough edge is what makes the rest believable.
- **Asides are fine, briefly**: "Now, now, don't let the haters come my way already." "I've digressed." "Nope, not going to do that." One or two per post, where they are how you'd actually say it. Never a joke for its own sake.
- **Answer the reader's doubt directly**: When a claim invites an obvious objection, state it in the reader's words and answer it. This replaces hedging spread across every sentence.
- **Use plain words**: "is", "shows", "lets" are fine. Prefer the word you would say out loud to a colleague.
- **Commit, or qualify once**: State what you believe. When unsure, say so once and say why instead of softening every sentence with "arguably", "somewhat", "quite".

## The mix: story and depth

Choose per post and state the choice in the plan.

- **Story-led**: an opinion, a rant, a lesson learned. Short paragraphs, mostly one idea per sentence. Concrete examples from real use. Few citations.
- **Depth-led**: research, mechanisms, failure modes, a how-to. Longer sentences are fine when they hold a claim together with its condition. Citations, numbers with a comparison, diagrams, real terminal output. Say how you know. Concede a fair counterpoint, then measure it against the alternative. Still first person, still a position.
- **Blended**: a real problem carries a technical argument. `ml-fragmentation.md` is the model: a rant about fragmentation, backed by real schemas and configs, that turns into how torchwebio dealt with it.

The mix can shift within a post. A depth-led section can open with two lines of story; a story-led post can stop for one dense paragraph when the mechanism needs it.

## Rhythm

Vary sentence length. A short sentence can land a point, like "Tensorflow isn't." straight after the heading "Some ML frameworks are doing it right". Use one or two per section, not a drumbeat.

Split overloaded sentences. If a sentence needs two parentheticals and a semicolon to hold together, it is two or three sentences.

Headings make a claim or ask a question ("Virtualenv is just-not-enough", "It's okay to be opinionated", "Why is this even a problem?"), not a label ("Background", "Overview"). Use sentence case. Don't follow a heading with a one-line paragraph that restates it; start on the content.

When making a set of distinct points, use a list with a bold label and a colon: `- **Data ingest**: Nothing happens without data...`. Not a bold phrase opening a paragraph (`**Data ingest.** Nothing...`). Use the list only when the points really are parallel and the labels help the reader scan. Keep the label short and don't restate it after the colon. A single argument that builds from one step to the next stays in prose.

Pick one term for each concept and keep it. If it's an "agent" in one paragraph, it isn't an "assistant" in the next and a "system" after that.

## Structure

There is no fixed arc. Open with the framing, the position, or the problem. Keep history and background short; this audience has most of it already. End when the argument ends: on what you built, the open question, or what you are watching next. No humility closer ("It's a small step, but I hope it helps", "the work has just begun"), no recap.

Say what you're skipping and where to find it ("If you want to skip all the justification and just figure out how to install them both, scroll down"). Spend the words on what only you can tell the reader: the problems you hit and how you got past them.

## Old habits to clean up

The original posts have habits worth keeping out of new ones:

- **Loose ends**: typos and sentences that stop halfway. Finish every sentence.
- **Emphasis everywhere**: bold, italics, and bold-italic mid-sentence. Bold the list label or the one phrase that matters in a section, nothing else.
- **Spaced hyphens as dashes**: "the stack - which...". Same problem as an em dash; use a comma, colon, or parentheses.
- **Fading endings**: closing on a pointer or a hope instead of a point.
- **Long preambles**: several sections of history before the post reaches its purpose. One paragraph of context, then the point.

## Editing pass

Draft fast, then edit, mostly by cutting. Before handing a draft back:

1. Read each sentence and ask whether you'd say it that way to a friend. If not, rewrite it the way you'd say it (Paul Graham, "Write Like You Talk").
2. If a section can't be fixed sentence by sentence, explain it out loud in a few lines and replace the section with that.
3. Check the leave-out list below and the old habits above.
4. Mark anything that needs a real story, number, or link from the author as `[Ask Prass: ...]` rather than filling it in.
5. Ask "what about this reads as AI-generated?", list what comes back, and fix it.

## Leave out

- Em dashes and spaced hyphens used as dashes. Use periods, colons, commas, or parentheses.
- Hype: exclamation marks used for excitement ("This changes everything!") and words like "revolutionary" or "game-changing". An exclamation of surprise or frustration in your own story ("Oh! I was onto something.", "I did not know where to start!") is fine, sparingly; that's reacting, not selling.
- Throat-clearing: "It's worth noting", "Let's dive in", "In today's fast-moving landscape".
- Vague attribution: "experts argue", "many developers feel", "the community has moved away from". Name who (a thread, a survey, a person, a release note) and link it, or own it as your observation ("I've seen people move away from...").
- Hypothetical examples when a real one exists.
- Triplets used for cadence rather than because there are three things.
- Manufactured contrast: "That is not X. It is Y.", "Not because A. Not because B. Because C.", and dramatic fragments that restate the previous sentence. Say what it is.
- Trailing negations tacked onto a sentence: "The options come from the selected item, no guessing." Write the clause properly or drop it.

Some words are a matter of dose, not a ban: "crucial", "landscape", "at its core", "the real question", "interestingly", a trailing "-ing" phrase ("..., highlighting the need for X"). Once, where it is the right word, is fine. Banning them all makes prose stilted; a cluster of them in one paragraph is the tell. Too much and none are both failures.

## Models

Closest to Prass's own voice:

- **Mario Zechner**: a builder's account with blunt, self-deprecating humour. [What I learned building an opinionated and minimal coding agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- **Julia Evans**: writing from confusion and curiosity, real terminal output. [jvns.ca](https://jvns.ca/)

Worth rereading for one thing each:

- **Paul Graham**: spoken language and simple words. [Write Like You Talk](https://paulgraham.com/talk.html), [Write Simply](https://paulgraham.com/simply.html).
- **Simon Willison**: receipts. Transcripts, prompts, dated observations, links to his own earlier posts. [simonwillison.net](https://simonwillison.net/)
- **Armin Ronacher**: specific setup, strong recommendations with reasons, honest about what annoys him. [Agentic Coding Recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)
- **Dan Luu**: depth with the method stated and evidence first, no polish. [danluu.com](https://danluu.com/)
- **Destiner**: the brevity check. A whole opinion in under a thousand words. [Pi is the last harness](https://destiner.io/blog/post/pi-is-the-last-harness/)

Borrow the technique, not the punctuation: several of them use em dashes.

## Examples

See [references/examples.md](references/examples.md). The "after" passages come from the three original posts; the "before" passages include AI-assisted lines from later posts.
