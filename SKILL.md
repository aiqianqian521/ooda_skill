---
name: ooda
description: Apply a mandatory OODA execution loop for fast but deliberate execution until the problem is verified solved. Trigger automatically when the user starts a complex, ambiguous, or multi-step task. Also trigger when the user explicitly asks for OODA, needs iterative problem solving, needs help choosing between options, or wants structured Observe-Orient-Decide-Act workflow with purpose clarification, per-round output files, automatic reruns, delta checks, problem severity, verification, and learning. Do NOT trigger for trivial one-step questions, simple fact lookups, or single-line fixes unless the user requests OODA.
---

# OODA

Use this skill to run a mandatory OODA execution loop: clarify the purpose, observe enough reality, orient around the real problem, decide explicitly, act within scope, verify both result and path, rerun when unresolved, learn when useful, and close only after the problem is verified solved.

This is the default English version. A Chinese version is available at `SKILL.zh-CN.md`.

Use the user's language for user-facing responses unless the user asks for another language.

## Core Rule

Optimize for reliable cycles over perfect planning or rushed execution.

**Reliable** means: the result satisfies the user's success standards, and the user confirmed the direction at each key checkpoint — U&Q understanding, Decide plan, and Close acceptance. Reliability is judged by the user, not by the agent's self-check. The agent's job is to provide clear evidence at each checkpoint so the user can make informed decisions.

## First Action: Status Bar Task Initialization

**The first action after skill activation: create task 1. Do not read files first, do not analyze first.**

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
| 1/5 Understand Problem | Once only | Immediately on activation | After Purpose is written |
| 2/5 Align & Ask | Once only | After task 1 completed | After U&Q answers received |
| 3/5 Diagnose & Orient — R{N} | Rebuilt each round | After task 2 completed (first round) / previous round ends (subsequent) | After Orient output |
| 4/5 Decide & Execute — R{N} | Rebuilt each round | After task 3 completed | After Act completes |
| 5/5 Verify & Close — R{N} | Rebuilt each round | After task 4 completed | After verify passes and Close |

**Every line is mandatory. No merging, no skipping, no batch creation. After one round ends, auto-enter next round until the problem is verified solved.**

### User Confirmation Must Use AskUserQuestion

The following three checkpoints **MUST** use `AskUserQuestion` to pop up a confirmation dialog. **Plain text alone is forbidden:**

| Checkpoint | Example Question |
|------------|-----------------|
| Understanding Restatement | "Does my understanding match?" → options: Confirm / Needs Adjustment |
| Deep-dive Questions | List 3-4 core questions, each with A/B/C choices |
| Decide plan | "Can this plan be executed?" → options: Confirm Execution / Switch Plan / Add Info |

`AskUserQuestion` supports up to 4 questions, each up to 4 options. If U&Q has more than 4 questions, split into two batches.

New round: create new "R{N}·Diagnose & Orient / Decide & Execute / Verify & Close" tasks (tasks 3-5), same flow as above.

**Trivial tasks** (single-line fix, one-word change) → no TaskCreate, execute directly.

## Purpose First

Before the first round, first judge whether this task needs OODA at all:

- **Trivial** (single-line fix, typo, one-word change) → execute directly without OODA. Tell the user you are skipping the loop and why.
- **Simple but verifiable** (single-file change, clear scope) → Micro loop.
- **Complex or ambiguous** (multi-file, unclear scope, user preference needed) → Medium loop or higher. Proceed with full Purpose First.

If the task passes the threshold, define:

- The user's actual purpose.
- The success standard for this task.
- Known constraints, risks, and required confirmations.

If any of these are unclear, ask the user instead of inferring. Record the status as `paused_waiting_user_input` and continue the same OODA task after the user answers.

If the task passed the threshold (non-trivial), proceed immediately to Understanding Restatement below, then to Understand & Question, before the first OODA round.

## Understanding Restatement

After Purpose First and before U&Q, restate your understanding to the user in your own words. **This catches directional guesses before they become assumptions.**

### Rules

1. **Restate in one paragraph.** Cover these four dimensions:
   - **What** to do (the core goal, in one sentence)
   - **Why** it matters (the context or problem behind the request)
   - **Where** the boundary is (what's in scope, what's explicitly out)
   - **How** to approach it (high-level strategy, not detailed steps)

2. **Surface your assumptions.** If any part of your understanding relies on inference rather than explicit user input, flag it: "I'm assuming [X] based on [Y]. Is that correct?"

3. **Confirm with AskUserQuestion.** Use `AskUserQuestion` to pop up a confirmation dialog with "Confirm" or "Needs Adjustment" options. **Plain text alone is forbidden.**

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

4. **Use AskUserQuestion to ask.** Present questions (mandatory validation + discovery) via `AskUserQuestion`. Give each question A/B/C options. Max 4 questions per batch; split into two batches if more. Each question must be:
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

Use this file layout:

```text
work_ooda/
├── _index.md          ← task index, one row appended per Close
├── {YYYYMMDD-HHMMSS}-{task-slug}/
│   ├── 00-purpose.md
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
- U&Q: questions asked, answers received, and confirmed understanding.
- Expected round count if known; write `unknown` when it cannot be estimated.

Each `0{N}-round-{N}.md` must include:

- Observe evidence.
- Orient diagnosis and severity.
- Decide plan.
- Act changes.
- Self-check.
- Whether the next round will run.

`summary.md` must include:

- Purpose recap.
- Total rounds and final status: `done`, `partial`, or `needs-human`.
- Per-round summary table.
- Success-standard acceptance checklist.
- Remaining issues requiring user decision.

Keep records concise. Do not store secrets, credentials, private tokens, or unnecessary user data in output files.

## Detailed Output Mode

Every OODA run must use detailed output mode. Show each step's current logic to the user in a structured way.

### Step Output Format

| Step | Output | Task Operation |
| --- | --- | --- |
| Purpose | `## Purpose Clarification` + user goal, success standards, constraints | After complete → task 1 `completed`; task 2 → `in_progress` |
| Understanding Restatement | `## Understanding Restatement` + what/why/boundary/how + assumptions surfaced + user response | After user confirms → task 2 `completed`; task 3 → `in_progress` |
| Understand & Question | `## Understand & Question` + context read, unknowns, questions, answers, confirmed understanding | After all U&Q answers → task 3 `completed`; task 4 → `in_progress` |
| Observe | `## Observe` + what is being observed, current state, key findings; add Delta comparison from round 2 onward | — |
| Orient | `## Orient` + root cause analysis and issue severity table | After Orient output → task 4 `completed`; task 5 → `in_progress` |
| Decide | `## Decide` + selected plan, reason, expected effect | — |
| Act | `## Act` + concrete operations, affected files, execution result, and errors if any | After Act completes → task 4/5 `completed`; task 5/5 → `in_progress` |
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
| Q | Understand & Question | Pre-loop, once |
| O | Observe | Every round |
| R | Orient | Every round |
| D | Decide | Every round |
| A | Act | Every round |
| V | Verify | Every round |
| I | Iterate (enter next round) | End of round (if more rounds) |
| C | Close | Final round (instead of I) |

**Display rules**:
- Tasks 1-2 (Understand Problem / Align & Ask) advance sequentially, set to completed when done
- Tasks 3-5 carry round markers (R1, R2...), retained after completion for clear progress visibility
- Entering a new round → create new 3/4/5 (R{N+1}), old round tasks stay completed
- Status bar shows: ◼ completed (green) / ● in_progress (yellow) / ◻ pending

## Loop Scale — in plain terms: how much effort this round costs. Bigger scale → more evidence, stricter verification.

Choose the loop scale by two independent factors:
- **Complexity**: what is the scope? Single-file → multi-file → cross-system.
- **Irreversibility**: how hard is it to undo? Reversible → needs confirmation → irreversible.

Higher complexity or higher irreversibility → larger scale.

| Scale | Complexity | Irreversibility | Use When | Typical Shape |
| --- | --- | --- | --- | --- |
| Micro loop | Single-file | Reversible | A narrow bug, document fix, or single-file change. Do NOT use Micro for comparison or validation where manual inspection may reveal structural issues — use Medium | Observe relevant artifact, one scoped decision, act, rerun once to verify. Tasks involving file comparison, structure reading, or manual logic tracing default to Medium |
| Medium loop | Multi-file | Needs confirmation | A feature, multi-file skill update, workflow design, or non-trivial content package | Split by dependency, handle selected issues per round, verify with tests or structured inspection |
| Macro loop | Cross-system | Irreversible | Architecture, migration, release, or high-risk strategy work | Ask success standards early, use visible checkpoints, pause before irreversible actions |

Do not make ordinary work slower just because a scale exists. The scale only determines how much evidence, planning, and verification the round needs.

## Minimal Output Contract — the bare-minimum info every completed task must end with

For completed work, end with:

- The concrete result.
- The verification performed.
- Whether the problem is solved.
- Process record directory: `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` (OODA meta files only, not task deliverables).
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

After all U&Q answers → `TaskUpdate` task 3 `completed`; task 4 → `in_progress`.

### Per-Round Loop

After Orient output → `TaskUpdate` task 4 `completed`; task 5 → `in_progress`.

After Act completes → `TaskUpdate` tasks 4/5 `completed`; task 5/5 → `in_progress`.

After verification passes:
- Next round → `TaskUpdate` task 5/5 `completed`; create new `3/5 Diagnose & Orient — R{N}` → `in_progress`, then 4/5, 5/5 in sequence
- Close → task 5/5 `completed`, enter Close

### 1. Observe

Capture the current state and focus on key information.

You must actually read the files or artifacts involved in the current round. Do not rely on memory.

Output:

```text
## Observe
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

### 3. Decide

Choose the next action.

Output:

```text
## Decide
- Selected plan: [what this round will do]
- Reason: [why this plan fits]
- Expected effect: [expected state after the change]
- Round scope: [only the issues decided here, prioritized critical -> major -> minor -> cosmetic]
```

Execute ordinary low-risk work directly. Pause and request confirmation for risky, destructive, expensive, external, or ambiguous actions.

No standalone TaskUpdate — Decide sits between Orient (task 4) and Act (task 5). When Orient outputs, task 4 is completed and task 5 is in_progress. If Decide requires user confirmation, task 5 stays in_progress waiting.

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

### 5. Verify

Check whether the action worked.

Output:

```text
## Verify
- Verification method: [test, file inspection, goal comparison, etc.]
- Verification result: [whether the issue is solved, with concrete evidence]
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
```

- Unresolved issue -> automatically run the next round and record `next_round: yes`. Create new "R{N}" tasks (3/5→4/5→5/5) when entering the new round.
- Blocked -> record `paused_waiting_user_input` and ask a concise question.
- Ineffective or worsening fix -> mark `[regression]`, perform the smallest safe rollback, and change approach.
- Same issue remains after two consecutive fix attempts -> pause and ask for help; record attempted plans, rollback state, and failure reason.

Reusable learning capture is required when a round produces a reusable pattern, checklist, command, test case, diagnostic method, decision rule, or other asset. Do not force learning capture for trivial work.

When useful, record:

- Reusable learning: what can be reused next time.
- Reusable asset: the test case, checklist, command, template, document, script, or decision rule produced or improved.
- Next-time shortcut: what this round makes faster or safer next time.

Only write durable lessons to memory when they have long-term value.

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

For skill packages specifically: frontmatter uses supported fields, referenced files exist, trigger description avoids accidental activation, README records version changes.

## Reference

Read `references/ooda-full.md` when the user asks for the full source framework, v2.0 comparison, rationalization table, or detailed phase checklists. Start with that file's navigation block, then search for the relevant heading instead of loading the whole reference into active reasoning.