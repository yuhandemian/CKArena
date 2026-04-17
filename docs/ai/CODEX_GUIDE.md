# Codex Guide

## Best Uses
- Implement a Jira ticket.
- Add or update tests.
- Inspect repository structure.
- Refactor small areas.
- Update documentation connected to code changes.

## Prompt Pattern
```text
Ticket: CKA-123
Goal:
Acceptance Criteria:
Files or area to inspect:
Constraints:
Verification:
```

## Expectations
- Read the existing code before editing.
- Keep changes scoped to the ticket.
- Do not rewrite unrelated files.
- Run relevant tests when possible.
- Summarize changed files and verification.

## Study Output
After implementation, add notes to `docs/learning/AI_IMPLEMENTATION_REVIEW.md` when the task introduces a new concept.
