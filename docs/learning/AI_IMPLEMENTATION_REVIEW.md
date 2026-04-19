# AI Implementation Review

## 목적
AI가 구현한 내용과 개발자가 이후에 공부한 내용을 기록한다.

## Template
```text
Date:
Ticket:
Feature:
AI tool:

What AI implemented:
- 

Technology involved:
- 

What I studied:
- 

What I understood:
- 

Remaining questions:
- 

Follow-up tasks:
- 
```

## Entries

## 2026-04-19: HealthController 테스트 범위 검토

Date: 2026-04-19  
Ticket: CKAR-1  
Feature: Backend project setup / health check API  
AI tool: Claude Code 구현, Codex 보조 검토

What AI implemented:
- Spring Boot backend 기본 구조.
- `/api/health` endpoint.
- `HealthControllerTest`에서 `@SpringBootTest`와 `MockMvc`를 사용한 health check 테스트.

Technology involved:
- Spring Boot test.
- `@SpringBootTest`.
- `@AutoConfigureMockMvc`.
- `@WebMvcTest`.
- MockMvc.
- MySQL datasource configuration.

What I studied:
- `@SpringBootTest`는 전체 application context를 로딩하는 통합 테스트에 적합하다.
- `@WebMvcTest`는 MVC 계층만 로딩하는 slice test라 controller request/response 검증에 적합하다.
- 단순 controller 테스트에 `@SpringBootTest`를 쓰면 JPA/DataSource 설정까지 함께 로딩될 수 있어 테스트 범위가 과하게 넓어진다.

What I understood:
- 테스트가 통과하는 것만으로 충분하지 않다.
- 테스트는 검증하려는 관심사만 정확히 다루는 것이 좋다.
- `/api/health`는 DB나 Service가 필요 없는 endpoint이므로 `@WebMvcTest(HealthController.class)`가 더 적합하다.
- CI나 다른 개발자 환경에서 MySQL이 준비되지 않아도 controller 테스트가 안정적으로 실행되도록 만드는 것이 좋다.

Remaining questions:
- 실제 DB까지 포함하는 API 통합 테스트는 test profile, H2, Testcontainers 중 어떤 방식으로 갈 것인가?
- CKArena에서는 MySQL 기준 동작을 확인해야 하므로, 핵심 통합 테스트에는 Testcontainers가 더 적합할 수 있다.

Follow-up tasks:
- `HealthControllerTest`를 `@WebMvcTest(HealthController.class)` 기반으로 변경한다.
- DB가 필요한 통합 테스트 전략을 `docs/learning/SPRING_BOOT_NOTES.md` 또는 architecture 문서에 추가로 정리한다.
