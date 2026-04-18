# Backend Architecture

## 기술 스택
- Spring Boot
- Java
- Spring Web (REST API)
- Spring WebSocket + STOMP (실시간 채팅)
- Spring Data JPA
- Database: MySQL
- Spring Scheduler (`@Scheduled`): 뉴스 주기적 수집

## 추천 구조
```text
backend/
  src/main/java/.../ckarena/
    chat/
    synergy/
    news/
    user/
    common/
```

## 계층 구조
- Controller: HTTP/WebSocket 요청을 받는다.
- Service: 비즈니스 규칙을 담당한다.
- Repository: 데이터 저장과 조회를 담당한다.
- DTO: API 요청/응답과 Entity를 분리한다.
- Entity: 데이터베이스 테이블과 매핑된다.

## WebSocket 채팅 구조

Spring WebSocket + STOMP in-memory broker를 사용한다.

```text
backend/
  src/main/java/.../ckarena/
    chat/
      config/     WebSocketConfig.java (STOMP endpoint, broker 설정)
      controller/ ChatWebSocketController.java (@MessageMapping)
      service/    ChatService.java
      repository/ ChatMessageRepository.java
      dto/        ChatMessageRequest.java, ChatMessageResponse.java
      entity/     ChatMessage.java
```

- `WebSocketConfig`: `/ws` endpoint, `/topic` broadcast broker, `/app` application destination prefix 설정.
- `ChatWebSocketController`: `/app/chat/{roomId}/send` 수신 → DB 저장 → `/topic/chat/{roomId}` broadcast.
- 프론트엔드는 `@stomp/stompjs` 라이브러리로 연결한다.

## 뉴스 수집 전략

Spring `@Scheduled`로 주기적으로 Naver API를 호출해 LCK 관련 뉴스를 수집한다.

- 기본 주기: 1시간마다 수집 (`fixedDelay = 3600000`).
- `external_id` 기준으로 중복 저장 방지.
- 수동 트리거: `POST /api/admin/news/fetch` API로 즉시 실행 가능.

## 원칙
- 도메인 패키지를 작고 명확하게 유지한다.
- API 응답에 Entity를 직접 노출하지 않는다.
- 핵심 API는 간단한 통합 테스트를 작성한다.
- 여러 쓰기가 함께 성공해야 할 때 transaction을 사용한다.
- WebSocket 메시지 처리도 Service 계층을 거친다. Controller에 비즈니스 로직을 두지 않는다.
