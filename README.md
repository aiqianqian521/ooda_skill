# OODA Skill

`ooda` is a Codex skill for running a mandatory OODA execution loop until the task is verified solved. It is designed for ambiguous work, iterative fixing, skill validation, code changes, reviews, and any task where the agent must clarify purpose, act, verify, and rerun without waiting to be reminded.

## Language Versions

- Default English version: `SKILL.md`.
- Chinese version: `SKILL.zh-CN.md`.
- The default runtime entry is English for GitHub and cross-agent reuse. User-facing responses should still follow the user's language unless requested otherwise.

## Current Behavior

- Clarifies the user's real purpose before acting.
- Writes OODA process records (purpose, per-round reports, summary) to `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` under the current project directory. Task deliverables go to project-appropriate locations, never into `work_ooda/`.
- Creates `00-purpose.md`, one file per round such as `01-round-1.md`, and `summary.md`.
- Rereads relevant files each round instead of relying on memory.
- Uses issue severity: `critical`, `major`, `minor`, `cosmetic`.
- Runs Delta checks from round 2 onward.
- Locks each round to the current Decide scope.
- Automatically starts the next round until the problem is verified solved.
- Asks the user instead of guessing when purpose, context, risk, or tradeoffs are unclear.
- Pauses after the same issue fails for two consecutive fix rounds.

## Version History

| Version | Date | Updates |
| --- | --- | --- |
| 3.4.0 | 2026-07-15 | Made English the default runtime language in `SKILL.md`, added `SKILL.zh-CN.md` as the Chinese version, updated the OpenAI agent prompt, and documented language-version policy. |
| 3.3.2 | 2026-07-15 | Added Verify and Close safeguards requiring both result correctness and execution-path correctness before verification can pass or a task can close. |
| 3.3.1 | 2026-07-15 | Clarified `work_ooda/` is only for OODA process records (thinking, execution, review), not task deliverables. Added guardrail and Close-step field to track where actual deliverables go. |
| 3.3.0 | 2026-07-14 | Changed output directory from skill-local `vs/` to current-project `work_ooda/{YYYYMMDD-HHMMSS}-{任务名}/` for unified project-level tracking with ljg/dbs/ooda. Also made detailed step-by-step output the only mode — every OODA step now prints its current logic to the user. |
| 3.2.0 | 2026-06-29 | Moved published OODA comparison and review records from repository-level `output/ooda/` into skill-local `vs/`, and updated the skill instructions, agent prompt, reference notes, and ignore rules to use `vs/{任务名}/`. |
| 3.1.0 | 2026-06-29 | Merged useful details from `ooda_skill`: loop scale selection, coding and skill-package checklist, more explicit rollback awareness, and this README changelog. Kept Codex-compatible frontmatter only. |
| 3.0.0 | 2026-06-29 | Rebuilt from a lightweight OODA thinking guide into a task execution engine: purpose-first workflow, mandatory output files, automatic reruns, Delta checks, severity classification, scope lock, pause rules, and verified closure. |
| 2.0.0 | 2026-04-20 | Earlier external package introduced coding-oriented guidance, examples, and checklist ideas that later informed the execution engine. |
| 1.0.0 | 2026-03-31 | Initial OODA framework concept. |

## Maintenance Notes

- Keep `SKILL.md` frontmatter minimal for Codex compatibility: `name` and `description`.
- Put detailed theory in `references/`, not in the active skill body unless it changes runtime behavior.
- Keep reusable comparison and review records under `work_ooda/` under the current project; keep temporary validation logs under `output/` ignored unless intentionally published.
- Keep `SKILL.md` as the default English runtime entry. Keep Chinese runtime guidance in `SKILL.zh-CN.md`.
- When behavior changes, append a row to the Version History table.
