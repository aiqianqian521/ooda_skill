---
name: ooda
description: Apply a mandatory OODA execution loop for fast but deliberate execution until the problem is verified solved. Use when the user explicitly asks for OODA logic, asks to validate or structure work through OODA, needs iterative problem solving, needs help choosing between options, is starting a complex or ambiguous task, or wants an Observe-Orient-Decide-Act workflow with purpose clarification, per-round output files, automatic reruns, delta checks, problem severity, verification, and learning. Do not trigger for trivial one-step questions unless the user requests OODA.
---

# OODA

Use this skill to run a mandatory OODA execution loop: clarify the purpose, observe enough reality, orient around the real problem, decide explicitly, act within scope, verify both result and path, rerun when unresolved, learn when useful, and close only after the problem is verified solved.

This is the default English version. A Chinese version is available at `SKILL.zh-CN.md`.

Use the user's language for user-facing responses unless the user asks for another language.

## Core Rule

Optimize for reliable cycles over perfect planning or rushed execution. Keep each phase concise but substantive: show the key logic needed to prove the work is on the right path.

Every time OODA is triggered, output the current logic for every step. Explain what the step is doing, why it is doing it, and what key finding or decision came out of it. Use 1-3 sentences per step. Do not hide any phase.

Do not stop after one pass when a problem was found and fixed. Automatically run another OODA round to verify the fix. Continue rerunning until the problem is solved, the user tells you to stop, or you must pause for user input.

Never guess through unclear intent or missing information. If the purpose, success standard, key context, or risk tradeoff is unclear, pause and ask the user a concise question before acting.

## Purpose First

Before the first round, define:

- The user's actual purpose.
- The success standard for this task.
- Known constraints, risks, and required confirmations.

If any of these are unclear, ask the user instead of inferring. Record the status as `paused_waiting_user_input` and continue the same OODA task after the user answers.

## Process Record Directory

OODA process files are written to `work_ooda/`. This directory is the OODA workspace for thinking, execution notes, and review. It is **not the final output directory for the task deliverable**.

Create the directory under the **current working directory**, not under the skill installation directory:

```text
work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/
```

`YYYYMMDD-HHMMSS` is the local timestamp when the task starts. `{task-slug}` is extracted from the user's request.

Use this file layout:

```text
work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/
├── 00-purpose.md
├── 01-round-1.md
├── 02-round-2.md
├── ...
└── summary.md
```

Write one file per round immediately after that round. Do not keep all rounds only in one summary file.

Important: `work_ooda/` only stores OODA meta files: purpose clarification, per-round reports, and final summary. The actual task deliverable, such as code, docs, reports, or analysis artifacts, must be written to the project-appropriate location and **must not be placed in `work_ooda/`**.

`00-purpose.md` must include:

- User goal: what effect the user really wants, not just the task wording.
- Success standards: how completion will be judged.
- Constraints: time, scope, safety boundaries, and required confirmations.
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

| Step | Output |
| --- | --- |
| Purpose | `## Purpose Clarification` + user goal, success standards, constraints |
| Observe | `## Observe` + what is being observed, current state, key findings; add Delta comparison from round 2 onward |
| Orient | `## Orient` + one-sentence root cause and issue severity table |
| Decide | `## Decide` + selected plan, reason, expected effect |
| Act | `## Act` + concrete operations, affected files, execution result, and errors if any |
| Verify | `## Verify` + verification method, result, confidence, and regression status |
| Iterate/Close | `## Iterate / Close` + whether the next round will run and why, or the closure summary |

Write the process files at the same time and show the step summary to the user.

## Loop Scale

Choose the smallest loop scale that can reliably solve the task:

| Scale | Use When | Typical Shape |
| --- | --- | --- |
| Micro loop | A narrow bug, document fix, comparison, validation, or single-file change | Observe the relevant artifact, make one scoped decision, act, then rerun once to verify |
| Medium loop | A feature, multi-file skill update, workflow design, or non-trivial content package | Split by dependency, handle selected issues per round, verify with tests or structured inspection |
| Macro loop | Architecture, migration, release, or high-risk strategy work | Ask for success standards early, use visible checkpoints, and pause before irreversible actions |

Do not make ordinary work slower just because a scale exists. The scale only determines how much evidence, planning, and verification the round needs.

## Minimal Output Contract

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

When executing each step, output the current step's logic to the user.

- Say what is happening, what was found, why the decision was made, and what the execution result was.
- Use `## Step Name` as the heading, followed by 1-3 sentences of concrete logic.
- Do not output empty headings, vague "analyzing" filler, or long ritual text.
- Keep the output substantive: show the concrete object being observed, the concrete issue, and the concrete decision.

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

### 1. Observe

Capture the current state and focus on key information.

You must actually read the files or artifacts involved in the current round. Do not rely on memory.

Output:

```text
## Observe
- Current state: [describe the actual current state]
- Key findings: [facts, data, or issues observed]
```

From round 2 onward, add Delta comparison:

```text
- Delta comparison:
  Fixed items: X -> verified: Y, ineffective: Z
  Newly introduced issues: N
  Remaining issues: M
```

Only inspect relevant material: project notes, relevant files, recent changes, user constraints, and the real goal.

### 2. Orient

Form a quick but grounded judgment.

Output:

```text
## Orient
- Core issue: [one-sentence root cause]
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
- Lock scope: only fix what Decide selected. Do not mix in unrelated cleanup or refactors. Record new issues for the next round.
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
[ ] User question needed: yes | no
[ ] Next round needed: yes | no
```

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

- Unresolved issue -> automatically run the next round and record `next_round: yes`.
- Blocked -> record `paused_waiting_user_input` and ask a concise question.
- Ineffective or worsening fix -> mark `[regression]`, perform the smallest safe rollback, and change approach.
- Same issue remains after two consecutive fix attempts -> pause and ask for help; record attempted plans, rollback state, and failure reason.

Only write durable lessons to memory when they have long-term value.

### 7. Close

Close only after the problem is verified solved or the user explicitly stops.

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

Do not close a task merely because an action was performed. Close only when the result and the execution path are both verified against the user's purpose.

## Stop And Pause Rules

Continue OODA rounds until the problem is verified solved.

Only close when:

- The problem is solved and verification evidence is recorded.
- The user explicitly says to stop.
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

Use these constraints to prevent common agent failure modes:

| Risk | Response |
| --- | --- |
| Skipping observation | Inspect the minimum relevant context first |
| Acting without judgment | Define the core problem before execution |
| Assuming user approval | Ask before risky, destructive, expensive, external, or ambiguous actions |
| Guessing unclear purpose | Pause and ask the user |
| Vague reporting | Use concrete files, commands, counts, or test results |
| Losing reusable lessons | Write durable findings to memory when appropriate |
| Skipping step output | Always output each step's logic in detail |
| Stopping after a first fix | Run another round to verify the fix |
| Expanding scope during Act | Record new issues for the next round |
| Repeating ineffective fixes | Pause after two failed rounds and ask the user |
| Exceeding capability | Stop and ask the user for help |
| Putting deliverables in work_ooda/ | `work_ooda/` is only for OODA process records; task outputs go to project-appropriate locations |
| Optimizing areas without problems | Do not force optimization where no issue exists |

## When To Use Heavier QC

Use deeper checks for:

- Coding tasks with tests or build steps.
- Release, deployment, or data migration tasks.
- Security, legal, financial, or irreversible actions.
- User-requested reviews or audits.

Keep ordinary tasks lightweight.

## Coding And Skill Package Checklist

When the task changes code, prompts, skills, templates, or agent configuration, include this checklist in the relevant round file and show it to the user:

```text
Think Before Coding:
- [ ] Assumptions are explicit.
- [ ] Unclear requirements were asked, not guessed.
- [ ] Tradeoffs that change the result were stated.

Simplicity First:
- [ ] No unrequested features were added.
- [ ] No unnecessary abstraction was introduced.
- [ ] The selected solution is the smallest reliable fix.

Surgical Changes:
- [ ] Only current-round Decide scope was changed.
- [ ] Existing style and structure were preserved.
- [ ] No unrelated cleanup or refactor was mixed in.

Goal-Driven Execution:
- [ ] Each change maps to a success standard or issue.
- [ ] Verification evidence is recorded.
- [ ] Remaining risks or user decisions are listed.
```

For skill packages specifically, verify:

- `SKILL.md` frontmatter only uses fields supported by the target agent.
- Referenced files exist and paths are relative to the skill directory.
- The trigger description is specific enough to avoid accidental activation.
- The README or changelog records meaningful version changes when behavior changes.

## Reference

Read `references/ooda-full.md` when the user asks for the full source framework, v2.0 comparison, rationalization table, or detailed phase checklists. Start with that file's navigation block, then search for the relevant heading instead of loading the whole reference into active reasoning.
