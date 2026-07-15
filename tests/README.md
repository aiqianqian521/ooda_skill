# OODA Behavior Tests

This directory contains reusable behavior scenarios for validating the `ooda` skill.

These are instruction-level tests, not executable unit tests. They are designed to answer one question:

> Would the written skill rules force the agent to behave correctly in this scenario?

## Files

- `behavior-scenarios.yaml`: canonical scenario fixtures.

## How To Use

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
