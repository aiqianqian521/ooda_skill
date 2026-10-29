---
name: ooda
description: >-
  Apply a mandatory OODA execution loop for fast but deliberate execution until
  the problem is verified solved. Trigger automatically when the user starts a
  complex, ambiguous, or multi-step task. Also trigger when the user explicitly
  asks for OODA, needs iterative problem solving, needs help choosing between
  options, or wants structured Observe-Orient-Decide-Act workflow with purpose
  clarification, per-round output files, automatic reruns, delta checks, problem
  severity, risk-based execution routes, adversarial scenarios, layered verification,
  and learning. Nothing is skipped silently: for trivial work or clearly scoped
  read-only work, declare the route taken and why on the first line instead of
  running the rounds.
---

# OODA

Use this skill to run a mandatory OODA execution loop: clarify the purpose, observe enough reality, orient around the real problem, decide explicitly, act within scope, verify both result and path, rerun when unresolved, learn when useful, and close only after the problem is verified solved.

This is the default English version. A Chinese version is available at `SKILL.zh-CN.md`.

Use the user's language for user-facing responses unless the user asks for another language.

## Purpose First — the routing gate (read before any other action)

**This section decides whether the loop runs at all. It executes before the First Action below, and before any file is read.** A loop route is the exception; answering directly is the default.

**Irreversibility check — run this BEFORE the buckets.** If the task will WRITE to or EXECUTE against production or live config, feature flags, credentials or secrets, data migration or deletion, release or deployment, money, or permissions/auth — or any action with no cheap rollback — then: escalate one tier above what size alone would give (trivial → Micro, Micro → Medium, Medium → Macro), pause for explicit confirmation before the irreversible action, and state the rollback path in the same message. Diff size never removes the pause. Say which trigger fired. Read-only inspection of the same targets does not trigger this — it stays on the Analysis Short Path.

**Behavioral-scope check:** A skill edit that changes triggering, routing, confirmations, state/rollback contracts or cross-host installation requires a design decision even if it changes only one line. Do not classify it as a trivial typo; choose a loop route before applying strict assurance after confirmation. A local wording fix with no runtime effect remains eligible for the trivial route.

### The four buckets

- **Trivial** (single-line fix, typo, one-word change, or a mechanical replacement whose value is already given in the request, **and no design decisions**) → execute directly without OODA. No task list, no state file, no questions. Tell the user you are skipping the loop and why.
- **Analysis / Verification** (read→compare→report, scope and method clear, no iteration needed) → simplified direct path. Skip the OODA loop, skip 5W1H scan, skip U&Q mandatory questions. Go directly to Observe→Analyze→Output. See "Analysis/Verification Short Path" below.
- **Simple but verifiable** (single-file change, clear scope) → Micro loop.
- **Complex or ambiguous** (multi-file, unclear scope, user preference needed) → Medium loop.
- **Cross-system** (spans systems, contracts, or release/migration boundaries) → Macro loop.

**Scale never escalates by itself.** Only two things escalate the tier: (a) judgement density — a design decision, or ambiguity that would change the answer — or (b) irreversibility. File count, line count and diff size are not escalation triggers. A 20-file rename with the value already given is Trivial; a 4-file change where the agent must choose the value is not. This clause overrides "Highest match wins" wherever it applies.

**Large batches carry an evidence floor.** Keeping the Trivial route for a large mechanical batch removes the loop, not the proof that it landed. When a batch touches more than 5 files, the response must carry three artifacts: the exact command or pattern applied, the count of files changed, and a spot-check of at least 3 modified files quoted with their paths. This is an evidence requirement, not a tier change — the route stays Trivial, no task list is created, and no questions are asked.

**Highest match wins**: evaluate all buckets, then take the LARGEST one that matches — not the first, not the cheapest.

### Tier authority — the buckets versus the Loop Scale table

The buckets answer one question: **does the loop run, and at roughly what scale?** They are the entry decision and are made once. The **Loop Scale** table further down answers a narrower question: **how much evidence this round needs**, and it is recomputed every round. When the two disagree, the Loop Scale table is authoritative for the tier and the bucket result is only the initial value. Record both when they differ: `Route: medium — matched by: {...}; initial: medium → scale: macro (cross-system + irreversible)`.

The table has three tiers; `trivial` and `analysis` are exits taken before the table applies and never appear in it.

**Base tier for escalation.** "What size alone would give" means the tier the buckets produced — not a raw count of files. If the buckets produced trivial or analysis, the base is trivial, so an irreversibility escalation lands on Micro. A 20-file rename that turns out to touch live config therefore becomes Micro, not Macro.

**Irreversibility is priced twice.** The Loop Scale table carries its own irreversibility axis, which is why the +1 in the check above can disagree with the table. When both apply, take the HIGHER tier, never the lower. The +1 exists so that an irreversible action cannot be under-classified when the table alone would have placed it lower.

**Recording the route.** Whenever the final tier differs from the bucket result, the first line carries both inside the same route declaration, separated by `; `: `Route: medium — matched by: {...}; initial: medium → scale: macro (cross-system + irreversible)`. The round file records the same string plus one sentence of why. If a later round changes the tier, rewrite that round's route line and state the reason there — a silent tier change is a de-escalation in disguise.

### Route declaration

**The route line is the first line of the response, emitted before any task is created.** For loop routes it precedes the task list; for trivial and analysis routes it is the whole first line. `Route: {trivial | analysis | micro | medium | macro} — matched by: {the specific rule that decided it}`. A declared route is what makes a mis-route visible and correctable by the user.

If the task passes the threshold, define:

- The user's actual purpose.
- The success standard for this task.
- Known constraints, risks, and required confirmations.

If any of these is unclear, ask the user instead of inferring. Record the status as `paused_waiting_user_input` and continue the same OODA task after the user answers.

If the task passed the threshold (non-trivial, non-analysis), proceed immediately to Understanding Restatement below, then to 5W1H Divergent Scan, then to Understand & Question, before the first OODA round. For Analysis / Verification tasks, skip directly to "Analysis/Verification Short Path" below.

## Core Rule

Optimize for reliable cycles over perfect planning or rushed execution.

**Reliable** means: the result satisfies the user's success standards, and the user confirmed the direction at each key checkpoint — U&Q understanding, Decide plan, and Close acceptance. Reliability is judged by the user, not by the agent's self-check. The agent's job is to provide clear evidence at each checkpoint so the user can make informed decisions.

## First Action: Status Bar Task Initialization

**The first action after a loop route is declared (see "Purpose First" above): create task 1. Do not read files or analyze the task before the route is declared.**

### Core Rule: One Task at a Time

**Never create all 5 tasks at once.** Create the next task only after the current one is completed. The status bar stays at 2-3 tasks, naturally ordered.

```
Create "1/5 Understand Problem" → in_progress → completed
Then create "2/5 Align & Ask" → in_progress → completed
Then create "3/5 Diagnose & Orient — R1" → in_progress → completed
Then create "4/5 Decide & Execute — R1" → in_progress → completed
Then create "5/5 Verify & Close — R1" → in_progress → completed
[If another round needed]
Then create "3/5 Diagnose & Orient — R2" → in_progress → completed
Then create "4/5 Decide & Execute — R2" → in_progress → completed
Then create "5/5 Verify & Close — R2" → in_progress → completed
```

### 5 Tasks (created one at a time)

```
TaskCreate: "1/5 Understand Problem — Clarify Purpose·Define Success"
TaskCreate: "2/5 Align & Ask — Restate Understanding·Gather Constraints"
TaskCreate: "3/5 Diagnose & Orient — R1 Observe Reality·Analyze Root Cause"
TaskCreate: "4/5 Decide & Execute — R1 Select Approach·Apply Changes"
TaskCreate: "5/5 Verify & Close — R1 Check Results·Summarize & Iterate"
```

This block lists the five task names in order. It does not mean create them together — creation is one at a time, and only after a loop route is declared (see "Purpose First").

### Progression Rules (single-round 5 tasks + multi-round loop)

```
Pre-loop (once only):
  [Create] 1/5 Understand Problem → in_progress → completed
  [Create] 2/5 Align & Ask → in_progress → completed

Loop (rebuild 3/4/5 each round, tagged R1/R2/...):
  [Create] 3/5 Diagnose & Orient — R1 → in_progress → completed
  [Create] 4/5 Decide & Execute — R1 → in_progress → completed
  [Create] 5/5 Verify & Close — R1 → in_progress → completed

If verify fails → auto next round:
  [Create] 3/5 Diagnose & Orient — R2 → in_progress → completed
  [Create] 4/5 Decide & Execute — R2 → in_progress → completed
  [Create] 5/5 Verify & Close — R2 → in_progress → completed
```

| Task | Lifecycle | Created When | Completed When |
|------|-----------|-------------|----------------|
| 1/5 Understand Problem | Once only | After the loop route is declared | After Purpose is written |
| 2/5 Align & Ask | Once only | After task 1 completed | After U&Q answers received |
| 3/5 Diagnose & Orient — R{N} | Rebuilt each round | After task 2 completed (first round) / previous round ends (subsequent) | After Orient output |
| 4/5 Decide & Execute — R{N} | Rebuilt each round | After task 3 completed | After Act completes |
| 5/5 Verify & Close — R{N} | Rebuilt each round | After task 4 completed | After verify passes and Close |

**Once a loop route is declared, every line is mandatory. No merging, no skipping, no batch creation. After one round ends, auto-enter next round until the problem is verified solved.** Telling the user you are skipping the loop on a trivial or analysis route is not a skip of this section — those routes never reach it.

### Confirmation Channel — Popup Preferred, Chat Fallback

The following three checkpoints **MUST** obtain explicit user input. Prefer the `AskUserQuestion` popup whenever the host provides it. If unavailable, use structured chat questions and wait for the user's next reply; never treat an agent-written option list, silence, or an ambiguous acknowledgment as confirmation.

| Checkpoint | Example Question |
|------------|-----------------|
| Understanding Restatement | "Does my understanding match?" → options: Confirm / Needs Adjustment |
| Deep-dive Questions | List 3-4 core questions, each with A/B/C choices |
| Decide plan | "Can this plan be executed?" → options: Confirm Execution / Switch Plan / Add Info |

`AskUserQuestion` supports up to 4 questions, each up to 4 options. If U&Q has more than 4 questions, split into two batches. In chat fallback, number the same required questions, give clear A/B/C options or request a short free-form answer, and explicitly ask the user to answer each item. Record `confirmation_channel: popup | chat` with the user's actual answers and what they approved in the existing purpose/round file. After partial answers, ask only for missing or contradictory answers before continuing.

If the popup is missing, the full loop remains available through chat fallback. Pause at each checkpoint **until the user explicitly answers**; resume the same task afterward. Keep the original question count, 5W1H, U&Q, Decide confirmation, irreversibility gate, and all existing trivial/analysis exemptions. Never claim a popup was shown when chat was used.

New round: create new "R{N}·Diagnose & Orient / Decide & Execute / Verify & Close" tasks (tasks 3-5), same flow as above.

**Trivial tasks** → no TaskCreate, execute directly. The definition lives in "Purpose First" above; do not restate it here.

## Adaptive Execution Contract

Apply these seven gates **only after** Understanding Restatement, the 5W1H scan, and Understand & Question have completed with explicit user confirmations through the available channel. Do not change the existing pre-confirmation questions or pause points. The gates fit inside the existing Purpose → Observe → Orient → Decide → Act → Verify → Iterate/Close cycle, not seven extra rounds or meetings. Record evidence in the existing round records; do not create parallel process files.

Once the user confirms the problem, select `Assurance: standard | strict — trigger: ...` for the route already chosen in Purpose First. Use strict assurance when the user explicitly requests it, when action is irreversible or safety/security/financially critical, or when plausible high-impact failure cannot be ruled out with current evidence. Otherwise use standard assurance. Reassess assurance if observations change risk. No assurance level relaxes the original user-confirmation or rollback rules.

**Structural skill-upgrade default:** After the original confirmation checkpoints, use strict assurance for skill upgrades that change trigger conditions, task routing, user-confirmation gates, rollback/state-record contracts, installation or cross-host behavior, or interdependent runtime rules across files or languages. Judge by behavioral impact, not diff size: a one-line trigger change can qualify. State which contract changed. Typos, purely local wording, and clearly scoped read-only inspections keep their trivial, micro, or analysis route and do not inherit strict assurance merely because the target is a skill. Strict adds the existing strategic challenge, safe failure scenarios when credible, three distinct evidence layers and final reframing; it does not authorize skipping confirmations or claiming unrun host tests passed.

1. **Bind the confirmed goal to evidence (Observe).** Reuse the route and success criteria confirmed in the original questions; map success to observable evidence, affected boundaries, and rollback for risky actions. New consequential unknowns return to the original confirmation flow; do not silently assume an answer.
2. **Compare repair or redesign options (Orient/Decide).** Consider the smallest viable fix and at least one meaningful alternative when the choice has material tradeoffs. Record why the selected path addresses the observed root cause; do not invent alternatives to satisfy a count.
3. **Strategic Challenge (strict only, before Act).** Run the self-contained Three Perspectives, One Decision method below. If delegation is permitted, available, and useful for distinct nonblocking hypotheses, ask independent reviewers for evidence and dissent and reconcile results; otherwise perform the checks serially and disclose that no independent swarm review occurred. Never call self-review independent. Do not read, invoke, copy, or depend on any other internal skill.
4. **Construct failure scenarios (strict only, before irreversible Act).** Select 3–5 distinct, plausible high-impact failure modes when 3–5 can actually be supported by the task; otherwise document all credible cases without inventing extras. For each, specify the real fixture or safe simulation, expected outcome, failure signal, and concrete observation. Test in a sandbox or dry run when live construction would be destructive; do not perform a risky production test without explicit authorization. An unconstructable scenario remains an open risk, not a pass. If a scenario invalidates the plan, return to Orient before Act.
5. **Execute OODA (Act/Iterate).** Change one coherent slice at a time, verify it against its acceptance evidence, and loop on failures or new evidence. Preserve the existing confirmation and rollback rules; route escalation is allowed, silent de-escalation of risk is not.
6. **Verify in distinct layers (Verify and Final Full-Run).** Micro: verify the changed target. Standard medium/macro: verify the change and affected integration; use the existing final full-run triggers. Strict: (a) prove the fix and failure scenarios with observed results; (b) inspect every *related* file/artifact identified by an explicit dependency and impact map, plus relevant regressions; (c) verify the user's end-to-end goal and standalone deliverable. These are three different evidence layers, not three copies of the same test. A layer without a runnable channel must use a concrete inspection or simulation and disclose the limitation. Reuse the final full-run as layer (c), never rerun it merely to reach a count.
7. **Reframe before Close (strict only).** Challenge the original problem definition, blind spots in the tests, and risk displaced to another system or user. Note the counterevidence checked and any residual risk. New evidence or failed criteria goes back into Orient/Iterate; close only with evidence for every required layer. If a risk cannot be eliminated or verified, report it explicitly and request a decision instead of claiming success.

For standard work, retain gates 1, 2, 5 and the applicable part of 6; gates 3, 4 and 7 are strict-only. Do not require a swarm, 3–5 scenarios, or three-layer verification for trivial, analysis, or ordinary micro work.

### Three Perspectives, One Decision

Use this procedure only at gate 3, after the original understanding and question checkpoints have been explicitly answered. Reuse the confirmed success criteria; never replace or skip the existing pre-confirmation workflow. Record the following in the existing Orient/Decide round file, not in a new process document:

1. **Value perspective — is this the right outcome?** Name the beneficiary, the observable improvement, the baseline or comparison, and the unacceptable cost or boundary. Separate user-confirmed facts from inferred preferences. If the success metric or non-negotiable tradeoff is missing, return to the existing U&Q confirmation flow instead of inventing it.
2. **Mechanism perspective — why should this work?** Trace observed symptom → causal mechanism → proposed intervention → dependency → downstream effect. For each decision-critical link, cite an observation or label it an unverified assumption; contrast at least one plausible alternative cause. A missing critical link requires more Observe/Orient evidence, not an Act justified by confidence alone.
3. **Falsification perspective — how could this fail?** State the strongest credible counterexample, a safe realistic fixture or simulation, the result the chosen plan predicts, the contradictory signal, and a stopping condition. Feed concrete high-impact cases into gate 4's failure scenarios; do not count speculation, repeated examples, or unrun tests as passed. Check for displaced risk to another user or system.
4. **Decision — what survives the challenge?** Compare the selected plan with a smaller or more reversible option using goal coverage, evidence quality, failure cost, and rollback. Record `claim | supporting evidence | rival explanation | falsifier | observed result | decision/residual risk`; mark observations not yet run as `pending`, never `pass`. Make a provisional choice, run gate 4's safe scenarios, then finalize the decision before Act. Proceed only when the value criterion is confirmed, critical causal links have evidence, and no tested counterexample invalidates the plan. Otherwise return to Observe/Orient, or pause for the user's decision on an unresolved consequential risk. A reviewer opinion without evidence cannot override a failed test.

This is an independently specified OODA reasoning procedure; it does not claim identical behavior to any other skill. The procedure must work when OODA is the only installed skill. Retain explicit confirmation at every existing checkpoint through the available channel and record whether an actual independent swarm review occurred.

## Analysis/Verification Short Path

When the task is classified as Analysis / Verification in Purpose First, skip the full OODA loop. Use this simplified path instead:

### Rules

1. **Observe**: read all relevant files, data, or artifacts. Capture the current state with concrete evidence.
2. **Analyze**: compare, contrast, grade, or classify. Apply the analysis method defined in the user's request.
3. **Output**: produce the report, table, or finding list directly to the project-appropriate location. Do NOT write to `work_ooda/`.

### What is skipped

- No TaskCreate / TaskUpdate calls
- No Understanding Restatement with AskUserQuestion
- No 5W1H Divergent Scan
- No U&Q mandatory questions (3-4 dimensions)
- No Orient → Decide → Act → Verify → Iterate loop
- No state-R{N}.md checkpoint file
- No `work_ooda/` process records

### What is NOT skipped

- Read actual files (don't rely on memory)
- Report concretely with file paths, line numbers, counts
- Verify the output matches the user's success standard before closing

### Trigger keywords

Typical prompts that should route to this path: "check if X and Y are consistent", "review these files for issues", "audit the configuration", "compare A and B", "list all the differences", "validate the structure of".

### When NOT to use

Do NOT use this path when:
- The scope is unclear ("review the project" without specifying what)
- The method is unclear (no obvious way to compare or grade)
- The user expects iterative improvement ("keep checking until it's perfect")
- The output requires a decision or action beyond reporting findings

In those cases, route to Simple/Medium/Macro loop as appropriate.

## Understanding Restatement

After Purpose First and before U&Q, restate your understanding to the user in your own words. **This catches directional guesses before they become assumptions.**

### Rules

1. **Restate in one paragraph.** Cover these four dimensions:
   - **What** to do (the core goal, in one sentence)
   - **Why** it matters (the context or problem behind the request)
   - **Where** the boundary is (what's in scope, what's explicitly out)
   - **How** to approach it (high-level strategy, not detailed steps)

2. **Surface your assumptions.** If any part of your understanding relies on inference rather than explicit user input, flag it: "I'm assuming [X] based on [Y]. Is that correct?"

3. **Confirm through the available channel.** Prefer `AskUserQuestion` with "Confirm" or "Needs Adjustment" options. When unavailable, ask the same question in structured chat and wait for an explicit answer. Do not count the question itself as confirmation.

4. **Wait for confirmation.** Do not proceed to U&Q until the user confirms or corrects. If the user corrects, restate the revised understanding and ask again.

5. **Write to file.** Record the restatement and the user's response (confirmed or corrected) to `00-purpose.md` under a `## Understanding Restatement` section.

### Output Format

```text
## Understanding Restatement
- What: [one sentence — the core goal]
- Why: [one sentence — the context or problem]
- Boundary: in scope → [X]; out of scope → [Y]
- How: [high-level approach, 1-2 sentences]
- Assumptions surfaced: [list any inferences flagged for confirmation]
- User response: confirmed | corrected → [what changed]
```

This step does not replace U&Q — it aligns on direction first. U&Q then handles the detailed unknowns (scope boundary specifics, depth, conventions, dependencies, preferences).

## 5W1H Divergent Scan

After Understanding Restatement is confirmed and before forming U&Q questions, run a mandatory 5W1H divergent scan. The goal is not to find answers — it is to systematically explore the problem space so no blind spots are missed before asking the user.

### Six Dimensions

For each dimension, record three things: what is already known, what is fuzzy, and what questions emerge.

| Dimension | Core Question | Known | Fuzzy | Questions to Explore |
|-----------|-------------|-------|-------|---------------------|
| **Who** | Who is affected? Who decides? Who depends on this? | [extracted from user description] | [uncertain aspects] | [questions for the user] |
| **What** | What exactly to produce? Scope boundaries? | [...] | [...] | [...] |
| **Where** | Which system/module/layer does this touch? | [...] | [...] | [...] |
| **When** | Time constraints? Dependency ordering? | [...] | [...] | [...] |
| **Why** | Why solve this now? What is the root problem? | [...] | [...] | [...] |
| **How** | What viable paths exist? Tools/methods? | [...] | [...] | [...] |

### Rules

1. Go through all six dimensions. None may be skipped. If a dimension truly has no relevant information, mark it "no relevant info" — but do not skip it.
2. Questions from the "Questions to Explore" column feed directly into the U&Q candidate pool. This ensures U&Q questions are the output of systematic scanning, not ad-hoc curiosity.
3. Write the scan result to `00-purpose.md` under a `## 5W1H Divergent Scan` section.
4. Cap each dimension at three entries — known, fuzzy, or question — then stop. The output of this step is one table, not an analysis. The point is coverage, not depth.
5. This is an agent-internal step. Do not present the full matrix to the user — only the U&Q questions derived from it.

## Understand & Question

After Purpose First and before entering the first OODA round, run a mandatory Understand & Question phase.

### Rules

1. **Read context first.** Read CLAUDE.md, relevant project files, directory structure, recent changes, and anything else needed to understand the task environment.

2. **Mandatory validation — ask questions even when the user provides a plan.** U&Q is not "ask only if you don't understand." It is "you may not enter the first round without asking." A clear plan from the user does NOT mean you can skip U&Q. You MUST validate from these four dimensions with at least 1 question each (minimum 3 questions total; minimum 4 for analysis/evaluation/diagnosis tasks). "The user already explained clearly" is not an acceptable reason to skip:
   - **Boundary check**: What does the plan cover, and what does it leave out? What risks exist at the boundary?
   - **Risk check**: Where is the plan most likely to fail? What hidden assumptions does it rely on?
   - **Gap check**: What dependencies, steps, or rollback plans are missing from the plan?
   - **Benchmark check** (mandatory for analysis/evaluation/diagnosis tasks; skip for coding/bug-fix/doc tasks): Must ask each of the following explicitly — do NOT collapse into a single topic label:
     · Is there a competitor, reference project, or industry benchmark? ("None" is a valid answer, but must be confirmed explicitly)
     · If yes: what is their current state, key metrics, and core capabilities?
     · What position is the user in relative to them? (leading / catching up / parity / irrelevant)
     · Are there industry standards or common practices worth referencing?

3. **Supplement with discovery questions.** Beyond the mandatory validation, identify everything you do not understand or are uncertain about:
   - The scope boundary (what exactly is in scope vs. out?)
   - The depth expected (surface fix or deep refactor?)
   - Project conventions (naming, structure, existing patterns?)
   - Dependencies (what else depends on the target, or what does the target depend on?)
   - User preferences (which of multiple valid approaches does the user prefer?)
   - Any term, concept, or reference in the user's request that is ambiguous.

4. **Ask through the available channel.** Present questions (mandatory validation + discovery) via `AskUserQuestion` when available, otherwise as numbered chat questions with A/B/C options or concise free-form answers. Max 4 questions per popup batch; split into two batches if more. In chat, explicitly request each answer and wait for the user's reply. Each question must be:
   - **Specific and closed-ended**: answerable with a choice (A/B/C) or one sentence.
   - **About genuine unknowns**: not things you can find by reading existing files.
   - **Prioritized**: the most impactful unknowns first.

5. **Wait for all answers.** Do not proceed until the user has answered every question. If the user answers partially, follow up on the unanswered ones.

6. **Summarize and confirm.** After receiving all answers, restate your understanding in 2-3 sentences. Ask the user: "Does this match what you want?" Only proceed after explicit confirmation.

7. **Write to file.** Record the questions, answers, and confirmed understanding to `00-purpose.md` under a `## Understand & Question` section.

### Output Format

```text
## Understand & Question
- Context read: [files and directories inspected]
- Unknowns identified: [list of what was unclear]
- Questions asked:
  1. [Q1] → Answer: [user's answer]
  2. [Q2] → Answer: [user's answer]
- Confirmed understanding: [2-3 sentence summary]
- Confirmed by user: yes
```

### Re-trigger

If a new uncertainty arises during any OODA round—something you did not anticipate and cannot resolve by reading files—pause the current round and re-enter Understand & Question for that specific unknown. After the user answers, resume the current round from Observe: the new information may change what you saw. Never guess.

## Process Record Directory

OODA process files are written to `work_ooda/`. This directory is the OODA workspace for thinking, execution notes, and review. It is **not the final output directory for the task deliverable**.

Create the directory under the **current working directory**, not under the skill installation directory:

```text
work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/
```

`YYYYMMDD-HHMMSS` is the local timestamp when the task starts. `{task-slug}` is extracted from the user's request.

**Timestamp source (mandatory)**: run `date '+%Y-%m-%dT%H:%M:%S%z'` once at task start (PowerShell: `Get-Date -Format o`) and derive every timestamp from that single stdout: the directory name `YYYYMMDD-HHMMSS`, each round frontmatter `timeline` entry, and each command in state section C. Record the command and its raw output in section C like any other command. Re-run it whenever a fresh time is needed. If no shell is available, or `date` rejects the format, write `time_source: unavailable` in the round frontmatter and use date-only values — a declared limitation is not fabrication.

Use this file layout:

```text
work_ooda/
├── _index.md          ← task index, one row appended per Close
├── {YYYYMMDD-HHMMSS}-{task-slug}/
│   ├── 00-purpose.md
│   ├── state-R{N}.md        ← checkpoint file, per-round snapshot (one per round; NEVER overwritten)
│   ├── 01-round-1.md
│   ├── ...
│   └── summary.md
```

Write one file per round immediately after that round. Do not keep all rounds only in one summary file.

**Immutability rule**: Once a round file is written, do not modify it. If a later round discovers an earlier observation or judgment was incorrect, do NOT edit the old file. Instead, note the correction in the new round's Observe section: `[Correction to Round N] Original judgment: X. Corrected: Y. Reason: Z.`

Important: `work_ooda/` only stores OODA meta files: purpose clarification, per-round reports, and final summary. The actual task deliverable, such as code, docs, reports, or analysis artifacts, must be written to the project-appropriate location and **must not be placed in `work_ooda/`**.

`00-purpose.md` must include:

- User goal: what effect the user really wants, not just the task wording.
- Success standards: how completion will be judged.
- Constraints: time, scope, safety boundaries, and required confirmations.
- Understanding Restatement: what/why/boundary/how, assumptions surfaced, and user response (confirmed or corrected).
- 5W1H Divergent Scan: six-dimension matrix (Who/What/Where/When/Why/How) with Known/Fuzzy/Questions to Explore.
- U&Q: questions asked, answers received, and confirmed understanding.
- Expected round count if known; write `unknown` when it cannot be estimated.

Each `{NN}-round-{N}.md` must include (`{NN}` is the round number zero-padded to two digits: `01`, `02`, … `10`, `11`):

- Observe evidence.
- Orient diagnosis and severity.
- Decide plan.
- Act changes.
- Self-check.
- Whether the next round will run.

`summary.md` must include:

- Purpose recap (conclusion first).
- restore_anchor (the compression-recovery card): goal / approach / progress / blockers / next — so that after context compression a fresh agent can recover the whole task from summary + the latest state-R{N}.md without rereading every round.
- Target status table: each goal G1..Gn -> done | partial | not, with evidence.
- Total rounds and final status: `done`, `partial`, or `needs-human`.
- Per-round summary table (round / topic / conclusion / highest severity).
- Success-standard acceptance checklist (checked against 00-purpose.md success standards, with evidence).
- Final ADR decision card (final decision + rationale + consequences + links).
- Remaining issues requiring user decision.

Keep records concise. Do not store secrets, credentials, private tokens, or unnecessary user data in output files.

### state-R{N}.md — Task Continuity Checkpoint

`state-R{N}.md` is the **single source of truth for cross-round state**. Its purpose is task continuity: if a fresh Agent instance takes over mid-task, reading `state-R{N}.md` must provide everything needed to continue without the original conversation context.

**Write rule**: Create a NEW state-R{N}.md at the end of every Act (one per round, NEVER overwritten — previous state-R*.md stay on disk so every round is diffable and auditable; this is the anti-hallucination guard against overwriting past state). Six sections (A-F), all mandatory.

**Read rule**: Every Observe must read the PREVIOUS round's checkpoint `state-R{N-1}.md` as its first action. Round 1 has no predecessor — skip. Note the asymmetry: round N READS `state-R{N-1}.md` at its start and WRITES `state-R{N}.md` at its end.

**Template**:

```
---
round: "{N}"
status: active | paused_waiting_user_input
time_source: shell | unavailable
timeline: "[{step, timestamp}, ...]   # at least start+complete of this round, ISO 8601"
created: "{YYYY-MM-DD HH:MM}"
---

## A. Task Self-Summary (read this section ALONE after context compression to recover the task)
- Goal: G1/G2... -> {current status per goal}
- Approach: {what approach is currently in use}
- Progress: {reached round R{N}; what is already done}
- Blockers: {current blocker / unresolved issue}
- Next: {what round R{N+1} will do}

## B. Context Snapshot (cross-round context storage — survives context compression)
- Files read: {list with paths}
- Key gaps: {not yet covered / broken links}
- Glossary: {acronym/term -> meaning}

## C. What Changed This Round (with evidence — guards against hallucinated updates)

### Artifacts
<!-- List every file produced or modified. Coding: path + line range. Non-coding: output + one-line description. -->
- [artifact] — [one-line description]

### Change Details
> **Coding (git available)**: diff -> [R{N}.diff](R{N}.diff) (N lines, N files). Summary: [one sentence].

> **Coding (no git)**:
> - `path/to/file` L{N}-L{N}: [before -> after key snippet]

> **Non-coding**: Produced [artifact type]. Key conclusion: [finding]. Verification: [data].

### Commands Executed
<!-- Coding: mandatory. Non-coding: optional. Always timestamp each command. -->
- {YYYY-MM-DD HH:MM} `command` -> [result summary]

## D. Decision Trail (ADR per-round decision record: option + rationale + consequences)
| R | Selected option | Rationale | Consequences | Superseded by |
| R1 | {option -> chosen} | {why this choice} | {positive/negative} | - |
| R2 | {option -> chosen} | {why} | {pos/neg} | R1 |

## E. Remaining Issues
<!-- Ordered by severity. Each: severity tag + root cause hint + suggested next action. -->
- [critical] [issue] — root cause: [why] — suggestion: [what to try]
- [major] [issue] — root cause: [why]
- [minor] [issue] — can defer

## F. Next Round Direction
<!-- Concrete priority and suggested method, with an accepted/verifiable expected result. -->
- Priority: [specific issue to address]
- Method: [suggested approach]
- Expected: [anticipated, verifiable outcome]

```

**Completeness check** (enforced in Verify):
- All sections A-F are non-empty: A is the compression-restore anchor, C carries evidence, D carries the ADR decision trail.
- No unreplaced placeholders. Scan for both `[xxx]` and `{xxx}` patterns, then EXEMPT: severity tags (`[critical]`/`[major]`/`[minor]`/`[cosmetic]`), evidence-source tags (`[Direct Observation]`/`[AI Inference]`/`[AI Conclusion]`), issue-type tags (`[regression]`/`[logic contradiction]`), cross-round markers (`[Correction to Round N]`/`[state gap: ...]`), and markdown links `[text](target)`. Anything else still in bracket or brace form is an unfilled placeholder and fails the check.
- Every command recorded in section C carries a real timestamp; a `000000` placeholder fails the check.
- No vague claims: "modified several files" → fail; "modified `signals/signal_driven_filter.py` L352" → pass.
- Overwrite guard: the current file is `state-R{N}.md`; every earlier `state-R*.md` must remain unchanged on disk.

## Detailed Output Mode

Every OODA run must use detailed output mode. Show each step's current logic to the user in a structured way.

### Step Output Format

| Step | Output | Task Operation |
| --- | --- | --- |
| Purpose | `## Purpose Clarification` + user goal, success standards, constraints | After complete → task 1 `completed`; task 2 → `in_progress` |
| Understanding Restatement | `## Understanding Restatement` + what/why/boundary/how + assumptions surfaced + user response | After user confirms → continue with 5W1H scan |
| 5W1H Divergent Scan | `## 5W1H Divergent Scan` + six-dimension matrix (Who/What/Where/When/Why/How) with Known/Fuzzy/Questions | Agent-internal; questions flow into U&Q candidate pool |
| Understand & Question | `## Understand & Question` + context read, unknowns, questions (seeded by 5W1H), answers, confirmed understanding | After all U&Q answers → task 2 `completed`; task 3 → `in_progress` |
| Observe | `## Observe` + what is being observed, current state, key findings; add Delta comparison from round 2 onward | — |
| Orient | `## Orient` + root cause analysis and issue severity table | After Orient output → task 3 `completed`; task 4 → `in_progress` |
| Decide | `## Decide` + selected plan, reason, expected effect | — |
| Act | `## Act` + concrete operations, affected files, execution result, errors if any + `## Write state-R{N}.md` (checkpoint for next round) | After Act + state-R{N}.md write → task 4/5 `completed`; task 5/5 → `in_progress` |
| Verify | `## Verify` + verification method, result, confidence, and regression status | — |
| Iterate/Close | `## Iterate / Close` + whether the next round will run and why, or the closure summary | Next round → create new tasks 3/4/5; Close → task 5/5 `completed` |

Write the process files at the same time and show the step summary to the user.

### Progress Indicator

Progress is displayed via Claude Code's native task system in the status bar, with 5 tasks stacked vertically and R1/R2 round markers clearly visible:

```
1/5 Understand Problem — Clarify Purpose·Define Success
2/5 Align & Ask — Restate Understanding·Gather Constraints
3/5 Diagnose & Orient — R1 Observe Reality·Analyze Root Cause      ← round marker
4/5 Decide & Execute — R1 Select Approach·Apply Changes
5/5 Verify & Close — R1 Check Results·Summarize & Iterate
[If R2] 3/5 Diagnose & Orient — R2...  ← new round tasks stacked
```

Each task is set via `TaskUpdate` to `in_progress` (●) or `completed` (◼) at the appropriate phase.

**Step abbreviation reference** (for in-chat text annotation only):

| Abbreviation | Step | When |
|-------------|------|------|
| P | Purpose First | Pre-loop, once |
| U | Understanding Restatement | Pre-loop, once |
| W | 5W1H Divergent Scan | Pre-loop, once |
| Q | Understand & Question | Pre-loop, once |
| O | Observe | Every round |
| R | Orient | Every round |
| D | Decide | Every round |
| A | Act | Every round |
| V | Verify | Every round |
| I | Iterate (enter next round) | End of round (if more rounds) |
| C | Close | Final round (instead of I) |

**Display rules**:
- Tasks 1-2 (Understand Problem / Align & Ask) advance sequentially: task 1 (Purpose) → task 2 (Understanding Restatement → 5W1H scan → U&Q). Task 2 completes only after all U&Q answers are received.
- Tasks 3-5 carry round markers (R1, R2...), retained after completion for clear progress visibility
- Entering a new round → create new 3/4/5 (R{N+1}), old round tasks stay completed
- Status bar shows: ◼ completed (green) / ● in_progress (yellow) / ◻ pending

## Loop Scale — in plain terms: how much effort this round costs. Bigger scale → more evidence, stricter verification.

Choose the loop scale by two independent factors:
- **Complexity**: what is the scope? Single-file → multi-file → cross-system.
- **Irreversibility**: how hard is it to undo? Reversible → needs confirmation → irreversible.

Higher complexity or higher irreversibility → larger scale.

**This table is the authoritative tier.** The buckets in "Purpose First" give only an initial value, decided once; this table is recomputed every round. When they disagree, this table wins, and the route line records both the initial and the final tier.

| Scale | Complexity | Irreversibility | Use When | Typical Shape |
| --- | --- | --- | --- | --- |
| Micro loop | Single-file | Reversible | A narrow bug, document fix, or single-file change. Do NOT use Micro when a comparison or validation is meant to DRIVE a change and manual inspection may reveal structural issues — use Medium. Read-only comparison that only produces a report is the Analysis Short Path, not Micro | Observe relevant artifact, one scoped decision, act, rerun once to verify. A comparison, structure read, or manual logic trace that drives a change defaults to Medium |
| Medium loop | Multi-file | Needs confirmation | A feature, multi-file skill update, workflow design, or non-trivial content package | Split by dependency, handle selected issues per round, verify with tests or structured inspection |
| Macro loop | Cross-system | Irreversible | Architecture, migration, release, or high-risk strategy work | Ask success standards early, use visible checkpoints, pause before irreversible actions |

Do not make ordinary work slower just because a scale exists. The scale only determines how much evidence, planning, and verification the round needs.

## Minimal Output Contract — the bare-minimum info every completed task must end with

For completed work, end with:

- The concrete result.
- The verification performed.
- Whether the problem is solved.
- Process record directory: `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` (OODA meta files only, not task deliverables). Full-loop tasks only — the Analysis/Verification Short Path and Trivial tasks have no such directory and must not invent one.
- Total round count.
- The next action only when one remains.

For decisions, state:

- The selected path.
- The reason it fits the current evidence.
- Whether confirmation is needed before acting.

## Loop

### Detailed Output Rules

Output each step's logic to the user. Use `## Step Name` as heading, 1-3 sentences of concrete logic per step. No empty headings, no vague filler. Show the concrete object, issue, and decision.

### 0. Purpose

Clarify the user's purpose before entering the loop.

Output:

```text
## Purpose Clarification
- User goal: [one sentence]
- Success standards: [list]
- Constraints: [list]
- Expected rounds: [number or unknown]
- Status: ready | paused_waiting_user_input
```

Write this to `00-purpose.md`. If the purpose or success standard is unclear, ask the user and pause.

After purpose confirmed → `TaskUpdate` task 1 `completed`; task 2 → `in_progress`.

### -1. Understand & Question (mandatory before first round)

Follow the rules and output template in the [Understand & Question](#understand--question) section above. Write Q&A to `00-purpose.md`.

After all U&Q answers → `TaskUpdate` task 2 `completed`; then `TaskCreate` task 3 → `in_progress`.

### Per-Round Loop

After Orient output → `TaskUpdate` task 3 `completed`; task 4 → `in_progress`.

When the Decide step has only one viable path (no ambiguity, no risk, reversible): merge Decide into Act — state the decision as the first line of Act output, skip standalone Decide section. Task 4 stays `in_progress` through Decide+Act, then `completed` after Act.

When Decide needs user confirmation or involves multiple options: output Decide standalone, request confirmation, then proceed to Act.

After Act completes → `TaskUpdate` task 4 `completed`; task 5 → `in_progress`.

After verification passes:
- Next round → `TaskUpdate` task 5/5 `completed`; create new `3/5 Diagnose & Orient — R{N}` → `in_progress`, then 4/5, 5/5 in sequence
- Close → task 5/5 `completed`, enter Close

### 1. Observe

**Step 0: Read state-R{N-1}.md (hard gate, every round except round 1).**

Before reading any project files, read `state-R{N-1}.md` in the task directory — the checkpoint written at the end of the previous round. This is the single source of truth for cross-round continuity. If `state-R{N-1}.md` does not exist and this is round 2+, the previous round did not complete normally — read the previous round's report file (`{NN-1}-round-{N-1}.md`) to recover state, then proceed. If several state-R*.md exist, take the one with the highest index M; if M is not exactly (current round − 1), write `[state gap: expected R{N-1}, found R{M}]` in the Observe output and recover from the round report.

Include in Observe output:
```text
- [From state-R{N-1}.md] Remaining issues: [list each with severity]
- [From state-R{N-1}.md] Lessons carried forward (state section F / E): [list each]
- [From state-R{N-1}.md] Previous round artifacts (state section C): [list each]
```

**Step 1: Capture the current state.**

You must actually read the files or artifacts involved in the current round. Do not rely on memory.

Output:

```text
## Observe
- Round: R{N} | Started: {timestamp} | Closed: {timestamp}
- problem_statement (ADR context): [the core problem this round addresses, one line]
- Current state: [describe the actual current state]
- Key findings (each tagged with one source type):
  - [Direct Observation] pure sensory facts — only what was literally seen, read, or returned. Must NOT contain any normative vocabulary: no "should", "missing", "correct", "wrong", "standard", "reasonable", "normal", "abnormal", "error" (as judgment). If the description implies a judgment criterion, it is [AI Inference].
  - [AI Inference] inferences drawn from observed facts — still a hypothesis, may be wrong
  - [AI Conclusion] synthesized judgment after combining multiple observations and inferences

  Rule: every key finding must carry a source tag. An inference must not
  be written as an observation. A conclusion must not be written as a fact.

  Examples of what IS and IS NOT [Direct Observation]:
  ❌ "L42 is missing a null check" → [AI Inference] ("missing" implies a standard)
  ✅ "L42 calls obj.method() without a preceding null check" → [Direct Observation]
  ❌ "Config format is non-standard" → [AI Inference] ("standard" is a judgment)
  ✅ "Config uses 3-space indent; other project files use 2-space indent" → [Direct Observation]
  ❌ "API response time is too slow" → [AI Inference] ("too slow" implies a baseline)
  ✅ "API /orders P99 latency = 3500ms" → [Direct Observation]
```

From round 2 onward, add Delta comparison:

```text
- Delta comparison:
  Fixed items: X -> verified: Y, ineffective: Z
  Newly introduced issues: N
  Remaining issues: M
```

Only inspect relevant material: project notes, relevant files, recent changes, user constraints, and the real goal.

After key findings, run a structural scan. Answer at least one of the three; write "no anomalies" only if genuinely none apply, and never as the only finding:

- Structural awareness: what is the implicit structure here? what is core vs. periphery?
- Contradiction awareness: what coexists here that should not coexist?
- Absence awareness: what should exist here but does not?

If contradiction awareness finds a **data mismatch** (two values, records, or states that should agree but do not), flag it explicitly. When this flag is raised, the round enters **Data Reconciliation Diagnostic Mode** instead of the normal Orient → Decide → Act flow. See that section below.

### 2. Orient

Form a quick but grounded judgment.

Output:

```text
## Orient
- Root cause analysis (drill at least two layers):
  - Surface (What): [the visible problem]
  - Mechanism (Why): [the direct cause — mandatory floor, must reach this layer]
  - Principle (Why allowed): [the systemic reason — strongly recommended]

  If Principle is not reached, explain specifically what prevented deeper drilling
  (e.g. "the systemic cause involves CI configuration outside this task's scope").
  Generic reasons like "current fix is sufficient" are not acceptable.
- Gap from goal: [what still prevents the success standard]
- Decision drivers (ADR drivers): [which drivers from 00-purpose.md this round addresses]
- Options considered (ADR alternatives):
  | Option | Description | Status |
  | Option A | [desc] | selected |
  | Option B | [desc] | alternative |
- Pros/cons (ADR per option, for the top 1-2 options):
  - Option A: pros [good] / cons [bad]
  - Option B: pros [good] / cons [bad]
- Issue severity:
  | Severity | Issue | Tag |
  | --- | --- | --- |
  | critical/major/minor/cosmetic | ... | ... |
```

Identify the core problem, root cause, gap from the goal, and 2-3 viable paths when useful. Prefer concrete judgments. If evidence is insufficient, say so directly.

Severity rules:

| Severity | Meaning | Action |
| --- | --- | --- |
| `critical` | Blocks the goal | Must fix in this round |
| `major` | Hurts quality but does not fully block the goal | Prioritize in this round |
| `minor` | Small flaw | Fix if cheap; otherwise record for the next round |
| `cosmetic` | Formatting or naming polish | Defer or skip |

Use severity to decide the current round's scope.

### 2.1 Data Reconciliation Diagnostic Mode

When Observe detects a data mismatch (A should equal B, but A ≠ B, and the reason is unknown), **do not immediately decide on a fix**. Switch to diagnostic mode instead. The goal shifts from "fix the problem" to "find the divergence point."

#### Trigger Conditions

Any of the following activates diagnostic mode:

- Two data sources record different values for the same entity
- System state does not match expected state, and the mismatch source is unclear
- A previous round's fix did not resolve the mismatch, and root cause is still unknown
- A value appears where it logically should not (or is absent where it must be)

#### Diagnostic Flow

1. **Source trace**: Trace the full lineage of both sides of the mismatch independently.
   - Side A: where does it originate → what transforms it → what is its current value?
   - Side B: where does it originate → what transforms it → what is its current value?
   - Document each step with concrete evidence (file, line, function, query result).

2. **Divergence point**: Find the earliest step where the two lineages diverge. This is the root cause.

3. **Three outcomes**:

   | Outcome | Action |
   |---------|--------|
   | Divergence point found within observable scope | Normal Orient → Decide → Act to fix it |
   | Divergence point is in an unobservable area (database, external service, runtime state not in code) | Produce a **Diagnostic Handoff Report** (below). Do NOT attempt a fix — you lack the evidence. Pause and hand off to the user. |
   | Both lineages are fully traced and identical, yet values still differ | Mark as **[logic contradiction]** — this is a major discovery. Pause immediately. Do not guess. |

#### Diagnostic Handoff Report

When the divergence point cannot be located within observable scope, output the following and set status to `paused_waiting_user_input`:

```text
## Diagnostic Handoff — Root Cause Not Found in Observable Scope
- Mismatch: [A] = [value] vs [B] = [value] (expected equality)
- Lineage traced (A): [list each step checked, with file/line or query evidence]
- Lineage traced (B): [list each step checked, with file/line or query evidence]
- Blind spot: [which step(s) cannot be observed from code/files, and why]
- Best hypothesis: [based on available evidence, where is the divergence most likely?]
- Suggested next check for user: [specific action: database query, log grep, config diff, runtime inspection, etc.]
```

Key rules for the handoff:
- List what you checked with concrete paths/queries, not "checked everything."
- State the blind spot precisely: "cannot observe [X] because [Y]."
- The hypothesis must be grounded in evidence, not speculation.
- Suggest one specific, actionable check the user can perform.

#### Verification in Diagnostic Mode

When a round operates in diagnostic mode, the Verify step checks:

- [ ] Both lineages are fully traced with concrete evidence
- [ ] Divergence point is either found or explicitly declared unobservable
- [ ] If unobservable, a complete Diagnostic Handoff Report was produced
- [ ] No fix was attempted without root cause evidence

A diagnostic round is **successful** if it either finds the divergence point or produces a complete handoff. It is **not successful** if it guesses at a fix without root cause.

### 3. Decide

Choose the next action.

Output:

```text
## Decide
- decision (ADR option): [which option from the Orient table was chosen]
- Selected plan: [what this round will do]
- Reason / rationale (ADR): [why this plan fits — which driver/option trait it satisfies]
- Expected effect: [expected state after the change]
- Round scope: [only the issues decided here, prioritized critical -> major -> minor -> cosmetic]
```

Execute ordinary low-risk work directly. Pause and request confirmation for risky, destructive, expensive, external, or ambiguous actions.

No standalone TaskUpdate — Decide sits between Orient (task 3) and Act (task 4). When Orient outputs, task 3 is completed and task 4 is in_progress. If Decide requires user confirmation, task 4 stays in_progress waiting.

### 4. Act

Execute the selected steps.

Output:

```text
## Act
- Concrete operation: [what was done, including commands or edits]
- Affected files: [files changed]
- Execution result: [success/failure; include errors and handling if failed]
```

Execution requirements:

- Use concrete commands, files, and evidence. Avoid vague claims such as "probably" or "should be fine".
- Lock scope: only fix what Decide selected. Preserve existing style and structure. Do not mix in unrelated cleanup or refactors. Record new issues for the next round.
- Run independent issues in parallel when possible; run dependent issues sequentially.
- For obvious errors, retry once. Otherwise change approach or ask the user for help.

### 4.1 Write state-R{N}.md (mandatory after Act)

After all changes are complete, write `state-R{N}.md` to the task directory. This is the checkpoint that the next round's Observe reads.

**If git is available** (optional accelerator):
1. Run `git diff > work_ooda/{task}/R{N}.diff` to capture exact changes.
2. Write `state-R{N}.md` using the template from [state-R{N}.md — Task Continuity Checkpoint](#state-rnmd--task-continuity-checkpoint).
3. In section C (What Changed This Round → Change Details), reference the diff file: `diff → [R{N}.diff](R{N}.diff) (N lines, N files). Summary: [one sentence].`
4. Fill the remaining A/B/D/E/F sections manually.

**If git is not available** (universal path):
1. Write `state-R{N}.md` using the full template.
2. Section C (What Changed) must include: each file path, line range, and before→after key snippet.
3. Section C (Commands Executed) is mandatory for coding tasks; every command must carry a real timestamp (not 000000).
4. Sections A/B/D/E/F filled with concrete, specific content — no placeholders, no vague claims.

**Verification before proceeding**: `state-R{N}.md` exists and all sections A-F are non-empty; previous state-R*.md remain unmodified on disk. If using the git path, `R{N}.diff` also exists.

### 5. Verify

Check whether the action worked.

Output:

```text
## Verify
- Verification method: [test, file inspection, goal comparison, etc.]
- Verification result: [whether the issue is solved, with concrete evidence]
- Consequences (ADR: positive/negative outcomes of the chosen option): [positive: ...; negative: ...]
- Remaining issues: [list if any]
- Regression introduced: yes | no; tag [regression] if yes
- Confidence: high | medium | low
```

Self-check list, written into each round file:

```text
[ ] Fix is effective
[ ] No new regression, or regression is listed
[ ] Confidence: high | medium | low
[ ] Task status bar: all 5 tasks correctly in_progress/completed per phase
[ ] User question needed: yes | no
[ ] Next round needed: yes | no
[ ] state-R{N}.md (this round's, written at the end of Act — required in EVERY round including round 1) exists and all sections A-F are non-empty; previous state-R*.md remain unmodified on disk
[ ] state-R{N}.md has no unreplaced placeholders (both `[xxx]` and `{xxx}` forms, with the exemption list in the Completeness check above)
[ ] state-R{N}.md has no vague claims ("modified several files" → fail, "modified path/to/file L352" → pass)
[ ] Guardrails compliance: each of the 5 guardrails checked with concrete evidence
```

For the Guardrails compliance item, check each of the 5 guardrails and give one concrete piece of evidence. Example:

```text
[ ] Guardrails compliance:
    - "Don't guess" → asked user about scope boundary during U&Q (see 00-purpose.md)
    - "Don't drift" → only changed the 3 files listed in Decide, recorded 1 new issue for next round
    - "Don't skip" → re-read config.yaml before Orient, ran build and verified 0 errors
    - "Report concretely" → cited L42, L105 with before/after snippets
    - "Capture lessons" → recorded "null-check-before-access" pattern in round file; indexed under bug-fix/critical in _index.md
```

A guardrail checkbox without evidence is not compliance.

Before verification passes, confirm both:

- The result satisfies the user's stated purpose and success standard.
- The execution path did not skip required observation, guess unclear intent, or exceed the decided scope.

For code, configuration, skill, prompt, template, or agent-configuration tasks, also check: tests or validation pass, style is consistent, no unused imports or references exist, and no unrequested functionality was added.

### 6. Iterate

When verification finds unresolved issues, automatically enter the next OODA round.

Output:

```text
## Iterate
- Next round: yes | no | paused_waiting_user_input
- Reason: [why another round is or is not needed]
- Links (ADR links): [previous round file / 00-purpose.md / formal ADR decision document if one was produced]
```

- Unresolved issue -> automatically run the next round and record `next_round: yes`. Create new "R{N}" tasks (3/5→4/5→5/5) when entering the new round.
- Blocked -> record `paused_waiting_user_input` and ask a concise question.
- Ineffective or worsening fix -> mark `[regression]`, perform the smallest safe rollback, and change approach.
- Same issue remains after two consecutive fix attempts -> pause and ask for help; record attempted plans, rollback state, and failure reason.
- Data mismatch detected but root cause not found after one full diagnostic round -> do NOT enter a second round of guessing. Produce a Diagnostic Handoff Report immediately. Do not attempt a fix without evidence.

Reusable learning capture is required when a round produces a reusable pattern, checklist, command, test case, diagnostic method, decision rule, or other asset. Do not force learning capture for trivial work.

When useful, record:

- Reusable learning: what can be reused next time.
- Reusable asset: the test case, checklist, command, template, document, script, or decision rule produced or improved.
- Next-time shortcut: what this round makes faster or safer next time.

Only write durable lessons to memory when they have long-term value.

### 6.5 Final Full-Run Verification Round

When a round's verification shows all known issues are resolved, and the task went through multiple rounds or multiple steps before, you MUST run a final full-run verification before Close: re-run the entire task chain end-to-end from start to finish, confirming every link of the whole is correct — not just spot-checking the last step.

> Plain terms: don't just verify "the one thing you fixed last"; re-verify "the whole task done end to end" to make sure you didn't fix one part while breaking the whole.

Triggers (final full-run is mandatory if ANY applies):
- The task ran 2+ rounds, or involved multiple files, multiple steps, or cross-module changes.
- Changes are interdependent (a later step depends on an earlier step's output).
- There is a channel that can re-run the whole thing (build, tests, render, validation).

How to run the final full-run (pick what fits the task):
1. End-to-end re-run: re-execute the full flow / rebuild + full test suite / re-render + validate.
2. Full-chain check: walk input -> each intermediate artifact -> final output segment by segment, confirming no break.
3. Deliverable stands alone: confirm the final deliverable can be read/run/verified independently in a fresh environment WITHOUT the process files.

Write the final full-run result into state-R{N}.md / the round file, as evidence for Close:

```text
## Final Full-Run
- Trigger: multi-round/multi-step/cross-module, or a whole-run channel exists
- Method: [end-to-end re-run | full-chain check | standalone deliverable]
- Result: [N steps of the whole chain all passed / list of issues found]
- New issue found: none -> proceed to Close; found -> back into the OODA loop for another round
- Regression: yes | no
```

If the final full-run finds a new issue, do NOT close directly — return to Iterate and run another round.
### 7. Close

Close only after the problem is verified solved or the user explicitly stops.

To start closing:
- Task 5/5 is already `in_progress` from the Verify phase; keep it while writing summary
- After everything is done: `TaskUpdate` task 5/5 → `completed`

Output:

```text
## Task Closure
- Final result: [what changed]
- Verification: [what was verified]
- Why solved: [one sentence]
- Process record: work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/
- Task deliverable: [actual output location, not work_ooda/]
- Total rounds: N
- Remaining issues: [if any]
```

Before closing, write `summary.md` and check every success standard from `00-purpose.md`.

Append one row to `work_ooda/_index.md`:

```text
| YYYY-MM-DD | {task-slug} | N rounds | {one-line key finding} | {task-type} | {highest-severity} | {tags} |
```

- `task-type`: `bug-fix` | `refactor` | `review` | `analysis` | `content` | `skill-fix`
- `highest-severity`: `critical` | `major` | `minor` | `cosmetic` (highest level handled in this task)
- `tags`: free-form keywords for cross-task search, e.g. `#null-safety #auth #performance`. Use `#` prefix, separate with spaces. Include at least the tech domain and the symptom type.

After close complete:
- `TaskUpdate`: task 5/5 `completed` (confirm summary written, _index.md updated)

### 7.1 Formal Decision / Document Output (required for decision- or document-producing tasks)

`work_ooda/` only stores process files. When the task "produces a document/report" or "makes an important decision along the way", the final deliverable MUST be written as a standalone, formal document to the project-appropriate location (e.g. `output/...`), with a constrained structure that can be validated and regression-tested.

> Plain terms: important conclusions/decisions must not live only inside process files; they need a proper, normalized finished artifact.

- **When to pay attention**: the task involves an important selection/direction change, or the user asks to "produce a report/record/plan".
- **Formal document structure**: conclusion first -> context/problem -> options & choice -> rationale -> consequences/next steps. Reuse a structured output template (e.g. an ADR family / ai-skill-output-template) so the structure is enforced by the template and the LLM only fills content.
- **Landing**: write to the project-appropriate location (e.g. `output/{family}/{project}/{date}/...`), NOT to `work_ooda/`.
- **Finish**: the formal document counts as done only after it passes its corresponding validator; its path goes into Close's "Task deliverable".

> Relationship between OODA and decision records (plain terms): OODA makes sure the work is DONE right; the formal decision document makes sure the WHY is kept. If there is an important decision, both are needed before Close.
Do not close a task merely because an action was performed. Close only when the result and the execution path are both verified against the user's purpose.

## Stop And Pause Rules

Continue OODA rounds until the problem is verified solved.

Only close when:

- The problem is solved and verification evidence is recorded.
- The user explicitly says to stop. **If unresolved issues remain when the user says stop, ask once (and only once):** "Understood. I noted [X] and [Y] still unresolved. Should I record them as remaining issues in the summary, or would you prefer to handle them later?" Respect the user's answer—if they say no, close without pushing further.
- The user changes the goal, requiring a new purpose definition.

Pause, ask the user, and record `paused_waiting_user_input` when:

- The purpose or success standard is unclear.
- Required context is missing.
- The next action is risky, destructive, expensive, external, or ambiguous.
- Multiple valid solutions require a user preference.
- Continuing would rely on guessing.
- The same issue remains after two consecutive fix attempts.
- Root cause of a data mismatch is outside observable scope (diagnostic handoff required).

Do not use these phrases as reasons to close: "probably solved", "should be fine", "good enough", "the user likely means", or "I will assume".

## Guardrails

Five rules. Rules 1-3 protect the execution flow between user checkpoints. Rules 4-5 protect the long-term value of the follow-up record.

| # | Rule | What it means |
| --- | --- | --- |
| **1** | **Don't guess** | When purpose, scope, constraint, or user preference is unclear, pause and ask. Never proceed on assumptions. |
| **2** | **Don't drift** | Only do what Decide selected. Do not mix in unrelated cleanup, refactors, or "while I'm here" changes. Record new issues for the next round. |
| **3** | **Don't skip** | Every round must Observe (read the real current state, not memory) and Verify (check the result with concrete evidence). A round without both is incomplete. |
| **4** | **Report concretely** | Use specific file paths, line numbers, commands, and counts. The user judges reliability at checkpoints — vague reports make informed judgment impossible. |
| **5** | **Capture lessons** | Write reusable patterns into the round file (recording template → Iterate step). Indexed by `work_ooda/_index.md`. |

Rules 1-3 map to the execution flow: don't guess before acting, don't drift while acting, don't skip the feedback loop. Rules 4-5 ensure each follow-up task leaves a searchable trail — concrete evidence for the user today, reusable patterns for similar problems tomorrow.

Other step-level rules (read files in Observe, define core problem in Orient, auto-next-round in Iterate, pause after two failures, scope lock in Act, no deliverables in work_ooda/) are enforced by their own step sections.

## Execution Discipline (highest priority — any violation blocks Close)

> The output-template rules below are mandatory, not suggestions. The agent must follow them, not freelance. Any violation blocks Close: the task cannot be marked done/partial-verified.

**Scope**: gates 1-4 apply only to tasks running the full OODA loop (Micro / Medium / Macro). The Analysis/Verification Short Path and Trivial tasks are exempt from gates 1-4 by design — they produce no `work_ooda/` records, so those gates have nothing to check. Gate 5 (no fabricated evidence) applies to EVERY task without exception. Throughout this section, "cannot Close" means: do not mark the task done or partial-verified; close it as `needs-human` and list the unmet gate. It does NOT override "the user explicitly stops" in the Close and Stop-And-Pause rules.

1. **No state overwriting**: every round must write a NEW `state-R{N}.md`. Do NOT overwrite `state.md` or any existing `state-R*.md`; previous state-R*.md files stay on disk unmodified. Violation = cross-round amnesia / coverable hallucination = cannot Close.
2. **No fake timestamps**: the task directory name must be the real `YYYYMMDD-HHMMSS` of when the task starts. Every round frontmatter `timeline` and every command in state section C must carry a real ISO-8601 timestamp. `000000` placeholders or invented times = fabricated evidence = cannot Close. Get the time with the command in the Process Record Directory section — never guess it. Exception: when the round frontmatter declares `time_source: unavailable`, date-only values are compliant.
3. **ADR fields per round, none missing**: each round file must carry the fused ADR fields — Observe: problem_statement; Orient: decision drivers + options table + pros/cons; Decide: decision + rationale; Verify: consequences; Iterate: links. Missing any = defective round = cannot Close.
4. **Compression-recovery anchors present**: every `state-R{N}.md` must have sections A-F (A Task Self-Summary is the recovery anchor). `summary.md` must have restore_anchor, a target status table, and a Final ADR decision card. Missing = a fresh agent after context compression cannot recover the task = cannot Close.
5. **No fabricated evidence**: state section C "What Changed" must reference real commands and their real outputs/files; diff references must point to diff files that actually exist. Do not claim a step was done without the command/output. Do not rewrite the expected truth (00-purpose success standards) into the measured value to fake a pass.

Universal clauses (inherit):
- No skipping steps: Observe -> Orient -> Decide -> Act -> Verify -> Iterate must run in order; missing one = defective. Three exemptions, all defined elsewhere in this file: the Analysis/Verification Short Path (skips the loop entirely), Decide merged into Act, and Data Reconciliation Diagnostic Mode.
- No verdict rewriting: judgments survive only via new evidence in a new round, marked `[Correction to Round N]`; never edit old round/state files to change a verdict.
- Blocked items must halt and report: if a mandatory item cannot be done (permission / path missing / environment mismatch), stop and report "unmet: <item> <reason>"; do not bypass and continue.
- Sole exception: where the user explicitly confirms an adjustment, it is allowed but must be logged in 00-purpose.md feedback log with the reason.

## When To Use Heavier QC

Use deeper checks for:

- Coding tasks with tests or build steps.
- Release, deployment, or data migration tasks.
- Security, legal, financial, or irreversible actions.
- User-requested reviews or audits.

Keep ordinary tasks lightweight.

## Coding Principles (coding/config/skill tasks only)

When the task involves code, prompts, skills, templates, or agent configuration, scan these principles during Verify. **For all other task types, skip this section entirely.** They are design rules, not a separate checklist.

**Think Before Coding**: Assumptions are explicit. Unclear requirements were asked, not guessed. Tradeoffs that change the result were stated.

**Simplicity First**: No unrequested features. No unnecessary abstraction. The solution is the smallest reliable fix.

**Surgical Changes**: Check whether changes exceed Decide scope → enforced by Act step's Lock scope constraint.

**Goal-Driven**: → covered by Verify step's success-standard check, not repeated here.

For skill packages specifically: frontmatter uses supported fields, referenced files exist, trigger description avoids accidental activation, README records version changes. When backing up or snapshotting a skill package before editing it, write the copy OUTSIDE the skills scan root (e.g. `~/.claude/skills-backup/`, never `~/.claude/skills/<name>.bak`) — a copy left inside that root is registered as a second, independently auto-triggerable skill.

## Reference

Read `references/ooda-full.md` when the user asks for the full source framework, v2.0 comparison, rationalization table, or detailed phase checklists. Start with that file's navigation block, then search for the relevant heading instead of loading the whole reference into active reasoning.
