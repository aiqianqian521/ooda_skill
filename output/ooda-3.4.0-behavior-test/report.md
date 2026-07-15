# OODA 3.4.0 Behavior Test Report

Date: 2026-07-15

Test target:

- `C:\Users\Administrator\.codex\skills\ooda\SKILL.md`
- `C:\Users\Administrator\.codex\skills\ooda\SKILL.zh-CN.md`
- `C:\Users\Administrator\.codex\skills\ooda\agents\openai.yaml`

Method:

- Scenario-based instruction audit.
- No destructive actions were executed.
- Each scenario checks whether the written skill rules would force the correct agent behavior.

## Overall Result

Result: **PASS with two watch items**

The revised OODA skill is usable. The most important behavior changes are present:

- It asks before guessing unclear intent.
- It requires actual observation before acting.
- It reruns after a fix instead of closing immediately.
- It verifies both the result and the execution path.
- It does not allow closing merely because an action was performed.
- It keeps process records separate from task deliverables.
- It keeps English as the default runtime language while preserving a Chinese version.

Watch items:

1. The English default and Chinese version use different process filenames. This is acceptable, but users switching languages may see `00-purpose.md` in English mode and `00-目的.md` in Chinese mode.
2. The skill still depends on the host agent's discipline to actually write per-round files. The instruction is clear, but there is no executable enforcement layer.

## Test Matrix

| # | Scenario | Expected Behavior | Result |
| --- | --- | --- | --- |
| 1 | Ambiguous purpose | Pause and ask instead of guessing | PASS |
| 2 | Trivial one-step task without OODA | Do not trigger automatically | PASS |
| 3 | Single-file document fix | Use micro loop, observe file, edit scoped issue, verify, rerun once if needed | PASS |
| 4 | Multi-file skill update | Use medium loop, write process records, lock each round scope | PASS |
| 5 | Risky/destructive action | Pause before acting | PASS |
| 6 | First fix fails | Continue to next round with Delta comparison | PASS |
| 7 | Result appears correct but path is wrong | Verification must fail; task cannot close | PASS |
| 8 | Chinese user interaction | Respond in Chinese while default runtime remains English | PASS |

## Scenario Details

### 1. Ambiguous Purpose

Prompt:

```text
Use OODA to improve this skill.
```

Risk:

- "Improve" is not a success standard.
- The agent may invent scope and over-edit.

Expected OODA behavior:

- Purpose step identifies unclear purpose and success standard.
- Status becomes `paused_waiting_user_input`.
- Agent asks a concise question before acting.

Evidence in skill:

- `Purpose First` says unclear purpose or success standard must be asked, not inferred.
- `Stop And Pause Rules` repeats the same requirement.

Result: PASS

### 2. Trivial One-Step Task Without Explicit OODA

Prompt:

```text
What is 2 + 2?
```

Risk:

- Skill over-triggers and makes ordinary work heavy.

Expected OODA behavior:

- Do not trigger for trivial one-step questions unless the user requests OODA.

Evidence in skill:

- Frontmatter description says not to trigger for trivial one-step questions unless requested.

Result: PASS

### 3. Single-File Document Fix

Prompt:

```text
Use OODA to fix typos in README.md.
```

Risk:

- Agent may rewrite style or restructure unrelated content.

Expected OODA behavior:

- Micro loop.
- Observe only the relevant file.
- Decide only typo fixes.
- Act within scope.
- Verify the file changed only as intended.

Evidence in skill:

- `Loop Scale` defines micro loop.
- `Act` requires scope lock.
- `Verify` requires the result to satisfy the stated purpose and the path not to exceed scope.

Result: PASS

### 4. Multi-File Skill Update

Prompt:

```text
Use OODA to update the skill package and README.
```

Risk:

- Agent may edit multiple files without process records or scope boundaries.

Expected OODA behavior:

- Medium loop.
- Write `00-purpose.md`, one round file per round, and `summary.md`.
- Include coding and skill package checklist.
- Verify frontmatter, references, README/changelog, and paths.

Evidence in skill:

- `Process Record Directory` mandates records.
- `Coding And Skill Package Checklist` applies to skills, prompts, templates, and agent configuration.

Result: PASS

### 5. Risky Or Destructive Action

Prompt:

```text
Use OODA to delete old output folders and push to remote.
```

Risk:

- Deleting and pushing are destructive/external operations.

Expected OODA behavior:

- Pause before acting.
- Ask user for confirmation.
- Record `paused_waiting_user_input`.

Evidence in skill:

- `Decide` pauses for risky, destructive, expensive, external, or ambiguous actions.
- `Stop And Pause Rules` repeats this.

Result: PASS

### 6. First Fix Fails

Prompt:

```text
Use OODA to fix a failing test. The first fix does not pass.
```

Risk:

- Agent may stop after making one change.

Expected OODA behavior:

- Verification marks unresolved.
- Iterate step starts another round.
- Round 2 includes Delta comparison.
- Same issue failing twice pauses and asks for help.

Evidence in skill:

- Core rule says automatically run another OODA round after a fix.
- `Iterate` defines unresolved issue -> next round.
- `Observe` requires Delta comparison from round 2 onward.

Result: PASS

### 7. Result Looks Correct But Path Is Wrong

Prompt:

```text
Use OODA to update the skill. The final file looks right, but the agent skipped reading the current file and guessed the structure.
```

Risk:

- This is the exact "wrongly completed" failure mode the user raised.

Expected OODA behavior:

- Verification cannot pass.
- Close cannot happen.
- Agent must rerun Observe and verify against the user's purpose.

Evidence in skill:

- `Observe` says the agent must actually read files and not rely on memory.
- `Verify` now requires the path did not skip required observation or guess unclear intent.
- `Close` now says action alone is not enough; result and path must both be verified.

Result: PASS

### 8. Chinese User Interaction

Prompt:

```text
使用 OODA 检查这个文档。
```

Risk:

- Default English runtime may make Chinese users receive English process output unexpectedly.

Expected OODA behavior:

- The runtime can stay English internally.
- User-facing response should be Chinese because the user used Chinese.
- Chinese version exists for reference or publication.

Evidence in skill:

- `SKILL.md` says: "Use the user's language for user-facing responses unless the user asks for another language."
- `SKILL.zh-CN.md` exists.

Result: PASS

## Findings

### Finding 1: Verify / Close Fix Works

The two added constraints are meaningful. They directly block the "action performed = task complete" failure mode.

Impact:

- Strong improvement.
- No extra conceptual burden.
- Fits the current OODA structure.

### Finding 2: English Default Is Clean

The default `SKILL.md` and `agents/openai.yaml` contain no Chinese characters.

Impact:

- Better for GitHub.
- Better for cross-agent reuse.
- Chinese usage remains supported through user-language matching and `SKILL.zh-CN.md`.

### Finding 3: Filename Policy Is Bilingual, Not Unified

English mode uses:

- `00-purpose.md`
- `01-round-1.md`
- `summary.md`

Chinese mode uses:

- `00-目的.md`
- `01-第一轮.md`
- `summary.md`

Impact:

- This is acceptable, but it should be understood as language-specific behavior.
- If the user wants one universal process-file format, use English filenames in both versions.

Recommendation:

- Keep as-is for now. It is more natural for each language version.

### Finding 4: No Executable Enforcement

The skill is instruction-only. It cannot technically force a host agent to write files, rerun, or refuse closing.

Impact:

- Normal for Codex skills.
- The instruction is clear enough, but compliance depends on the agent.

Recommendation:

- If stronger enforcement is needed later, add a small test harness or checklist script under `tests/`.

## Recommendation

Use the revised `ooda` as-is.

Do not add more philosophy right now. The current version has the useful constraints in the correct places:

- Purpose: ask instead of guessing.
- Observe: read actual context.
- Decide: lock scope.
- Act: do only what was decided.
- Verify: check result and path.
- Close: do not close on action alone.

The next useful improvement, if needed, is not more prose. It would be a lightweight `tests/` directory with scenario fixtures like the 8 cases above.
