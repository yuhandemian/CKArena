# CKArena

CKArena는 LCK 팬들이 모바일에서 경기 흐름에 맞춰 대화하고, 선수-챔피언 시너지를 평가하며, LCK 관련 뉴스 반응을 한곳에서 확인할 수 있는 팬 커뮤니티형 웹 서비스입니다.

## Tech Stack

- Frontend: React
- Backend: Spring Boot
- Data: DB, Naver News API
- Workflow: Git, Jira
- AI Tools: Codex, Claude Code

## AI-Assisted Development

이 프로젝트는 AI를 단순 코드 생성기로 사용하지 않고, 문서/규칙/도구/테스트/학습 기록으로 구성된 Harness Layer 안에서 검증하며 개발합니다.

```text
          [User]
            |
            v
        [Agent]
            |
            v
 ┌─────────────────────┐
 | Harness Layer       |
 | - Context (docs)    |
 | - Memory            |
 | - Tools (API, DB)   |
 | - Rules / Policies  |
 | - Test / CI         |
 └─────────────────────┘
            |
            v
        [Execution]
            |
            v
        [Feedback Loop]
```

CKArena에서 Harness Layer는 다음 기준으로 구성합니다.

- Context: `docs/product`, `docs/architecture`
- Memory: `AI_DECISION_LOG`, `PROMPT_LOG`, `STUDY_NOTES`
- Tools: React, Spring Boot, DB, Naver API, Git
- Rules / Policies: `CODEX_GUIDE`, `CLAUDE_CODE_GUIDE`, `JIRA_WORKFLOW`
- Test / CI: backend test, frontend test, manual API check, 추후 GitHub Actions
- Feedback Loop: `AI_IMPLEMENTATION_REVIEW`, Jira Code Review 상태

자세한 AI 활용 기준과 면접 답변용 정리는 [`docs/ai/HARNESS_ENGINEERING.md`](docs/ai/HARNESS_ENGINEERING.md)에 기록합니다.
