# OODA Behavior Tests

Chinese version: [`README.zh-CN.md`](README.zh-CN.md).

This directory contains reusable behavior scenarios for validating the `ooda` skill.

These are instruction-level tests, not executable unit tests. They are designed to answer one question:

> Would the written skill rules force the agent to behave correctly in this scenario?

## Files

- `behavior-scenarios.yaml`: canonical scenario fixtures — 40 scenarios, version-tagged, machine-readable. This is the authoritative scenario set; the Coverage list below is a human-readable index of it, not a substitute.
  - `rule_anchors` at the top of that file maps every `required_rules` value to where the rule actually lives. Every value used by a scenario must have an entry. This is the file's own cross-consistency check — the 3.8.0 edition pointed at a rule name (`Coding And Skill Package Checklist`) that no longer existed, which is exactly the defect class v5.2.0 was written to remove.
  - `verification_status` is `static` (rule text read, the named rule provably constrains the behavior), `behavior` (the prompt was actually issued to a fresh session and the observed behavior matched), or `pending-behavior` (static only; a real run is still owed). Do not promote a scenario to `behavior` from the same session that edited the rules — that is self-certification.

## How To Use

For an end-to-end cross-host procedure, evidence format, and acceptance gates, see [`TEST-PLAN.zh-CN.md`](TEST-PLAN.zh-CN.md). Run `node tests/smoke-test.mjs` from the skill root first. A static pass is NOT a fresh-session behavior pass; `expected_result: pass` means "agent follows the expected rule", including an expected refusal.

For each scenario:

1. Read the prompt and risk.
2. Compare the expected behavior with the current `SKILL.md`.
3. Mark the result as `pass`, `partial`, or `fail`.
4. If a scenario fails, update the skill rule that should have constrained the behavior.

## Coverage

The current scenarios cover:

- Ambiguous purpose handling.
- Non-triggering for trivial tasks.
- Micro-loop document fixes.
- Medium-loop skill updates.
- Risky/destructive action pauses.
- Failed first fix and automatic rerun.
- Path-correctness verification.
- Chinese user-facing interaction with English default runtime.
- state-R{N}.md per-round snapshots (never overwritten) and cross-round task continuity; ADR-per-round fusion; real timestamps; compression-recovery via summary.restore_anchor + state-R{N}.md section A.
- Preserved explicit pre-confirmation questions with popup preference and chat fallback, OODA-only Strategic Challenge, adaptive standard/strict routing, honest swarm fallback, real failure scenarios, and three distinct strict verification layers.
- Three Perspectives, One Decision: confirmed value, observable causal links, safe falsification, and a final decision that cannot treat pending tests as passes.
- Missing popup uses numbered chat questions; partial answers pause the loop, complete explicit answers resume it.
- Structural skill upgrades default to strict after confirmation; one-line trigger changes count as structural, while local wording changes remain light.
