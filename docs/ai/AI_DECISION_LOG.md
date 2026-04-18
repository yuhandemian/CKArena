# AI Decision Log

## 목적
AI 도움을 받아 내린 중요한 기술/작업 방식 결정을 기록한다.

## Template
```text
Date:
Decision:
Context:
Options:
Chosen approach:
Reason:
Follow-up:
```

## Decisions

### 2026-04-18: 문서 구조
- Decision: 제품/아키텍처 문서는 공통으로 유지하고, Codex와 Claude Code는 각각 별도 guide 문서만 둔다.
- Reason: 제품 기준은 하나여야 하지만, AI 도구마다 맡기는 역할은 달라질 수 있기 때문이다.

### 2026-04-19: 채팅 실시간 방식 — WebSocket(STOMP) 선택
- Decision: 채팅 실시간 연결 방식으로 polling이 아닌 WebSocket(STOMP over native WebSocket)을 사용한다.
- Context: CKArena의 메인 채팅은 경기 중 실시간 팬 반응을 모으는 기능이다. 경기 당일에는 짧은 시간 동안 메시지가 집중적으로 발생한다.
- Options:
  - Short polling (30초): 구현 단순. 메시지 지연 최대 30초. 경기 중 팬 반응에는 체감이 느림. 동시 사용자 증가 시 서버에 불필요한 요청이 반복된다.
  - WebSocket (STOMP): 연결을 유지하며 서버가 메시지를 push. 지연 없음. Spring Boot가 `spring-websocket` 의존성 하나로 STOMP broker를 내장 지원한다. 프론트엔드는 `@stomp/stompjs`로 표준화된 방식으로 연결한다.
- Chosen approach: WebSocket(STOMP).
- Reason:
  1. 경기 중 채팅은 수초 단위 반응이 핵심이다. polling 30초는 사용자 경험을 해친다.
  2. Spring Boot의 `spring-boot-starter-websocket`이 in-memory STOMP broker를 내장 제공해 추가 인프라(Redis pub/sub 등) 없이 MVP 수준에서 구현 가능하다.
  3. STOMP 프로토콜은 Spring의 `@MessageMapping`, `convertAndSend` API와 자연스럽게 연결되어 코드 구조가 REST와 일관성 있게 유지된다.
  4. 향후 사용자 수가 늘면 in-memory broker를 RabbitMQ/Redis 기반 외부 broker로 교체하는 경로가 Spring 공식 문서에 정의되어 있다.
- Follow-up:
  - `WebSocketConfig.java`에서 `/ws` STOMP endpoint, `/topic` broadcast broker, `/app` application prefix 설정.
  - 프론트엔드 `useChatSocket.ts` 훅에서 연결/구독/해제 캡슐화.
  - MVP 수준에서는 in-memory broker 사용. 동시 접속자 급증 시 외부 broker 전환 검토.

### 2026-04-19: 채팅방 생성 방식
- Decision: 채팅방은 관리자 API(`POST /api/chat/rooms`)로만 생성한다. 사용자는 생성 불가.
- Context: CKArena는 LCK 경기 중심 채팅이다. 임의 채팅방이 생기면 분산되어 실시간 팬 반응이 희석된다.
- Reason: 경기당 방 하나를 운영자가 사전 생성해 집중도를 높이는 것이 MVP 단계에서 적합하다.
- Follow-up: 향후 경기 일정 API 연동 시 자동 생성으로 전환 고려.

### 2026-04-19: MVP 인증 전략
- Decision: MVP 1~3은 닉네임 기반 게스트 세션 토큰 방식을 사용한다. 단, 게스트도 `users` 테이블에 `GUEST` 사용자로 저장하고, 토큰은 `guest_sessions`가 `user_id`를 참조한다. MVP 4에서 `MEMBER` 사용자와 이메일 기반 정식 인증으로 확장한다.
- Context: 초기 사용자 유입을 낮추기 위해 회원가입 없이 채팅 참여가 가능해야 한다.
- Reason: 리뷰, 좋아요, 댓글도 작성자 식별이 필요하므로 MVP 1~3부터 모든 도메인이 동일하게 `user_id`를 참조하는 편이 단순하다. `guest_sessions`만으로 사용자를 표현하면 MVP 4 정식 인증 전환 시 데이터 마이그레이션이 복잡해진다. 초기부터 이메일/비밀번호 인증을 구현하면 Auth 자체가 MVP 병목이 된다.
- Follow-up: MVP 4에서 Spring Security + JWT로 전환. 기존 `GUEST` 사용자를 `MEMBER`로 승격하거나 새 `MEMBER` 사용자와 연결하는 정책을 결정한다.

### 2026-04-19: 데이터베이스 — MySQL 선택
- Decision: 데이터베이스로 MySQL을 사용한다.
- Options:
  - PostgreSQL: 표준 준수, JSONB 지원, 복잡한 쿼리에 강점. 기술적으로 더 뛰어나지만 이 프로젝트 규모에서 차이를 활용할 상황이 없다.
  - MySQL: 국내 Spring Boot 백엔드 포지션의 주류 스택. JPA + MySQL 레퍼런스가 압도적으로 많다.
- Chosen approach: MySQL.
- Reason: CKArena는 채팅/리뷰/뉴스 수준의 단순한 관계형 데이터를 다루므로 PostgreSQL 고급 기능이 필요 없다. 국내 취업 시장에서 Spring Boot + MySQL 조합이 표준이라 학습 레퍼런스와 면접 연결성이 높다.
- Follow-up: docker-compose.yml에 MySQL 8 컨테이너 사용. Spring Boot `application.yml`에 MySQL dialect 설정.

### 2026-04-19: AI agent 역할 조정
- Decision: Claude Code를 메인 구현/설계 검토 도구로 사용하고, Codex는 보조 구현과 정합성 검토 도구로 사용한다.
- Context: Claude Code는 `/advisor` 기능을 통해 작업 중 중요한 순간에 더 강한 모델의 조언을 받을 수 있다.
- Reason: 주요 구현과 설계 판단은 더 강한 검토 루프를 가진 Claude Code에 맡기고, Codex는 문서/테스트/코드 정합성을 확인하는 보조 검토자로 두는 편이 Harness Layer의 검증 구조와 잘 맞는다.
- Follow-up: `AI_WORKFLOW.md`, `HARNESS_ENGINEERING.md`, `CODEX_GUIDE.md`, `CLAUDE_CODE_GUIDE.md`의 역할 설명을 이 기준으로 유지한다.
