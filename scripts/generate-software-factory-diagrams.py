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

d = Diagram(1200, "An adaptive factory on a shared platform", "The factory layer discovers the problem, designs its organisation, executes work, evaluates evidence, and retains experience in shared state. The platform supplies execution, access, delivery, and observation to factory workers and their products.")
d.rect(30, 93, 700, 480, TAN)
d.text(54, 135, "FACTORY LAYER", 24, weight=700)
for x,y,title,line in [
    (54,163,"Discover","Processes + context"),
    (392,163,"Design","Roles, links, workflows"),
    (54,293,"Execute","Code + tools + agents"),
    (392,293,"Evaluate","Results + approach"),
    (54,423,"Learn","Reusable patterns + skills"),
    (392,423,"Shared state","Evidence + decisions")]:
    d.box(x,y,314,108,title,[line],BG,title_size=28)
d.path("M368 217 H392")
d.path("M460 271 V282 H211 V293")
d.path("M368 347 H392")
d.path("M620 293 V271",dashed=True)
d.path("M549 401 V412 H211 V423")
d.path("M54 477 H42 V151 H549 V163",dashed=True)
d.path("M549 423 V401",dashed=True,arrow=False)
d.path("M255 573 V633")
d.text(281, 612, "Platform services", 25, MUTED)
d.rect(30, 633, 700, 515, BLUE)
d.text(54, 678, "SOFTWARE AND AGENT PLATFORM", 24, weight=700)
d.box(54,700,314,139,"Execution",["Sandboxes + models","Durable runs"],BG)
d.box(392,700,314,139,"Access",["Identity + permissions","Secrets + data"],BG)
d.box(54,864,314,112,"Delivery",["Builds + releases"],BG)
d.box(392,864,314,112,"Observation",["Traces, evals, telemetry"],BG,title_size=28)
d.rect(54,1004,652,112,SAGE)
d.text(76,1044,"Products on production runtimes",27,weight=700)
d.text(76,1086,"Applications · workflows · agent systems",25,MUTED)
d.path("M211 976 V1004")
d.path("M549 1004 V976",dashed=True)
d.path("M706 920 H745 V347 H706",dashed=True)
d.text(597,608,"Feedback",23,MUTED)
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



d = Diagram(875, "The factory adapts its approach", "Intent starts discovery. An evolving problem model informs the working organisation. Execution produces evidence that updates understanding and the approach. Useful capabilities are retained and inform future work.")
d.box(42,99,676,112,"Intent + constraints",["An outcome, context, budget, and authority"],BLUE)
d.box(42,266,304,141,"Understand",["Systems + constraints","Facts + assumptions"],BLUE,title_size=28)
d.box(414,266,304,141,"Form an approach",["Roles + connections","Tools + control flow"],TAN,title_size=27)
d.box(414,472,304,141,"Execute + build",["Teams + workflows","Tools + artefacts"],TAN,title_size=28)
d.box(42,472,304,141,"Assess evidence",["Tests + telemetry","Outcomes + failures"],SAGE,title_size=27)
d.path("M194 211 V266")
d.path("M346 336 H414")
d.path("M566 407 V472")
d.path("M414 542 H346")
d.path("M194 472 V407",dashed=True)
d.path("M346 581 H380 V378 H414",dashed=True)
d.text(42,662,"Evidence can change the plan and the team.",26,MUTED)
d.box(42,706,676,126,"Retain useful capabilities",["Workflows · skills · tools · tested patterns"],SAGE,title_size=28)
d.path("M42 542 H22 V769 H42",dashed=True)
d.path("M718 769 H741 V336 H718",dashed=True)
d.save("adaptive-loop.svg")

d = Diagram(970, "One factory, several ways to work", "Parallel exploration, coordinated specialists, and explicit workflows are different arrangements of the same primitives. They can be combined and revised as the task develops. Lines show collaboration; arrows show directed dependencies.")
for y,title,lines,col in [(105,"Parallel exploration",["Competing hypotheses","Shared findings"],TAN),(365,"Coordinated team",["Specialist responsibilities","Shared artefacts"],BLUE),(625,"Explicit workflow",["Dependencies + checks","Conditions + retries"],SAGE)]:
    d.rect(42,y,676,225,BG)
    d.text(64,y+48,title,27,weight=700)
    for i,line in enumerate(lines):d.text(64,y+99+i*35,line,25,MUTED)
# Exploration: an interconnected set, without a fixed execution order.
for path in ["M444 177 H650","M444 261 H650","M444 177 V261","M650 177 V261","M444 177 L650 261","M650 177 L444 261"]:d.path(path,arrow=False)
for x,y in [(415,154),(621,154),(415,238),(621,238)]:d.rect(x,y,58,46,TAN)
# A team: allocation through a lead, with peers sharing findings.
d.path("M552 444 L430 513")
d.path("M552 444 V513")
d.path("M552 444 L665 513")
d.path("M459 537 H523",dashed=True,arrow=False)
d.path("M581 537 H636",dashed=True,arrow=False)
d.rect(511,399,82,46,BLUE)
d.text(552,430,"Lead",25,weight=700,anchor="middle")
for x in [401,523,636]:d.rect(x,513,58,46,TAN)
# A workflow: build, check, ship; a failed check returns via revision.
d.path("M456 715 H489")
d.path("M572 715 H609")
d.path("M530 738 V773")
d.path("M489 794 H381 V715 H390",dashed=True)
for x,y,w,label,col in [(390,691,66,"Build",TAN),(489,691,83,"Check",BLUE),(609,691,85,"Ship",SAGE),(489,773,83,"Revise",TAN)]:
    d.rect(x,y,w,46,col)
    d.text(x+w/2,y+31,label,24,weight=700,anchor="middle")
d.text(42,911,"Structures can be combined and revised.",26,MUTED)
d.save("work-patterns.svg")

print("Generated six SVG diagrams in",OUT)
