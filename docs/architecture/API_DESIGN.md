# API Design

## 인증 전략 (MVP 1)

MVP 1에서는 회원가입/로그인 없이 채팅에 참여할 수 있도록 **닉네임 기반 세션 토큰** 방식을 사용한다.

1. 사용자가 닉네임을 입력하면 서버가 `users` 테이블에 `GUEST` 사용자를 생성한다.
2. 서버는 `guest_sessions`에 `user_id`와 `session_token`을 저장한 뒤 토큰을 발급한다.
3. 이후 모든 쓰기 요청은 `Authorization: Bearer <session_token>` 헤더를 포함한다.
4. MVP 4에서 `MEMBER` 사용자와 이메일/비밀번호 기반 정식 인증으로 확장한다.

```
POST /api/auth/guest
Body: { "nickname": "Faker팬123" }
Response: { "sessionToken": "...", "nickname": "Faker팬123" }
```

## System
- `GET /api/health` [구현됨]: 서버 상태 확인.

## 초안 Endpoints

## Auth
- `POST /api/auth/guest` [구현됨]: 닉네임으로 임시 세션 토큰 발급.
- `POST /api/auth/register` [예정]: 회원가입 (MVP 4).
- `POST /api/auth/login` [예정]: 로그인 (MVP 4).

## Chat
- `GET /api/chat/rooms` [예정]: 채팅방 목록 조회.
- `POST /api/chat/rooms` [예정]: 채팅방 생성 (관리자 또는 서버 자동 생성용).
- `GET /api/chat/rooms/{roomId}/messages` [예정]: 최근 메시지 조회 (페이지네이션).
- `POST /api/chat/rooms/{roomId}/messages` [예정]: 메시지 작성 (인증 필요).
- `GET /api/chat/daily-question` [예정]: 오늘의 질문 조회.
- **WebSocket** `ws://host/ws`: STOMP 연결 endpoint.
- **STOMP subscribe** `/topic/chat/{roomId}`: 실시간 채팅 메시지 구독.
- **STOMP send** `/app/chat/{roomId}/send`: 실시간 채팅 메시지 전송.

## Synergy Reviews
- `GET /api/players` [예정]: 선수 목록 조회.
- `GET /api/champions` [예정]: 챔피언 목록 조회.
- `GET /api/synergy-reviews` [예정]: 리뷰 목록 조회.
- `POST /api/synergy-reviews` [예정]: 리뷰 작성 (인증 필요, 동일 조합 중복 불가).
- `PUT /api/synergy-reviews/{reviewId}` [예정]: 리뷰 수정 (본인만 가능).
- `GET /api/synergy-reviews/players/{playerId}` [예정]: 선수별 리뷰 조회.
- `GET /api/synergy-reviews/champions/{championId}` [예정]: 챔피언별 리뷰 조회.

## News
- `GET /api/news` [예정]: LCK 뉴스 목록 조회.
- `POST /api/news/{newsId}/likes` [예정]: 뉴스 좋아요 (인증 필요).
- `DELETE /api/news/{newsId}/likes` [예정]: 뉴스 좋아요 취소 (인증 필요).
- `GET /api/news/liked` [예정]: 좋아요한 기사 목록 조회 (인증 필요).
- `GET /api/news/{newsId}/comments` [예정]: 댓글 목록 조회.
- `POST /api/news/{newsId}/comments` [예정]: 댓글 작성 (인증 필요).
- `POST /api/admin/news/fetch` [예정]: 뉴스 수동 수집 트리거 (관리자용).

## 에러 응답 형식

모든 에러 응답은 아래 형식을 따른다.

```json
{
  "code": "CHAT_ROOM_NOT_FOUND",
  "message": "채팅방을 찾을 수 없습니다.",
  "status": 404
}
```

주요 에러 코드:

| code | status | 설명 |
|------|--------|------|
| `UNAUTHORIZED` | 401 | 인증 토큰 없음 또는 만료 |
| `FORBIDDEN` | 403 | 권한 없음 (타인 리뷰 수정 등) |
| `CHAT_ROOM_NOT_FOUND` | 404 | 채팅방 없음 |
| `REVIEW_ALREADY_EXISTS` | 409 | 동일 선수-챔피언 조합 리뷰 중복 |
| `VALIDATION_ERROR` | 400 | 입력값 검증 실패 |
| `INTERNAL_SERVER_ERROR` | 500 | 서버 내부 오류 |

## Pagination 규칙

- 모든 목록 API는 `page`(0-based)와 `size` query parameter를 지원한다.
- 기본값: `page=0`, `size=20`.
- 응답 형식:

```json
{
  "content": [...],
  "page": 0,
  "size": 20,
  "totalElements": 135,
  "totalPages": 7,
  "last": false
}
```

## API 원칙
- 요청과 응답은 JSON을 기본으로 한다.
- 에러 응답은 위 형식으로 일관되게 유지한다.
- 목록 API는 처음부터 page/size pagination을 적용한다.
- 쓰기 API는 모두 인증 토큰을 요구한다.
- 채팅 실시간 연결은 REST가 아닌 WebSocket(STOMP)으로 처리한다.
