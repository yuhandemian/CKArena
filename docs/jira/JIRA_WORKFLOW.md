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
feature/CKA-123-short-description
bugfix/CKA-456-short-description
docs/CKA-789-short-description
```
