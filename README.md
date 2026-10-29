# OODA Skill

`ooda` is a Codex skill for running a mandatory OODA execution loop until the task is verified solved. It is designed for ambiguous work, iterative fixing, skill validation, code changes, reviews, and any task where the agent must clarify purpose, act, verify, and rerun without waiting to be reminded.

The original mandatory user-confirmation checkpoints and 5W1H/U&Q sequence remain. Prefer `AskUserQuestion` popups when available; otherwise use numbered chat questions, wait for explicit user answers, and record the confirmation channel. Only after confirmation do micro, medium, and macro loops select standard or strict assurance according to risk. Strict mode includes a self-contained Strategic Challenge, real failure scenarios, three distinct verification layers, and final reframing without requiring any other skill. Independent swarm review runs only where permitted and useful.

Strategic Challenge uses **Three Perspectives, One Decision**: confirm the value criterion, trace evidence for the causal mechanism, try to falsify the plan with safe realistic cases, then make a documented decision. Pending tests never count as evidence of success.

Structural skill upgrades that change triggers, routing, confirmation, state/rollback contracts, cross-host installation, or interdependent runtime rules default to strict assurance **after** the existing confirmation checkpoints. Purely local wording changes and read-only inspections keep their lighter routes. Strict requires three different verification layers and a final reframe; static checks alone do not prove new-host behavior.

## Language Versions

- Default English version: `SKILL.md`.
- Chinese version: `SKILL.zh-CN.md`.
- Default English README (this file): `README.md`. Chinese README: [`README.zh-CN.md`](README.zh-CN.md).
- The default runtime entry is English for GitHub and cross-agent reuse. User-facing responses should still follow the user's language unless requested otherwise.

## Installation & Usage

OODA supports multiple AI Coding Agent environments. Installation is the same across environments: place the skill files into the corresponding `skills/` directory.

### Installation Paths by Environment

| Environment | Global Path | Project Path | Invocation |
|-------------|-------------|--------------|------------|
| **CodeFuse/BaiLian** | `~/.codefuse/engine/cc/skills/ooda/` | — | `/ooda` |
| **Claude Code** | `~/.claude/skills/ooda/` | `.claude/skills/ooda/` | `/ooda` |
| **Codex** | `~/.codex/skills/ooda/` | `.codex/skills/ooda/` | `/ooda` |
| **Kilo Code** | `~/.kilocode/skills/ooda/` | `.kilocode/skills/ooda/` | `/ooda` |

### Quick Install

**Windows (PowerShell):**
```powershell
.\install.ps1
```

**Mac / Linux / Git Bash:**
```bash
bash install.sh
```

The script auto-detects your environment and installed Agent, creating symlinks to the appropriate paths.

### Manual Install

```bash
# Example: global install for Claude Code
cp -r ./ooda-skill/* ~/.claude/skills/ooda/
# Windows users must ensure SKILL.md uses CRLF line endings
```

### Usage

In any Agent, type `/ooda` followed by your task:

```
/ooda Add user authentication module to the current project, considering security and performance
```

OODA will automatically:
1. Create 5 task nodes in the status bar to show progress — on loop routes only; trivial and analysis routes create no task list
2. Confirm understanding via **AskUserQuestion** popups when available; otherwise ask in chat and wait for explicit answers
3. Run multi-round verification loops — won't stop until the problem is solved
4. Record all process artifacts to the `work_ooda/` directory — loop routes only

### Notes

- **Windows**: Line endings alone do not prove discovery success or failure. Install and restart the host, then verify `/ooda` in a fresh session. If discovery fails, compare LF and CRLF copies on the same host/version with identical content; record host and results before attributing the failure to line endings. See [`tests/TEST-PLAN.zh-CN.md`](tests/TEST-PLAN.zh-CN.md).
- **CodeFuse**: The skill discovery path is `~/.codefuse/engine/cc/skills/`, which differs from standard Claude Code.
- **Status bar**: Supported in Claude Code / CodeFuse only; Codex falls back to text-based progress.
- **Restart** your Agent session after installation for the new skill to be recognized.

## Current Behavior

- Judges task complexity before starting: trivial tasks skip OODA entirely — unless the task writes to or executes against an irreversible target (production or live config, feature flags, credentials, data migration or deletion, release or deployment, money, permissions), in which case the tier is escalated by one and an explicit confirmation plus rollback path is required before acting. All four buckets are evaluated and the largest match wins; the chosen route is declared in the first line of output so a mis-route is visible and correctable.
- **Runs a mandatory Understand & Question phase** after purpose clarification and before the first round—lists every unknown, asks all questions in one batch, waits for all answers, summarizes understanding, and only proceeds after user confirmation.
- **5W1H Divergent Scan**: After Understanding Restatement and before forming U&Q questions, the agent systematically scans Who/What/Where/When/Why/How dimensions. Each dimension records known facts, fuzzy areas, and questions to explore—ensuring U&Q questions are the output of systematic scanning, not ad-hoc curiosity.
- **Data Reconciliation Diagnostic Mode**: When Observe detects a data mismatch (two values, records, or states that should agree but do not), the round switches from "fix the problem" to "find the divergence point." Traces full data lineage on both sides, locates the divergence point. If the root cause is outside observable scope, produces a structured Diagnostic Handoff Report instead of guessing at a fix.
- Clarifies the user's real purpose before acting.
- Writes OODA process records (purpose with Q&A, per-round reports, summary) to `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` under the current project directory. Task deliverables go to project-appropriate locations, never into `work_ooda/`.
- Creates `00-purpose.md`, one file per round such as `01-round-1.md`, a `state-R{N}.md` checkpoint per round (a new snapshot each round, never overwritten, for task continuity), and `summary.md`.
- Rereads relevant files each round instead of relying on memory.
- Uses issue severity: `critical`, `major`, `minor`, `cosmetic`.
- Runs Delta checks from round 2 onward.
- Locks each round to the current Decide scope.
- Fuses ADR recording into each round (problem context + options + pros/cons + decision rationale + consequences + links) so every decision is traceable.
- Carries real timestamps at each round file frontmatter and every command; the task directory uses a real HHMMSS timestamp, not 000000 placeholders. The time is obtained by an explicit command (`date '+%Y-%m-%dT%H:%M:%S%z'`, or `Get-Date -Format o` on PowerShell) whose raw output is recorded alongside every other command; where no shell is available the round declares `time_source: unavailable` and uses date-only values, since a declared limitation is not fabrication.
- Adds `restore_anchor` to `summary.md` plus section A (Task Self-Summary) to each `state-R{N}.md`, so after context compression a fresh agent recovers task/context/goal from summary + the latest state-R{N}.md + `00-purpose.md` without rereading every round.
- **Native status bar integration:** Creates 5 sequential tasks via `TaskCreate`/`TaskUpdate` showing the full OODA thinking chain (Understand -> Question -> Diagnose -> Decide -> Verify-Close) with per-round markers (R1/R2/...) in Claude Code's native status bar. Multi-round iteration runs automatically until verified solved.
- **Route gate comes first**: `Purpose First` is the first section of the file and is evaluated before any other instruction. The `Route:` line is declared before any task is created, so no route can be taken by accident. Only after a loop route is declared does the first action become creating task 1.
- **Four buckets, largest match wins**: trivial, analysis, micro, medium, macro. The tier is initialised by the buckets and finalised by the Loop Scale table; where they differ, the Loop Scale table is authoritative and the divergence is recorded on the route line.
- **Scale never escalates**: file count is not a trigger. A mechanical batch across any number of files stays trivial as long as it carries no design decision — but a batch touching more than 5 files must report the command run, the file count, and a spot-check of at least 3 modified files with paths.
- **Nothing is skipped silently**: short routes are allowed, but the route taken and the reason must be stated on the first line of output.
- **Reliability is user-judged**: the user confirms direction at U&Q, Decide, and Close checkpoints. The agent provides clear evidence; the user makes the final call.
- Automatically starts the next round until the problem is verified solved.
- Asks the user instead of guessing when purpose, context, risk, or tradeoffs are unclear.
- **Asks once when user stops with unresolved issues.** Records them only if user agrees.
- Pauses after the same issue fails for two consecutive fix rounds.

## Version History

| Version | Date | Updates |
| --- | --- | --- |
| 5.6.1 | 2026-10-29 | **README hygiene pass with no runtime rule changes.** Removed Chinese-only terms that had leaked into the English `README.md` across seven history rows (the status-bar task chain, the benchmark check label, the Observe source tags, the three-layer root-cause drill, the structural scan, the user-stop follow-up, and the `work_ooda/` directory name), so the English file now reads as English throughout. Corrected the 5.5.0 row, which claimed 40 scenarios when the backup tree for that release actually holds 38. Corrected the 5.6.0 row, which credited a refactoring that never happened: the scenario baseline in `tests/smoke-test.mjs` is still hard-coded by design, and only its value plus an explanatory comment changed. Brought the `Current Behavior` section up to date with the routing contract shipped in 5.5.0 and 5.6.0: the route gate is now the first section and is declared before any task exists, the buckets set the initial tier while the Loop Scale table is authoritative, file count never escalates, and batches over five files carry an evidence floor. Added two static assertions: one rejects any Chinese character in the English README, the other rejects any English word in the Chinese README's history table. |
| 5.6.0 | 2026-10-27 | Restored the mandatory trigger semantics: complex, ambiguous or multi-step tasks trigger again, and a short route must now be declared instead of skipped silently (`Nothing is skipped silently: declare the route taken and why on the first line`). Added the missing real-timestamp rule to the English completeness check so both languages carry the same five items in the same order. Gave large mechanical batches an evidence floor — a batch touching more than 5 files keeps the trivial route but must report the command run, the count of files changed, and a spot-check of at least 3 modified files with paths. Also in this release: removed the non-existent `scripts` directory from both install scripts, updated `agents/openai.yaml` to `Route first, then run OODA rounds`, advanced the deliberate baseline lock in `tests/smoke-test.mjs` from 38 to 40 and documented why the number is hard-coded, de-duplicated one assertion, and added two scenarios (38 -> 40). Behavioral verification is still pending on a fresh host session. |
| 5.5.0 | 2026-10-26 | Made the routing gate the first section of the file: Purpose First now runs before First Action, so a trivial or analysis route no longer creates a task list first. Removed the duplicate Trivial definition, added tier authority between the buckets and the Loop Scale table, made file count a non-trigger for escalation, narrowed the trigger description, isolated the historical archive in references/, added the missing Core Rule section to the Chinese file and four mid-zone regression scenarios (38 total). Behavioral verification is still pending on a fresh host session. |
| 5.4.2 | 2026-10-12 | Restored the truncated English trigger description, made structural skill upgrades default to strict assurance without affecting local edits, aligned Chinese process filenames with the default entry, synchronized docs and added regression scenarios and entry checks. Host behavior remains unverified without a fresh target session. |
| 5.4.1 | 2026-10-10 | Added cross-host test plan and dependency-free static smoke check; clarified that Windows CRLF/discovery requires an A/B reproduction rather than an unverified universal claim. Runtime OODA rules are unchanged. |
| 5.4.0 | 2026-10-10 | Make original confirmation checkpoints work without a popup tool: prefer popups, otherwise ask numbered questions in chat and wait for explicit answers before advancing. Preserve the U&Q question count, risk approvals and post-confirmation strict mode. Added partial-answer and chat-resume scenarios (31 total). |
| 5.3.2 | 2026-10-10 | Made Strategic Challenge executable through Three Perspectives, One Decision: confirmed value, evidenced causal chain, safe falsifiers, and a final decision after the failure scenarios run. Independent forward-testing found that a host without popups substituted plain text; require a pause rather than claiming a popup occurred. Added four scenarios (29 total) without changing the original pre-confirmation questions or requiring any other skill. |
| 5.3.1 | 2026-10-10 | Restored the original mandatory pre-confirmation popups, 5W1H and U&Q. Moved the assurance choice after user confirmation and replaced the external-skill reference with a self-contained Strategic Challenge designed without reading or copying internal third-party skills. Added an OODA-only scenario; 25 behavior scenarios total. |
| 5.3.0 | 2026-10-10 | Added standard/strict risk-based assurance to existing OODA routes, conditional adversarial review and real failure scenarios, three distinct verification layers, and final reframing. Removed compulsory repeat questions and the dialog-only dependency when the user already approved a clear plan. Synchronized both skill languages, READMEs, and 24 behavior scenarios. |
| 5.2.0 | 2026-09-18 | **Structural self-invalidation fixes: state read/write off-by-one, ungettable fields, unexecutable timestamp gate, discipline scope, irreversibility triage.** Fixed the state checkpoint off-by-one — Observe now reads the PREVIOUS round's `state-R{N-1}.md` while Act still writes `state-R{N}.md`, so the normal path no longer falls through to the "previous round did not complete" recovery branch every single round; added a state-gap marker when the highest existing index is not N−1; removed the write-side `(round 1: skip)` which had wrongly copied the read-side exemption. Deleted `context_hash` and `evidence_hash`: both demanded a sha1 with no computation path anywhere in the package, which forced the agent to invent a value and thereby violate the package's own no-fabricated-evidence gate; the frontmatter slot now carries `time_source` instead. Made the timestamp gate executable by naming the command (`date '+%Y-%m-%dT%H:%M:%S%z'`, PowerShell `Get-Date -Format o`) and adding a declared `time_source: unavailable` fallback — previously the gate banned both placeholders and guessed times without supplying any way to get a real one. Scoped the Execution Discipline gates to full-loop tasks so the Analysis/Verification Short Path and trivial tasks are no longer in violation by design, and added the three skip-step exemptions (short path, Decide merged into Act, Data Reconciliation Diagnostic Mode) so that scope is not cancelled out by the blanket no-skipping clause; defined "cannot Close" as close-as-`needs-human` without overriding an explicit user stop. Added an irreversibility check ahead of the four triage buckets (escalate one tier, pause for confirmation, state the rollback path; read-only inspection does not trigger it) and qualified the frontmatter's single-line-fix exclusion, so a one-line production-config flip can no longer route to trivial. Added "highest match wins" plus a mandatory `Route:` declaration. Fixed the placeholder check, which would otherwise have deadlocked every Close by rejecting the bracket forms the template itself mandates — now with an explicit exemption whitelist applied identically in both the Completeness check and the Verify checklist. Corrected the Orient/Act task numbering (Orient is task 3, Act is task 4) in three places, zero-padded round-file numbering for N≥10, and scoped the Minimal Output Contract's `work_ooda/` requirement to full-loop tasks. Chinese-side-only defects also fixed: the directory tree said state was overwritten each round while the body said never overwritten, and the placeholder check had already shipped the deadlocking `{...}` pattern. Added a warning that skill-package backups must be written outside the skills scan root, since a copy left inside it registers as a second auto-triggerable skill. Also qualified the frontmatter's batch-replacement exclusion so a "replace these across N files, you pick the value" request no longer bypasses the skill entirely — without this the aligned trivial definition was unreachable. Gave the `Route:` declaration a timing anchor that works for the trivial and analysis routes, which create no task list. **Distribution completeness:** restored the four files this distribution had lost — `install.sh`, `install.ps1`, `agents/openai.yaml`, `tests/behavior-scenarios.yaml` — so the install instructions and the tests README stop pointing at things that are not shipped. Rewrote `tests/behavior-scenarios.yaml` from the 3.8.0 edition to 18 scenarios: added the seven acceptance scenarios for the fixes above, the two that 5.1.0 claimed to have added (`state-per-round-no-overwrite`, `compression-recovery-anchor`), and one for the deleted hash fields; corrected `required_rules: Coding And Skill Package Checklist`, which named a rule that no longer exists; added a `rule_anchors` map so every `required_rules` value resolves to a real location, and a `verification_status` field that separates rule-text review from an actual behavior run. Fixed both install scripts, which deployed only `agents/`, `references/` and `tests/` and installed `SKILL.zh-CN.md` **as** `SKILL.md`: they now deploy `SKILL.md`, `SKILL.zh-CN.md` and both READMEs, print a line for anything missing instead of skipping silently, and install the English `SKILL.md` as the runtime entry, which is what this README has always claimed. Brought `agents/openai.yaml`'s default prompt up to date — it still described the 3.x record set, with no `state-R{N}.md` and no way to obtain a timestamp. Synced SKILL.md, SKILL.zh-CN.md, both READMEs, references/ooda-full.md, both tests READMEs, both install scripts, agents/openai.yaml, and tests/behavior-scenarios.yaml. |
| 5.1.0 | 2026-09-09 | **ADR process fused into per-round output + state per-round snapshots + real timestamps + compression-recovery anchor.** Merged ADR recording into every round (Observe adds problem_statement context; Orient adds decision drivers + options + pros/cons; Decide adds decision + rationale; Verify adds consequences; Iterate adds links). Renamed state.md to `state-R{N}.md`: a new snapshot each round, never overwritten (previous files stay on disk, diffable, anti-hallucination guard); template expanded 4 sections to A-F with Task Self-Summary, Context Snapshot, Decision Trail, and timestamped frontmatter. Real timestamps everywhere (round start/close, every command; 000000 placeholders banned). summary.md adds restore_anchor, target status table, and Final ADR decision card, so summary + latest state-R{N}.md section A + 00-purpose.md target_ids recover task/context/goal after context compression without rereading every round. Synced SKILL.md, SKILL.zh-CN.md, scripts/ooda-record.sh, references/ooda-full.md; added behavior scenarios state-per-round-no-overwrite and compression-recovery-anchor. Added a mandatory Execution Discipline section (hard gates: no state overwriting, no fake timestamps, ADR fields non-missing per round, recovery anchors present, no fabricated evidence; any violation blocks Close). |
| 5.0.0 | 2026-09-08 | **Final Full-Run verification round + Formal decision/document output.** Added mandatory final full-run verification before Close when the task spans multiple rounds/steps or has a whole-run channel: end-to-end re-run / full-chain check / standalone-deliverable check; a newly found issue returns to Iterate, never closes directly. Added formal decision/document output rule: any task that produces a report/record or makes an important decision must land a standalone, structured, validated deliverable (reusable template like the ADR family) at the project-appropriate location, not inside work_ooda/. Synced SKILL.md, SKILL.zh-CN.md, and added matching gates (final full-run, formal decision doc) to references/ooda-full.md QC-7 and Global QC.
| 4.2.0 | 2026-08-07 | **Task routing optimization: analysis exemption + trivial expansion + Decide merge.** P0: Added "Analysis / Verification" task type in Purpose First with simplified direct path (Observe→Analyze→Output), skipping full OODA loop, 5W1H scan, U&Q, and TaskCreate. P1: Expanded trivial definition from "single-line fix" to "≤5 files batch mechanical replacement with no design decisions". P2: Added Decide merge — when only one viable path exists, merge Decide into Act to save one TaskUpdate per round. Updated frontmatter description to exclude analysis checks and batch replacements from auto-trigger. Synced SKILL.md and SKILL.zh-CN.md. |
| 4.1.0 | 2026-08-03 | **State.md checkpoint + ooda-record.sh accelerator.** Added `state.md` as mandatory per-round checkpoint file for task continuity — enables a fresh agent instance to resume from `work_ooda/` alone without conversation context. Added `scripts/ooda-record.sh` as optional git accelerator: detects git availability, generates per-round diffs, checks scope creep, and writes state.md skeleton. Updated SKILL.md Observe step with hard gate to read state.md first, Act step with mandatory state.md write, and Verify step with completeness checks. Synced all 6 edit points across SKILL.zh-CN.md. Added scripts/ to install.sh/install.ps1 deployment. |
| 4.0.0 | 2026-07-31 | **5W1H Divergent Scan + Data Reconciliation Diagnostic Mode.** Added mandatory 5W1H scan between Understanding Restatement and U&Q: agent systematically explores Who/What/Where/When/Why/How dimensions before forming questions, ensuring U&Q questions are the output of systematic scanning, not ad-hoc curiosity. Added Data Reconciliation Diagnostic Mode: when Observe detects data mismatches, the round switches from fix-mode to find-the-divergence-point mode with full data lineage tracing on both sides. If root cause is outside observable scope, produces a structured Diagnostic Handoff Report instead of guessing. Added 5W1H + Diagnostic Handoff entries to Stop And Pause Rules. Fixed pre-existing task numbering inconsistencies in Per-Round Loop TaskUpdate references. |
| 3.8.0 | 2026-07-23 | **Benchmark check enhancement + English/Chinese architecture sync.** Expanded the Benchmark check from a single topic label to 4 mandatory sub-questions with "do NOT collapse" directive. Rewrote English `SKILL.md` to match Chinese `SKILL.zh-CN.md` architecture: 5-task system, AskUserQuestion mandatory at 3 checkpoints (Understanding Restatement, U&Q, Decide), TaskCreate native status bar, and aligned Detailed Output table with task operation column. Fixed task count headers from 6→5 in both language versions. |
| 3.7.0 | 2026-07-22 | **Native Task Status Bar + Multi-Environment Support.** Replaced text-based progress indicator with Claude Code native `TaskCreate`/`TaskUpdate` for real-time status bar display. Restructured from 3 tasks to 5 sequential tasks mirroring the OODA thinking chain: Understand -> Question -> Diagnose -> Decide -> Verify-Close. Added "First Action: initialize status-bar tasks" as a hard gate (like P9's entry judgment). Added CRLF line-ending support for Windows. Added `install.ps1` and `install.sh` supporting auto-detection of CodeFuse/Claude Code/Codex/Kilo Code environments. Fixed skill discovery path for CodeFuse platform (`~/.codefuse/engine/cc/skills/`). |
| 3.6.0 | 2026-07-22 | **Scenario correction + P0/P1/P2/P3 + Progress Indicator.** P0: Redefined "reliable" to user-judged, simplified Guardrails to 5 rules, added Understanding Restatement. P1: Plain-language inline definitions, tightened source tag with hard boundary + examples. P2: Coding Principles conditional, Capture lessons/Act/Coding dedup. P3: Added tags column to _index.md. Added compact progress indicator (◼/◻) showing P-U-Q pre-loop steps and O-R-D-A-V-I per-round steps. |
| 3.5.2 | 2026-07-21 | Replaced circular Loop Scale selection with two independent dimensions (Complexity × Irreversibility). Added inline definitions for Guardrails, Delta comparison, severity, Loop Scale, and Minimal Output Contract on first use. |
| 3.5.1 | 2026-07-21 | Added source tags to Observe ([direct observation]/[AI inference]/[AI conclusion]). Added immutability rule for round files. Added _index.md task index. Changed Orient root cause from one-sentence to a three-layer drill (surface/mechanism/principle). Added a structural scan to Observe (structure/contradiction/absence). Restricted Micro loop from comparison/validation tasks that benefit from manual inspection. |
| 3.5.0 | 2026-07-21 | Added mandatory Understand & Question phase between Purpose First and first round. Defined "reliable" precisely (Verify pass + Guardrails pass + user confirmed plan). Added task-worthiness pre-check to Purpose First. Added a user-stop follow-up question to the Stop Rules. Added Guardrails compliance evidence requirement to Verify self-check. |
| 3.4.1 | 2026-07-15 | Added reusable learning capture to Iterate so meaningful rounds record reusable learning, assets, and next-time shortcuts without forcing trivial tasks to create lessons. |
| 3.4.0 | 2026-07-15 | Made English the default runtime language in `SKILL.md`, added `SKILL.zh-CN.md` as the Chinese version, updated the OpenAI agent prompt, and documented language-version policy. |
| 3.3.2 | 2026-07-15 | Added Verify and Close safeguards requiring both result correctness and execution-path correctness before verification can pass or a task can close. |
| 3.3.1 | 2026-07-15 | Clarified `work_ooda/` is only for OODA process records (thinking, execution, review), not task deliverables. Added guardrail and Close-step field to track where actual deliverables go. |
| 3.3.0 | 2026-07-14 | Changed output directory from skill-local `vs/` to current-project `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` for unified project-level tracking with ljg/dbs/ooda. Also made detailed step-by-step output the only mode — every OODA step now prints its current logic to the user. |
| 3.2.0 | 2026-06-29 | Moved published OODA comparison and review records from repository-level `output/ooda/` into skill-local `vs/`, and updated the skill instructions, agent prompt, reference notes, and ignore rules to use `vs/{task-slug}/`. |
| 3.1.0 | 2026-06-29 | Merged useful details from `ooda_skill`: loop scale selection, coding and skill-package checklist, more explicit rollback awareness, and this README changelog. Kept Codex-compatible frontmatter only. |
| 3.0.0 | 2026-06-29 | Rebuilt from a lightweight OODA thinking guide into a task execution engine: purpose-first workflow, mandatory output files, automatic reruns, Delta checks, severity classification, scope lock, pause rules, and verified closure. |
| 2.0.0 | 2026-04-20 | Earlier external package introduced coding-oriented guidance, examples, and checklist ideas that later informed the execution engine. |
| 1.0.0 | 2026-03-31 | Initial OODA framework concept. |

## Maintenance Notes

- Keep `SKILL.md` frontmatter minimal for Codex compatibility: `name` and `description`.
- Put detailed theory in `references/`, not in the active skill body unless it changes runtime behavior.
- Keep reusable comparison and review records under `work_ooda/` under the current project; keep temporary validation logs under `output/` ignored unless intentionally published.
- Keep `SKILL.md` as the default English runtime entry. Keep Chinese runtime guidance in `SKILL.zh-CN.md`.
- When behavior changes, append a row to the Version History table. Packaging-only changes do not get a row.

## Related Projects

`ooda` is the execution-discipline layer of a five-repository agent-skill ecosystem. The orchestration engine below mounts it as a capability; the other three repositories are sibling skills that publish under the same output contract.

| Repository | What it is | Relation to `ooda` |
| --- | --- | --- |
| [aiqianqian521/sloth-loop](https://github.com/aiqianqian521/sloth-loop) | Zero-LLM task orchestration engine (the "body") | Drives OODA rounds and mounts this skill through the `skills/ooda` submodule |
| [aiqianqian521/architect-skills](https://github.com/aiqianqian521/architect-skills) | 19 architecture-review skills (agent, RAG, security, compliance, observability, cost, ...) | Sibling skill family; reports follow the shared output contract |
| [aiqianqian521/obsidian-skills](https://github.com/aiqianqian521/obsidian-skills) | 14 Obsidian knowledge-base skills | Sibling skill family; reports follow the shared output contract |
| [aiqianqian521/ai-skill-output-template](https://github.com/aiqianqian521/ai-skill-output-template) | Declarative output-template registry | Defines the report structure that every skill in this family emits |

> Each of those four repositories links back to this one, and the same table exists in the Chinese README (`README.zh-CN.md`).
