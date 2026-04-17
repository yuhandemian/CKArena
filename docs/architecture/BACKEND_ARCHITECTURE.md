# Backend Architecture

## 기술 스택
- Spring Boot
- Java
- Spring Web
- Spring Data JPA
- Database: PostgreSQL 또는 MySQL
- 선택 사항: 채팅용 Spring WebSocket

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

## 원칙
- 도메인 패키지를 작고 명확하게 유지한다.
- API 응답에 Entity를 직접 노출하지 않는다.
- 핵심 API는 간단한 통합 테스트를 작성한다.
- 여러 쓰기가 함께 성공해야 할 때 transaction을 사용한다.
