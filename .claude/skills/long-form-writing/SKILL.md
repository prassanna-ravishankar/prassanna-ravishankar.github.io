---
name: long-form-writing
description: Write blog posts and long-form articles for prassanna.io in Prass's voice. One person saying what he thinks, with storytelling and technical depth mixed to suit the post. Use when drafting, rewriting, or editing posts, essays, or technical explanations, or when asked for "better flow" or less AI-sounding prose.
---

# Long-Form Writing

A post is one person telling the reader what he thinks and why. The voice stays the same in every post. What changes is the mix: some posts are a story, some are a technical deep dive, many blend the two. Decide the mix before writing.

## Voice

- **Say the position early**: The reader should know what the post argues within the first few paragraphs. "That framing is incomplete." does more than three paragraphs of context circling the point.
- **Write as one person**: "I" for opinions and experience, "you" for the reader. Never the institutional "we" of a company announcement.
- **Never invent a stake**: Experience earns a claim only when it is real. If a section would be stronger with a story (something built, run, or broken) and none was supplied, ask the author for one. Do not fabricate anecdotes, numbers, or "I've been thinking about this for months" openers. A post can work without a story, and an invented one reads as forced.
- **Curiosity is a voice too**: When there is no stake, write from the question: what was confusing, what you looked up, what you still don't get. "I always find this confusing and I never use `git checkout --ours` because of that, but I looked it up" (Julia Evans) is first person without claiming authority.
- **Show the work**: Earn claims with things the reader can check: the exact command, error message, prompt, config, version, price, or file name. "I run `claude --dangerously-skip-permissions`. More specifically I have an alias called `claude-yolo`" (Armin Ronacher) says more than "I give the agent full autonomy". Link to the repo, the transcript, the earlier post.
- **Say what isn't working**: Name the annoyance, the part you're unhappy with, the thing that will date the post ("I expect this blog post to age very poorly"). Admitting the rough edge is what makes the rest believable.
- **Answer the reader's doubt directly**: When a claim invites an obvious objection, state it in the reader's words and answer it. This replaces hedging spread across every sentence.
- **Use plain words**: "is", "shows", "lets" are fine. Prefer the word you would say out loud to a colleague. Humour and bluntness are allowed when they are how you'd actually say it ("I hate that. Also, it flickers."). Never add a joke for its own sake.
- **Commit, or qualify once**: State what you believe. When unsure, say so once and say why ("I only have my own setup to go on") instead of softening every sentence with "arguably", "somewhat", "quite".

## The mix: story and depth

Choose per post and state the choice in the plan.

- **Story-led**: an opinion, a bet, a lesson learned. Short paragraphs, mostly one idea per sentence. Concrete examples from real use. Few citations.
- **Depth-led**: research, mechanisms, failure modes. Longer sentences are fine when they hold a claim together with its condition. Citations, numbers with a comparison ("around 23%, against above 70% on shorter benchmarks"), diagrams. Say how you know ("I interviewed folks at three different companies", Dan Luu). Concede a fair counterpoint, then measure it against the alternative. Still first person, still a position.
- **Blended**: a real incident carries a technical argument. The story opens or anchors a section, then the post goes deep on the mechanism the story exposed. The Torale SSL incident in `vibe-bottleneck.md` is the model: a specific failure, then what it reveals about push-based context.

The mix can shift within a post. A depth-led section can open with two lines of story; a story-led post can stop for one dense paragraph when the mechanism needs it.

## Rhythm

Vary sentence length. A short sentence can land a point after a longer setup ("That framing is incomplete."). Use one or two per section, not a drumbeat.

Split overloaded sentences. If a sentence needs two parentheticals and a semicolon to hold together, it is two or three sentences.

Headings make a claim or ask a question ("Harness is the wrong term", "Why Pi?"), not a label ("Background", "Overview"). Use sentence case. Don't follow a heading with a one-line paragraph that restates it; start on the content.

When making a set of distinct points, use a list with a bold label and a colon: `- **Tool call residue**: Every API response gets appended verbatim...`. Not a bold phrase opening a paragraph (`**Tool call residue.** Every API...`). Use the list only when the points really are parallel and the labels help the reader scan. Keep the label short and don't restate it after the colon ("**Performance**: Performance has improved..."). A single argument that builds from one step to the next stays in prose.

Pick one term for each concept and keep it. If it's an "agent" in one paragraph, it isn't an "assistant" in the next and a "system" after that.

## Structure

There is no fixed arc. Open with the position or the incident. Skip background this audience already has. End when the argument ends: on the bet, the open question, or what you are watching next. No humility closer ("the work has just begun"), no recap.

Say what you're skipping and where to find it ("I'm not going to bore you with the API specifics. You can read it all in the README."). Spend the words on what only you can tell the reader: the problems you hit and how you got past them.

## Editing pass

Draft fast, then edit, mostly by cutting. Before handing a draft back:

1. Read each sentence and ask whether you'd say it that way to a friend. If not, rewrite it the way you'd say it (Paul Graham, "Write Like You Talk").
2. If a section can't be fixed sentence by sentence, explain it out loud in a few lines and replace the section with that.
3. Check the leave-out list below.
4. Mark anything that needs a real story, number, or link from the author as `[Ask Prass: ...]` rather than filling it in.
5. Ask "what about this reads as AI-generated?", list what comes back, and fix it.

## Leave out

- Em dashes. Use periods, colons, commas, or parentheses.
- Exclamation marks and hype words ("revolutionary", "game-changing").
- Throat-clearing: "It's worth noting", "Let's dive in", "In today's fast-moving landscape".
- Vague attribution: "experts argue", "many developers feel", "the community has moved away from". Name who (a thread, a survey, a person, a release note) and link it, or own it as your observation ("I've seen people move away from...").
- Hypothetical examples when a real one exists.
- Triplets used for cadence rather than because there are three things.
- Manufactured contrast: "That is not X. It is Y.", "Not because A. Not because B. Because C.", and dramatic fragments that restate the previous sentence. Say what it is.
- Trailing negations tacked onto a sentence: "The options come from the selected item, no guessing." Write the clause properly or drop it.

Some words are a matter of dose, not a ban: "crucial", "landscape", "at its core", "the real question", "interestingly", a trailing "-ing" phrase ("..., highlighting the need for X"). Once, where it is the right word, is fine. Banning them all makes prose stilted; a cluster of them in one paragraph is the tell. Too much and none are both failures.

## Models

Writers worth rereading for one thing each:

- **Paul Graham**: spoken language and simple words. [Write Like You Talk](https://paulgraham.com/talk.html), [Write Simply](https://paulgraham.com/simply.html).
- **Julia Evans**: writing from confusion and curiosity, real terminal output. [jvns.ca](https://jvns.ca/)
- **Simon Willison**: receipts. Transcripts, prompts, dated observations, links to his own earlier posts. [simonwillison.net](https://simonwillison.net/)
- **Dan Luu**: depth with the method stated and evidence first, no polish. [danluu.com](https://danluu.com/)
- **Mario Zechner**: a builder's account with blunt, self-deprecating humour. [What I learned building an opinionated and minimal coding agent](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/)
- **Armin Ronacher**: specific setup, strong recommendations with reasons, honest about what annoys him. [Agentic Coding Recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)
- **Destiner**: a short opinion piece built as a bet. [Pi is the last harness](https://destiner.io/blog/post/pi-is-the-last-harness/)

Borrow the technique, not the punctuation: several of them use em dashes.

## Examples

See [references/examples.md](references/examples.md) for before/after pairs drawn from posts on this site.
