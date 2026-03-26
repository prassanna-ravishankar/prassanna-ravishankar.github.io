# Technical Diagrams: Layered Editorial Style

Generate image prompts for technical diagrams in the "Layered Editorial" style used on prassanna.io. This style produces clean, informational diagrams using simple geometric shapes, flat earth-tone fills, and meaning encoded through spatial arrangement.

## When to Use

Use this skill for explanatory diagrams, architecture overviews, process flows, or concept comparisons that appear inline in blog posts. Not for hero images (use the Luminescent Systems Abstraction style for those).

## Core Philosophy

**"Describe what the diagram communicates, not how to draw it."**

The prompt should tell the model what information each shape carries, what relationships exist between elements, and what transformation occurs across stages. Let the model handle visual execution. Over-specifying pixel sizes, hex codes, and opacity values produces worse results than clearly describing meaning.

## Prompt Structure

Every prompt follows this pattern:

1. **Style frame** (one sentence): canvas, style reference, negatives
2. **Panel descriptions** (one per zone): title, what it shows, what the shapes represent
3. **Relationships**: how elements connect, flow, transform
4. **Style negatives**: what to exclude

### Template

```
Clean technical diagram on white/cream background, minimal flat design, no decorative elements. [Number] panels [layout].

[Panel 1] titled "[TITLE]": [What it shows]. [Describe shapes by what they REPRESENT, not just their color]. [Describe spatial relationships and nesting that encode meaning].

[Panel 2] titled "[TITLE]": [What it shows]. [Describe flows or transformations]. [Name the stages and what happens at each].

[Optional Panel 3 / bottom strip]: [Boundary, summary, or comparison].

Style reference: Anthropic technical documentation. Muted earth tones (tan, slate blue, warm gray, sage green). Sans-serif labels. No gradients, no shadows, no icons. Similar visual language to Anthropic's context engineering diagrams.
```

## Color Meanings

Use color names, not hex codes. Let the model interpret within the earth-tone palette.

| Color Name | Meaning | Use For |
|---|---|---|
| Muted blue / slate blue | Structural, foundational | System-level, anchors, protocols |
| Warm tan / warm orange | Active, developer-owned | User code, mutable state, in-progress |
| Soft gray / sage green | Settled, resolved | Distilled, completed, stable |
| Warm gray | Neutral, connective | Arrows, borders, separators |

## Labels

Short labels (1-3 words) work well in image generation. Include them in the prompt as parenthetical descriptions of what shapes represent:

- Good: `labeled "Anchors" (system prompt, tools, identity)`
- Good: `a section labeled "Steps" showing small stacked blocks`
- Bad: `a rectangle with the text "ConversationBufferMemory wraps the messages list in a framework-specific abstraction"`

Zone titles (2-4 words, uppercase implied) render reliably. Stage labels ("Stage 1", "cold start", "bootstrap") render reliably. Skip longer annotations.

## Composition Rules

- **2-3 panels per image.** Each panel expresses one clear idea.
- **Generous whitespace.** If it feels crowded, remove elements.
- **Nesting encodes hierarchy.** A small orange block inside a larger blue container means "framework wraps developer code."
- **Transformation across stages.** Shapes physically change (scattered → assembled → compressed → distributed) to show process.
- **Left-to-right flow** for temporal progression.

## What to Avoid

- No hex color codes in prompts (use color names)
- No pixel dimensions for elements
- No opacity values
- No complex geometry (circles, hexagons, stars)
- No icons, clipart, or illustrative elements
- No gradients, shadows, or glows
- No literal tech imagery (screens, terminals, code)
- No long text labels inside shapes

## Quality Test

1. Does the prompt describe what the diagram COMMUNICATES, not just how it looks?
2. Could a reader understand the main idea from shapes and arrangement alone?
3. Are labels short enough (1-3 words) to render cleanly?
4. Is there enough whitespace? (When in doubt, fewer elements)

## Proven Prompt (Tested, Produces Good Results)

This prompt produced a clean, usable diagram:

> Clean technical diagram in the style of Anthropic's engineering blog illustrations. Cream background. Crisp flat vector shapes with consistent rounded corners. Four stages arranged left to right with generous spacing, connected by thin gray arrows.
>
> Stage 1 "ad-hoc": Three separate warm orange rounded rectangles of equal size, arranged in a vertical stack with gaps between them. They are not contained by anything. Each block is clean and precise but stands alone with no visual relationship to the others.
>
> Stage 2 "framework": The same three warm orange rectangles, now placed inside a larger slate blue rounded rectangle container labeled "AgentExecutor" at the top. The orange blocks fit neatly inside. The blue container has a visible border and the blocks are organized in a grid within it.
>
> Stage 3 "typed": Three sage green rounded rectangles in a clean vertical list. Each has a small sage green circle attached to its left edge, and thin connecting lines run between the circles, linking the blocks together. No outer container. The blocks are self-connected.
>
> Stage 4 "protocol": One sage green rounded rectangle in the center labeled "MCP". Five thin gray lines radiate outward from it to five small, faint outlined rectangles arranged in a semicircle around it. The central block serves many consumers.
>
> Below all four stages, a single thin dashed gray line spans the full width with four evenly spaced labels: "hack", "framework feature", "typed primitive", "protocol".
>
> Typography: all-caps letter-spaced headings for stage titles ("AD-HOC", "FRAMEWORK", "TYPED", "PROTOCOL"), title-case medium weight for block labels ("AgentExecutor", "MCP"), lowercase for element descriptions. Clean sans-serif throughout.
>
> Style: Anthropic technical blog. Precise vector shapes. Muted earth tones only. No gradients, no shadows, no icons, no textures, no hand-drawn feel.

**Why it works:** Every shape is described as "clean," "precise," "equal size." No randomness. The transformation is encoded purely through containment and connection (none → blue container → self-connected → radiating outward), not through visual disorder. Typography hierarchy uses all-caps for zone titles, title-case for labels.
