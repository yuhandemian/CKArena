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
- Decision: 채팅 실시간 연결 방식으로 polling이 아닌 WebSocket(STOMP over SockJS)을 사용한다.
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
- Decision: MVP 1~3은 닉네임 기반 게스트 세션 토큰 방식을 사용한다. MVP 4에서 이메일 기반 정식 인증으로 전환한다.
- Context: 초기 사용자 유입을 낮추기 위해 회원가입 없이 채팅 참여가 가능해야 한다.
- Reason: 게스트 세션은 `guest_sessions` 테이블 하나로 구현 가능하며, 정식 인증 전환 시 `users` 테이블로 대체하면 된다. 초기부터 JWT 인증을 구현하면 Auth 자체가 MVP 병목이 된다.
- Follow-up: MVP 4에서 Spring Security + JWT로 전환. `guest_sessions` 테이블 제거.
