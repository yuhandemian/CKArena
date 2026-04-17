# AI Workflow

## Purpose
This project uses AI agents as development partners while keeping the human developer responsible for decisions, understanding, testing, and final quality.

## Core Loop
1. Create or select a Jira ticket.
2. Clarify acceptance criteria.
3. Ask an AI agent to implement or review a focused task.
4. Run tests and inspect the result.
5. Document what the AI implemented.
6. Commit with a clear message.

## Agent Roles
- Codex: codebase work, implementation, tests, refactoring, and small documentation updates.
- Claude Code: planning, architecture review, broader reasoning, documentation drafts, and review.

## Rules
- Keep product truth in shared docs, not separate AI-specific copies.
- Keep AI prompts specific and ticket-sized.
- Study any AI-generated technology before treating it as finished.
- Record important decisions in `AI_DECISION_LOG.md`.
