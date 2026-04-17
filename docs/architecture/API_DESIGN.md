# API Design

## 초안 Endpoints

## Chat
- `GET /api/chat/rooms`: 채팅방 목록 조회.
- `GET /api/chat/rooms/{roomId}/messages`: 최근 메시지 조회.
- `POST /api/chat/rooms/{roomId}/messages`: 메시지 작성.
- `GET /api/chat/daily-question`: 오늘의 질문 조회.

## Synergy Reviews
- `GET /api/players`: 선수 목록 조회.
- `GET /api/champions`: 챔피언 목록 조회.
- `GET /api/synergy-reviews`: 리뷰 목록 조회.
- `POST /api/synergy-reviews`: 리뷰 작성.
- `GET /api/synergy-reviews/players/{playerId}`: 선수별 리뷰 조회.
- `GET /api/synergy-reviews/champions/{championId}`: 챔피언별 리뷰 조회.

## News
- `GET /api/news`: LCK 뉴스 목록 조회.
- `POST /api/news/{newsId}/likes`: 뉴스 좋아요.
- `DELETE /api/news/{newsId}/likes`: 뉴스 좋아요 취소.
- `GET /api/news/liked`: 좋아요한 기사 목록 조회.
- `GET /api/news/{newsId}/comments`: 댓글 목록 조회.
- `POST /api/news/{newsId}/comments`: 댓글 작성.

## API 원칙
- 요청과 응답은 JSON을 기본으로 한다.
- 에러 응답 형식을 일관되게 유지한다.
- 목록 API는 처음부터 pagination을 고려한다.
- 인증은 MVP 흐름이 보인 뒤 확장한다.
