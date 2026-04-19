# Harness Engineering

## 목적
CKArena에서 AI를 활용하는 핵심 기준은 "AI가 만든 결과물을 그대로 믿지 않고, 검증 가능한 구조 안에서 받아들인다"는 것이다.

이 문서는 Claude Code와 Codex를 개발에 사용할 때 어떤 기준으로 Context를 제공하고, 어떤 규칙 안에서 실행시키며, 어떤 방식으로 결과물을 검증할지 정리한다. 면접에서 "AI를 학습이나 개발에 활용한 경험이 있다면, 어떤 기준으로 받아들이고 검증했는지 설명해주세요."라는 질문을 받았을 때 답변의 근거가 되는 문서이기도 하다.

## 기본 관점
AI는 정답 생성기가 아니라 빠르게 초안을 만들고 대안을 제안하는 개발 보조 도구로 사용한다.

CKArena에서는 AI가 자유롭게 코드를 만들게 두지 않고, 문서화된 Context, Jira 티켓, 프로젝트 규칙, 테스트, 수동 검증, 학습 기록으로 구성된 Harness Layer 안에서 작업하게 한다.

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

## CKArena의 Harness Layer

## 1. Context: AI가 참고할 기준 문서
AI가 임의로 판단하지 않도록 제품, 아키텍처, API, DB 기준을 문서로 먼저 고정한다.

- `docs/product/PRD.md`: 프로젝트 목적, 문제, 목표, 성공 기준.
- `docs/product/MVP_SCOPE.md`: MVP 단계별 포함 범위와 제외 범위.
- `docs/product/USER_STORIES.md`: 사용자 관점의 요구사항.
- `docs/product/ROADMAP.md`: 개발 단계와 우선순위.
- `docs/architecture/SYSTEM_OVERVIEW.md`: 전체 시스템 흐름.
- `docs/architecture/API_DESIGN.md`: API endpoint 초안과 원칙.
- `docs/architecture/DATABASE_SCHEMA.md`: 주요 table 초안.
- `docs/architecture/FRONTEND_ARCHITECTURE.md`: React 구조와 모바일 중심 원칙.
- `docs/architecture/BACKEND_ARCHITECTURE.md`: Spring Boot 계층 구조와 책임.

면접에서 설명할 때는 "AI에게 바로 구현을 요청하지 않고, 먼저 프로젝트의 기준 문서를 만든 뒤 그 문서를 Context로 제공했다"고 말할 수 있다.

## 2. Memory: 반복 작업을 개선하기 위한 기록
AI와 작업하면서 생긴 prompt, 결정, 학습 내용을 기록해 다음 작업의 품질을 높인다.

- `docs/ai/AI_DECISION_LOG.md`: 중요한 기술/작업 방식 결정 기록.
- `docs/ai/PROMPT_LOG.md`: 효과적이었던 prompt와 개선점 기록.
- `docs/ai/STUDY_NOTES.md`: 추가 학습이 필요한 개념 모음.
- `docs/learning/AI_IMPLEMENTATION_REVIEW.md`: AI가 구현한 내용과 내가 이해한 내용을 연결하는 리뷰.

이 Memory는 AI에게도 참고 Context가 되고, 개발자에게는 면접/회고/학습 자료가 된다.

## 3. Tools: AI가 다루는 실행 환경
AI는 실제 프로젝트 도구 위에서 작업하지만, 도구 사용 결과는 반드시 사람이 확인한다.

- React: 모바일 중심 UI 구현.
- Spring Boot: API, 비즈니스 로직, 인증, 외부 API 연동.
- DB: 사용자, 채팅, 리뷰, 뉴스, 좋아요, 댓글 데이터 저장.
- Naver News API: LCK 관련 뉴스 수집.
- Git: 변경 이력, commit, push.
- Jira: Epic, Story, Task, Code Review 상태 관리.

도구를 사용할 때는 "실행됐다"가 아니라 "기준에 맞게 동작하는지 검증됐다"를 완료 기준으로 삼는다.

## 4. Rules / Policies: AI에게 적용하는 작업 규칙
AI 도구마다 역할과 기대치를 분리해 사용한다.

- `docs/ai/CLAUDE_CODE_GUIDE.md`: Claude Code는 메인 구현, 설계 검토, 문서화, 핵심 판단에 주로 사용한다.
- `docs/ai/CODEX_GUIDE.md`: Codex는 보조 구현, 테스트/문서 정합성 확인, 코드 검토에 주로 사용한다.
- `docs/jira/JIRA_WORKFLOW.md`: Jira 티켓 상태와 Done Definition을 기준으로 작업 완료 여부를 판단한다.

중요한 규칙은 다음과 같다.

- 제품 기준 문서는 하나로 유지한다.
- 작업은 Jira 티켓 단위로 작게 나눈다.
- AI prompt에는 목표, Acceptance Criteria, 검증 방법을 포함한다.
- AI가 만든 코드는 기존 문서, 아키텍처 원칙, 테스트 결과와 대조한다.
- 새로운 기술이 들어가면 학습 노트를 남긴다.

## 5. Test / CI: 검증 기준
AI가 구현한 결과물은 여러 단계로 검증한다.

- Acceptance Criteria: Jira 티켓에서 정의한 조건을 만족하는지 확인한다.
- Backend test: Spring Boot API와 service logic을 테스트한다.
- Frontend test: React component, API client, 주요 UI 상태를 테스트한다.
- Manual API check: 필요하면 curl, Postman, browser devtools로 실제 요청/응답을 확인한다.
- Code Review: 구조, 책임 분리, 예외 처리, 중복, 테스트 누락 여부를 확인한다.
- Architecture Docs 대조: `API_DESIGN.md`, `DATABASE_SCHEMA.md`, architecture 문서와 맞는지 확인한다.
- GitHub Actions: 추후 CI로 자동 테스트와 정적 검사를 연결한다.

완료 기준은 "AI가 구현했다"가 아니라 "정의한 기준으로 검증했고, 내가 설명할 수 있다"이다.

## 작업 흐름
CKArena의 AI-assisted development는 다음 흐름을 따른다.

```text
[User Goal]
   |
   v
[Planning]
   |
   v
[Execution]
   |
   v
[Tool Usage]
   |
   v
[Validation]
   |
   v
[Feedback Loop]
```

프로젝트 구조에 맞게 더 구체화하면 다음과 같다.

```text
[User Goal / Jira Ticket]
        |
        v
[Context Layer]
- PRD
- MVP_SCOPE
- API_DESIGN
- DATABASE_SCHEMA
- JIRA_WORKFLOW

        |
        v
[AI Agent Usage]
- Claude Code: 메인 구현, 설계, 리뷰, 문서화, `/advisor` 활용
- Codex: 보조 구현, 테스트, 정합성 검토, 리팩토링

        |
        v
[Execution Layer]
- React
- Spring Boot
- DB
- Naver API
- Git

        |
        v
[Validation Layer]
- Acceptance Criteria
- Test
- Manual Check
- Code Review
- Architecture Docs 대조

        |
        v
[Feedback Loop]
- AI_IMPLEMENTATION_REVIEW
- STUDY_NOTES
- PROMPT_LOG
- AI_DECISION_LOG
- Jira 상태 업데이트
```

## Claude Code와 Codex 역할 분담

## Claude Code
Claude Code는 repository 안에서 주요 구현과 설계 판단을 진행하는 메인 개발 도구로 사용한다. 복잡한 설계 판단이나 중요한 구현 전환점에서는 `/advisor` 기능을 사용해 더 강한 모델의 조언을 참고한다.

- Jira 티켓 단위 주요 구현.
- API/DB/도메인 모델링 검토.
- 구현 전 tradeoff 정리.
- `/advisor`를 활용한 핵심 판단 보강.
- 문서와 코드 변경 동기화.
- Codex 보조 검토 결과 반영 여부 판단.

Claude Code에게 요청할 때는 다음 요소를 포함한다.

```text
Context:
Ticket:
Decision needed:
Current constraints:
Options considered:
Review focus:
Output format:
```

## Codex
Codex는 Claude Code가 메인으로 만든 구현을 보조하고, 테스트/문서/코드 정합성을 검토하는 도구로 사용한다.

- 기존 코드 구조 파악.
- 작은 범위의 보조 구현.
- 테스트 추가와 실행.
- 문서와 코드의 불일치 확인.
- API/DB 계약 위반 여부 검토.
- commit 전 변경사항과 검증 결과 요약.

Codex에게 요청할 때는 다음 요소를 포함한다.

```text
Ticket:
Goal:
Acceptance Criteria:
Context docs:
Files or area to inspect:
Constraints:
Verification:
```

## AI 결과물을 받아들이는 기준
AI가 만든 결과물은 다음 기준을 만족할 때만 반영한다.

1. Jira 티켓의 Acceptance Criteria를 만족한다.
2. 기존 문서의 제품 방향과 아키텍처 원칙을 벗어나지 않는다.
3. API endpoint, request/response, DB schema가 문서와 충돌하지 않는다.
4. 테스트 또는 수동 검증으로 실제 동작을 확인했다.
5. 코드 책임이 Controller, Service, Repository, DTO, Entity 등으로 적절히 나뉘어 있다.
6. React에서는 API 호출, loading/error 상태, 모바일 레이아웃이 확인됐다.
7. 내가 모르는 기술이 들어갔다면 학습 노트에 정리했고, 왜 필요한지 설명할 수 있다.
8. 변경사항이 Git commit으로 남고, 필요하면 Jira 상태가 업데이트된다.

## AI 협업 중 브랜치 정합성 규칙

Claude Code와 Codex가 같은 Jira Epic 안에서 순차적으로 작업하면, 이미 merge된 브랜치에 후속 커밋이 쌓이는 상황이 생길 수 있다. 특히 PR이 squash merge된 뒤 같은 feature branch에 Codex가 학습 문서나 보조 수정 커밋을 추가하면, 새 PR에서 이미 main에 반영된 변경까지 다시 diff에 잡힐 수 있다.

이 경우 기존 브랜치를 그대로 재사용하지 않는다. `origin/main` 기준으로 새 브랜치를 만들고, 실제로 새 PR에 포함할 후속 커밋만 cherry-pick한다.

판단 기준:
- 현재 브랜치의 이전 PR이 이미 merge됐다.
- `git diff origin/main...HEAD`에 이미 merge된 변경까지 다시 보인다.
- 새 PR에 포함하고 싶은 변경은 일부 후속 커밋뿐이다.
- Claude Code와 Codex가 같은 이슈를 순차적으로 작업해 브랜치 이력이 섞였다.

원칙:
- 새 PR은 `origin/main` 기준에서 실제 필요한 변경만 포함한다.
- 이미 merge된 브랜치에 후속 작업을 계속 쌓지 않는다.
- cherry-pick 전후로 `git diff --stat origin/main...HEAD`를 확인한다.
- 사용자 명시 허가 없이 `git reset --hard`, force push 같은 파괴적 명령을 사용하지 않는다.
- PR 제목과 커밋 메시지에는 `CKAR-*` 키를 포함한다.

이 규칙은 AI agent 협업에서 PR 단위를 작고 검증 가능하게 유지하기 위한 Harness Layer의 일부다.

## 예시: Spring Boot API 구현 검증
AI가 채팅 메시지 API를 구현했다면 다음 순서로 검증한다.

1. `API_DESIGN.md`에 정의한 endpoint와 일치하는지 확인한다.
2. Controller가 요청을 받고, Service가 비즈니스 로직을 처리하며, Repository가 DB 접근을 담당하는지 확인한다.
3. Entity를 API 응답에 직접 노출하지 않고 DTO를 사용하는지 확인한다.
4. validation과 error response가 빠지지 않았는지 확인한다.
5. 테스트 또는 manual API check로 메시지 생성/조회가 실제로 동작하는지 확인한다.
6. 구현 과정에서 새로 배운 개념을 `AI_IMPLEMENTATION_REVIEW.md`에 정리한다.

## 예시: React 화면 구현 검증
AI가 모바일 채팅 화면을 구현했다면 다음 순서로 검증한다.

1. 모바일 화면에서 첫 경험이 바로 제품 기능으로 이어지는지 확인한다.
2. API 호출이 공통 client layer나 feature 내부의 명확한 위치에 있는지 확인한다.
3. loading, error, empty state가 빠지지 않았는지 확인한다.
4. 입력창, 버튼, 채팅 목록이 모바일 viewport에서 깨지지 않는지 확인한다.
5. 백엔드 API와 연결했을 때 실제 데이터 흐름이 맞는지 확인한다.
6. 복잡한 상태 관리가 필요하면 왜 필요한지 학습 노트에 정리한다.

## 면접 답변용 요약
아래 답변은 면접에서 거의 그대로 사용할 수 있는 형태로 정리한 것이다.

```text
AI를 사용할 때 가장 중요하게 둔 기준은 결과물을 바로 신뢰하지 않고, 검증 가능한 작업 단위 안에서 사용한다는 것이었습니다.

개인 프로젝트인 CKArena에서는 이 방식을 Harness Engineering에 가깝게 적용했습니다. 먼저 PRD, MVP_SCOPE, API_DESIGN, DATABASE_SCHEMA 같은 문서를 만들어 AI가 참고할 Context를 고정했습니다. 그리고 Jira 티켓 단위로 작업을 쪼개 목표와 Acceptance Criteria를 명확히 한 뒤 Claude Code나 Codex에 요청했습니다.

Claude Code는 `/advisor` 기능까지 활용할 수 있어 주요 구현과 설계 판단에 사용했고, Codex는 보조 구현과 코드/문서 정합성 검토에 사용했습니다. AI가 만든 코드는 바로 반영하지 않고, 기존 문서와 맞는지, API 설계와 DB 설계에서 벗어나지 않는지, 테스트나 수동 검증을 통과하는지 확인했습니다. 또 제가 모르는 기술이 들어가면 AI_IMPLEMENTATION_REVIEW나 학습 노트에 정리해서 왜 그렇게 구현됐는지 다시 공부했습니다.

그래서 제 기준은 AI를 정답 생성기로 쓰는 것이 아니라, 문서, Jira, 테스트, 코드 리뷰, 학습 기록으로 구성된 Harness Layer 안에서 통제하고 검증하는 것이었습니다.
```

## 한 문장 요약
CKArena에서 AI는 코드를 대신 책임지는 도구가 아니라, 문서화된 Context와 검증 루프 안에서 개발 속도를 높이는 협업 도구다.
