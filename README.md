# OODA Skill

`ooda` is a Codex skill for running a mandatory OODA execution loop until the task is verified solved. It is designed for ambiguous work, iterative fixing, skill validation, code changes, reviews, and any task where the agent must clarify purpose, act, verify, and rerun without waiting to be reminded.

## Language Versions

- Default English version: `SKILL.md`.
- Chinese version: `SKILL.zh-CN.md`.
- The default runtime entry is English for GitHub and cross-agent reuse. User-facing responses should still follow the user's language unless requested otherwise.

## 安装与使用

OODA 支持多个 AI Coding Agent 环境，安装方式相同：将 skill 文件放到对应环境的 `skills/` 目录下。

### 各环境安装路径

| 环境 | 全局路径 | 项目路径 | 调用方式 |
|------|---------|---------|---------|
| **Claude Code** | `~/.claude/skills/ooda/` | `.claude/skills/ooda/` | `/ooda` |
| **Codex** | `~/.codex/skills/ooda/` | `.codex/skills/ooda/` | `/ooda` |
| **Kilo Code** | `~/.kilocode/skills/ooda/` | `.kilocode/skills/ooda/` | `/ooda` |

### 快速安装

**Windows (PowerShell):**
```powershell
.\install.ps1
```

**Mac / Linux / Git Bash:**
```bash
bash install.sh
```

脚本会自动检测当前环境和已安装的 Agent，创建链接到对应路径。

### 手动安装

```bash
# 以 Claude Code 全局安装为例
cp -r ./ooda-skill/* ~/.claude/skills/ooda/
# Windows 用户需要确保 SKILL.md 使用 CRLF 行尾符
```

### 使用

在任意 Agent 中输入 `/ooda` 加上你的任务：

```
/ooda 为当前项目添加用户认证模块，需要考虑安全性和性能
```

OODA 会自动：
1. 创建 5 个任务节点在状态栏显示进度
2. 通过 **AskUserQuestion** 弹框确认理解（不再卡在"等用户回复"）
3. 多轮循环验证，不解决问题不停止
4. 所有过程记录写入 `work_ooda/` 目录

### 注意事项

- **Windows**：`SKILL.md` 必须使用 **CRLF** 行尾符，否则 skill 无法被发现
- **CodeFuse**：skill 发现路径为 `~/.codefuse/engine/cc/skills/`，与标准 Claude Code 不同
- **状态栏**：仅在 Claude Code / CodeFuse 中支持，Codex 会降级为文本进度
- 安装后需**重启 Agent 会话**才能识别新 skill

## Current Behavior

- Judges task complexity before starting: trivial tasks skip OODA entirely.
- **Runs a mandatory Understand & Question phase** after purpose clarification and before the first round—lists every unknown, asks all questions in one batch, waits for all answers, summarizes understanding, and only proceeds after user confirmation.
- Clarifies the user's real purpose before acting.
- Writes OODA process records (purpose with Q&A, per-round reports, summary) to `work_ooda/{YYYYMMDD-HHMMSS}-{task-slug}/` under the current project directory. Task deliverables go to project-appropriate locations, never into `work_ooda/`.
- Creates `00-purpose.md`, one file per round such as `01-round-1.md`, and `summary.md`.
- Rereads relevant files each round instead of relying on memory.
- Uses issue severity: `critical`, `major`, `minor`, `cosmetic`.
- Runs Delta checks from round 2 onward.
- Locks each round to the current Decide scope.
- **Native status bar integration:** Creates 5 sequential tasks via `TaskCreate`/`TaskUpdate` showing the full OODA thinking chain (理解问题→对齐提问→诊断定向→决策执行→验证关闭) with per-round markers (R1/R2/...) in Claude Code's native status bar. Multi-round iteration runs automatically until verified solved.
- **Reliability is user-judged**: the user confirms direction at U&Q, Decide, and Close checkpoints. The agent provides clear evidence; the user makes the final call.
- Automatically starts the next round until the problem is verified solved.
- Asks the user instead of guessing when purpose, context, risk, or tradeoffs are unclear.
- **Asks once when user stops with unresolved issues.** Records them only if user agrees.
- Pauses after the same issue fails for two consecutive fix rounds.

## Version History

| Version | Date | Updates |
| --- | --- | --- |
| 3.8.0 | 2026-07-23 | **Benchmark check enhancement + English/Chinese architecture sync.** Expanded Benchmark check (对标校验) from a single topic label to 4 mandatory sub-questions with "do NOT collapse" directive. Rewrote English `SKILL.md` to match Chinese `SKILL.zh-CN.md` architecture: 5-task system, AskUserQuestion mandatory at 3 checkpoints (Understanding Restatement, U&Q, Decide), TaskCreate native status bar, and aligned Detailed Output table with task operation column. Fixed task count headers from 6→5 in both language versions. |
| 3.7.0 | 2026-07-22 | **Native Task Status Bar + Multi-Environment Support.** Replaced text-based progress indicator with Claude Code native `TaskCreate`/`TaskUpdate` for real-time status bar display. Restructured from 3 tasks to 5 sequential tasks mirroring OODA thinking chain: 理解问题→对齐提问→诊断定向→决策执行→验证关闭. Added "首要动作：状态栏任务初始化" as hard gate (like P9's entry judgment). Added CRLF line-ending support for Windows. Added `install.ps1` and `install.sh` supporting auto-detection of CodeFuse/Claude Code/Codex/Kilo Code environments. Fixed skill discovery path for CodeFuse platform (`~/.codefuse/engine/cc/skills/`). |
| 3.6.0 | 2026-07-22 | **Scenario correction + P0/P1/P2/P3 + Progress Indicator.** P0: Redefined "reliable" to user-judged, simplified Guardrails to 5 rules, added Understanding Restatement. P1: Plain-language inline definitions, tightened source tag with hard boundary + examples. P2: Coding Principles conditional, Capture lessons/Act/Coding dedup. P3: Added tags column to _index.md. Added compact progress indicator (◼/◻) showing P-U-Q pre-loop steps and O-R-D-A-V-I per-round steps. |
| 3.5.2 | 2026-07-21 | Replaced circular Loop Scale selection with two independent dimensions (Complexity × Irreversibility). Added inline definitions for Guardrails, Delta comparison, severity, Loop Scale, and Minimal Output Contract on first use. |
| 3.5.1 | 2026-07-21 | Added source tags to Observe ([直接观察]/[AI推断]/[AI结论]). Added immutability rule for round files. Added _index.md task index. Changed Orient root cause from one-sentence to three-layer drill (表象/机理/原理). Added structural scan to Observe (结构/矛盾/缺席). Restricted Micro loop from comparison/validation tasks that benefit from manual inspection. |
| 3.5.0 | 2026-07-21 | Added mandatory Understand & Question phase between Purpose First and first round. Defined "reliable" precisely (Verify pass + Guardrails pass + user confirmed plan). Added task-worthiness pre-check to Purpose First. Added user-stop追问 to Stop Rules. Added Guardrails compliance evidence requirement to Verify self-check. |
| 3.4.1 | 2026-07-15 | Added reusable learning capture to Iterate so meaningful rounds record reusable learning, assets, and next-time shortcuts without forcing trivial tasks to create lessons. |
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
