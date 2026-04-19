# Spring Boot Notes

## 공부할 주제
- Project structure.
- Controller, Service, Repository 역할.
- DTO와 Entity 분리.
- Validation.
- Exception handling.
- JPA relationship.
- Transaction.
- API testing.

## Running Notes

## `@SpringBootTest`와 `@WebMvcTest`

### 배경
`CKAR-1` 프로젝트 기본 세팅에서 `HealthControllerTest`가 `@SpringBootTest`를 사용하고 있었다.

```java
@SpringBootTest
@AutoConfigureMockMvc
class HealthControllerTest {
    ...
}
```

이 방식은 테스트가 통과하긴 했지만, 단순한 `/api/health` controller 테스트에 비해 너무 넓은 범위를 실행한다. 특히 현재 `application.yml`은 local MySQL datasource를 바라보고 있기 때문에, 테스트 환경에 MySQL이 없으면 CI나 다른 개발자 환경에서 실패할 수 있다.

### `@SpringBootTest`
`@SpringBootTest`는 Spring Boot application context 전체를 로드하는 통합 테스트용 annotation이다.

특징:
- `@SpringBootApplication` 기준으로 전체 bean을 로딩한다.
- Controller, Service, Repository, JPA, DataSource 설정까지 함께 올라올 수 있다.
- 실제 애플리케이션 실행과 가까운 환경에서 검증할 수 있다.
- 대신 테스트가 무겁고 느릴 수 있다.
- 외부 설정이나 DB 상태에 영향을 받을 수 있다.

적합한 경우:
- 여러 계층이 함께 동작하는지 확인할 때.
- Service, Repository, DB, transaction까지 포함한 통합 흐름을 검증할 때.
- 애플리케이션이 실제 설정으로 정상 기동하는지 확인할 때.

예:
```java
@SpringBootTest
@AutoConfigureMockMvc
class ChatMessageIntegrationTest {
    // Controller -> Service -> Repository -> DB까지 확인
}
```

### `@WebMvcTest`
`@WebMvcTest`는 Spring MVC 계층만 잘라서 테스트하는 slice test annotation이다.

특징:
- Controller, MVC 설정, JSON 변환, validation 등 web layer 중심으로 로딩한다.
- Service, Repository, JPA, DataSource는 기본적으로 로딩하지 않는다.
- 필요한 의존성은 `@MockBean` 또는 `@MockitoBean`으로 대체한다.
- 테스트가 가볍고 빠르다.
- DB가 없어도 controller 요청/응답을 검증할 수 있다.

적합한 경우:
- Controller의 URL mapping, status code, response body를 확인할 때.
- Request validation, error response, JSON serialization을 확인할 때.
- DB나 비즈니스 로직보다 HTTP layer 동작이 관심사일 때.

예:
```java
@WebMvcTest(HealthController.class)
class HealthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void health_returns_ok() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }
}
```

### 왜 `HealthControllerTest`에는 `@WebMvcTest`가 더 적합한가
`HealthController`는 현재 Service, Repository, DB를 사용하지 않는다.

```java
@GetMapping("/health")
public Map<String, String> health() {
    return Map.of("status", "ok");
}
```

이 테스트의 관심사는 다음뿐이다.

- `GET /api/health` 요청이 200 OK를 반환하는가?
- JSON 응답에 `"status": "ok"`가 들어있는가?

따라서 전체 application context, JPA, MySQL datasource까지 로딩할 필요가 없다. `@SpringBootTest`를 사용하면 테스트 범위가 실제 관심사보다 넓어지고, local MySQL 설정에 의존할 수 있다.

이 경우 `@WebMvcTest(HealthController.class)`를 선택하면 테스트 범위가 controller layer로 제한된다. 그래서 더 빠르고, 더 명확하고, CI 환경에서도 DB 없이 안정적으로 실행할 수 있다.

### 선택 기준

| 상황 | 추천 |
|------|------|
| Controller request/response만 확인 | `@WebMvcTest` |
| Validation, status code, JSON 응답 확인 | `@WebMvcTest` |
| Controller-Service-Repository-DB 전체 흐름 확인 | `@SpringBootTest` |
| 실제 DB transaction, JPA mapping 확인 | `@SpringBootTest` 또는 `@DataJpaTest` |
| 애플리케이션 전체 기동 확인 | `@SpringBootTest` |

### CKArena 기준
CKArena에서는 테스트 범위를 의도적으로 나누는 방향으로 간다.

- Controller 단위 HTTP 테스트: `@WebMvcTest`
- JPA repository 테스트: `@DataJpaTest`
- API 전체 통합 테스트: `@SpringBootTest` + test profile 또는 Testcontainers
- 단순 health check: `@WebMvcTest`

이 기준은 Harness Engineering의 검증 원칙과도 맞다. AI가 만든 테스트가 통과하더라도, 테스트가 너무 넓거나 외부 환경에 의존하면 좋은 검증이라고 보기 어렵다. 테스트는 "무엇을 검증하는지"가 명확해야 한다.

### 면접 답변용 요약
`@SpringBootTest`는 Spring Boot 애플리케이션 컨텍스트 전체를 로딩하는 통합 테스트이고, `@WebMvcTest`는 MVC 계층만 로딩하는 slice test다.  
`HealthController`처럼 Service나 DB 의존성이 없는 단순 controller는 HTTP mapping과 JSON 응답만 확인하면 되므로 `@WebMvcTest`가 더 적합하다.  
이렇게 하면 테스트가 빨라지고, local MySQL 같은 외부 환경에 덜 의존하며, CI에서도 안정적으로 실행할 수 있다.

## 질문
- 채팅은 언제 WebSocket을 쓰고, 언제 REST polling으로 충분할까?
- 인증 전 익명 채팅 사용자는 어떻게 모델링하는 게 좋을까?
- Naver News API 데이터는 어느 시점에 캐싱해야 할까?
