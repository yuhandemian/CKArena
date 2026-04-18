# Jira Workflow

## Board Statuses
- Backlog
- Selected
- In Progress
- Code Review
- Done

## Ticket Types
- Epic: 큰 제품 영역.
- Story: 사용자 관점의 기능.
- Task: 구현 또는 문서화 작업.
- Bug: 잘못된 동작 수정.
- Spike: 구현 전 조사 작업.

## Done Definition
- Acceptance criteria를 만족한다.
- 관련 테스트 또는 수동 검증을 완료한다.
- 동작이나 아키텍처가 바뀌면 문서를 업데이트한다.
- 새로운 개념이 들어간 AI 구현이면 학습 노트를 남긴다.
- 코드를 commit하고 push한다.

## Branch Naming
```text
feature/CKAR-123-short-description
bugfix/CKAR-123-short-description
docs/CKAR-123-short-description
```

## GitHub 연동 규칙
- 브랜치 이름에는 Jira issue key를 포함한다.
  - 예: `feature/CKAR-3-live-chat`
- 커밋 메시지에는 Jira issue key를 포함한다.
  - 예: `CKAR-3 implement WebSocket chat`
- PR 제목에는 Jira issue key를 포함한다.
  - 예: `CKAR-3 implement live chat`
- Jira와 GitHub가 연결되어 있으므로 브랜치, 커밋, PR에 `CKAR-*` 키가 포함되면 Jira 티켓에 자동 연결된다.
- PR이 열리면 Jira 티켓에서 코드 변경과 리뷰 흐름을 확인하고, 필요하면 상태를 `Code Review`로 이동한다.
- 테스트용 PR은 목적이 끝나면 merge 또는 close하고, 실제 작업 PR은 관련 Jira 티켓의 Acceptance Criteria를 기준으로 검토한다.

## Commit Message
```text
CKAR-123 short imperative summary
```

예:
```text
CKAR-3 implement WebSocket chat
CKAR-1 align planning docs with Jira workflow
```

