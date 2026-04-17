# Backend Architecture

## Stack
- Spring Boot
- Java
- Spring Web
- Spring Data JPA
- Database: PostgreSQL or MySQL
- Optional: Spring WebSocket for chat

## Suggested Structure
```text
backend/
  src/main/java/.../ckarena/
    chat/
    synergy/
    news/
    user/
    common/
```

## Layering
- Controller: receives HTTP/WebSocket requests.
- Service: owns business rules.
- Repository: persists and queries data.
- DTO: separates API payloads from entities.
- Entity: maps domain data to database tables.

## Principles
- Keep domain packages small and focused.
- Do not expose entities directly through APIs.
- Write simple integration tests for core APIs.
- Use transactions where multiple writes must succeed together.
