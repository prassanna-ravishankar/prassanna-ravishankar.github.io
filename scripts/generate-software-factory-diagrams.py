"""Reproduce the exact editorial diagrams for the software factories essay."""
from pathlib import Path
from html import escape

OUT = Path(__file__).resolve().parents[1] / "public/images/blog/software-factories"
OUT.mkdir(parents=True, exist_ok=True)
BG, INK, MUTED, LINE = "#f7f4ee", "#26343c", "#59666b", "#9aa3a2"
BLUE, TAN, SAGE, GRAY = "#dce5ec", "#eed9bd", "#dde6d9", "#eceae4"


class Diagram:
    def __init__(self, height, title, description):
        self.parts = [f'<svg xmlns="http://www.w3.org/2000/svg" width="760" height="{height}" viewBox="0 0 760 {height}" role="img" aria-labelledby="title desc">',
                      f'<title id="title">{escape(title)}</title><desc id="desc">{escape(description)}</desc>',
                      f'<rect width="760" height="{height}" fill="{BG}"/>',
                      f'<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8" fill="none" stroke="{MUTED}" stroke-width="2"/></marker></defs>',
                      '<g font-family="Arial, Helvetica, sans-serif">']
        self.text(42, 57, title, 29, weight=700)

    def text(self, x, y, value, size=25, fill=INK, weight=400, anchor="start"):
        self.parts.append(f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" font-weight="{weight}" text-anchor="{anchor}">{escape(value)}</text>')

    def rect(self, x, y, w, h, fill=GRAY, stroke=LINE, radius=12):
        self.parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="1.4"/>')

    def box(self, x, y, w, h, title, lines=(), fill=GRAY, title_size=29):
        self.rect(x, y, w, h, fill)
        self.text(x+22, y+43, title, title_size, weight=700)
        for i, line in enumerate(lines):
            self.text(x+22, y+82+i*31, line, 25, MUTED)

    def path(self, value, dashed=False, arrow=True):
        dash = ' stroke-dasharray="8 7"' if dashed else ''
        end = ' marker-end="url(#arrow)"' if arrow else ''
        self.parts.append(f'<path d="{value}" fill="none" stroke="{MUTED}" stroke-width="2.4" stroke-linejoin="round"{dash}{end}/>')

    def save(self, name):
        (OUT/name).write_text("\n".join(self.parts)+"\n</g></svg>\n")


d = Diagram(825, "A factory carries the whole journey", "A brief starts investigation. Investigation feeds building, building feeds independent verification, and accepted work reaches production. Evidence from verification and production can revise the plan.")
d.box(42, 99, 676, 112, "Intent + constraints", ["A broad brief, a budget, and bounded authority"], BLUE)
d.box(42, 280, 304, 139, "Investigate", ["Evidence + design", "Revise the plan"], TAN)
d.box(414, 280, 304, 139, "Build", ["Software + tools", "Specialist agents"], TAN)
d.box(414, 493, 304, 139, "Verify", ["Exercise the result", "Challenge the claims"], SAGE)
d.box(42, 493, 304, 139, "Production", ["Release + operate", "Measure the effect"], SAGE)
d.path("M194 211 V280")
d.path("M346 350 H414")
d.path("M566 419 V493")
d.path("M414 563 H346")
d.path("M194 493 V460 H22 V246 H194 V280", dashed=True)
d.path("M414 594 H382 V388 H346", dashed=True)
d.text(42, 700, "Feedback can change an earlier decision.", 26, MUTED)
d.rect(42, 729, 676, 55, BLUE)
d.text(380, 765, "Working capability + evidence", 27, weight=700, anchor="middle")
d.save("factory-loop.svg")

d = Diagram(768, "Discovery changes what gets built", "In a hypothetical supplier onboarding process, investigation reveals a missing document link, a waiting approval, and ambiguous documents. The corresponding outputs are an integration, a durable workflow, and a specialist agent with human review.")
d.text(42, 112, "OBSERVATION", 22, MUTED, 700)
d.text(414, 112, "RESPONSE", 22, MUTED, 700)
rows = [(147, "Missing link", ["Document exists", "Record cannot find it"], "Integration", ["Reconcile records", "Preserve provenance"], BLUE),
        (320, "Waiting approval", ["A real decision", "Still needs a person"], "Durable workflow", ["Wait, resume, route", "Keep the boundary"], SAGE),
        (493, "Unclear document", ["Evidence needs", "interpretation"], "Specialist agent", ["Extract + flag gaps", "Route for review"], TAN)]
for y, a, al, b, bl, col in rows:
    d.box(42, y, 304, 141, a, al, GRAY, title_size=27)
    d.box(414, y, 304, 141, b, bl, col, title_size=27)
    d.path(f"M346 {y+70} H414")
d.rect(42, 679, 676, 48, BLUE)
d.text(380, 711, "The initial brief can be a hypothesis.", 26, weight=700, anchor="middle")
d.save("discovery.svg")

d = Diagram(1180, "The factory and the platform", "The factory layer contains planning, construction, evaluation, and shared work state. It uses the software and agent platform for execution, access, delivery, and evidence. Its applications, workflows, and agents run on production infrastructure within that platform. Telemetry informs further factory work.")
d.rect(30, 93, 700, 385, TAN)
d.text(54, 135, "FACTORY LAYER", 24, weight=700)
d.box(54, 163, 314, 129, "Plan + investigate", ["Intent, evidence, tasks"], BG, title_size=26)
d.box(392, 163, 314, 129, "Construct", ["Code, tools, agents"], BG, title_size=28)
d.box(54, 317, 314, 129, "Evaluate", ["Acceptance + critique"], BG, title_size=28)
d.box(392, 317, 314, 129, "Shared work state", ["Plans, findings, artefacts"], BG, title_size=26)
d.path("M368 228 H392")
d.path("M392 260 H380 V304 H211 V317")
d.path("M549 317 V292", dashed=True, arrow=False)
d.path("M392 382 H368", dashed=True, arrow=False)
d.path("M211 317 V292", dashed=True)
d.path("M255 478 V565")
d.text(281, 528, "Use platform services", 25, MUTED)
d.rect(30, 565, 700, 562, BLUE)
d.text(54, 610, "SOFTWARE AND AGENT PLATFORM", 24, weight=700)
d.box(54, 641, 314, 143, "Execution", ["Managed sandboxes", "Durable runs + models"], BG)
d.box(392, 641, 314, 143, "Access", ["Identity + permissions", "Secrets + data"], BG)
d.box(54, 809, 314, 143, "Delivery", ["Repos, builds, releases", "Policy + recovery"], BG)
d.box(392, 809, 314, 143, "Evidence", ["Traces, evals, costs", "Production telemetry"], BG)
d.rect(54, 983, 652, 112, SAGE)
d.text(76, 1022, "Products on production runtimes", 27, weight=700)
d.text(76, 1064, "Applications · workflows · agents", 25, MUTED)
d.path("M211 952 V983")
d.path("M549 983 V952", dashed=True)
d.path("M706 881 H745 V382 H706", dashed=True)
d.text(631, 514, "Feedback", 23, MUTED)
d.save("architecture.svg")

d = Diagram(917, "Production is an evidence loop", "Construction creates a candidate. Independent checks evaluate it. A shadow run observes real cases without modifying records. A limited rollout and monitoring inform whether to expand, revise, or recover. Human authorisation is required wherever release policy says so.")
stages = [(99, "Candidate", ["Versioned artefact + change plan"], TAN),
          (264, "Independent checks", ["Behaviour, invariants, release policy"], BLUE),
          (429, "Shadow run", ["Observe real cases; make no changes"], BLUE),
          (594, "Limited rollout", ["Monitor impact within agreed limits"], SAGE)]
for i,(y,title,lines,col) in enumerate(stages):
    d.box(68, y, 624, 120, title, lines, col)
    if i<3: d.path(f"M380 {y+120} V{y+165}")
d.path("M692 654 H725 V159 H692", dashed=True)
d.text(68, 777, "Continue, revise, or recover from evidence.", 25, MUTED)
d.rect(68, 810, 624, 64, GRAY)
d.text(380, 839, "Human authorisation wherever", 25, weight=700, anchor="middle")
d.text(380, 865, "release policy requires it", 25, weight=700, anchor="middle")
d.save("production.svg")

print("Generated four SVG diagrams in", OUT)
