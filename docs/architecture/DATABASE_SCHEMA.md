# Database Schema

## 초안 Tables

## users
- `id`
- `nickname`
- `email`
- `password_hash`
- `created_at`

## chat_rooms
- `id`
- `title`
- `topic`
- `created_at`

## chat_messages
- `id`
- `room_id`
- `user_id`
- `nickname_snapshot`
- `content`
- `created_at`

## players
- `id`
- `name`
- `team`
- `position`

## champions
- `id`
- `name`

## synergy_reviews
- `id`
- `player_id`
- `champion_id`
- `user_id`
- `rating` (1~5 정수)
- `content`
- `created_at`
- `updated_at`
- UNIQUE constraint: `(player_id, champion_id, user_id)` — 동일 조합 리뷰 중복 방지

## news_articles
- `id`
- `external_id`
- `title`
- `url`
- `source`
- `published_at`
- `created_at`

## news_likes
- `id`
- `news_article_id`
- `user_id`
- `created_at`

## news_comments
- `id`
- `news_article_id`
- `user_id`
- `content`
- `created_at`

## guest_sessions

MVP 1에서 닉네임 기반 임시 세션 토큰을 저장한다. MVP 4 정식 인증 도입 후 제거한다.

- `id`
- `session_token` (UUID, UNIQUE)
- `nickname`
- `created_at`
- `expires_at`

## 메모
- 첫 구현에서는 `guest_sessions` 테이블로 닉네임 기반 임시 인증을 처리한다.
- 정식 회원 인증(MVP 4) 도입 시 `users` 테이블로 전환하고 `guest_sessions`는 제거한다.
- 평점은 1점부터 5점까지로 제한하며, DB 레벨에서 CHECK constraint로 강제한다.
- `synergy_reviews`의 `(player_id, champion_id, user_id)` UNIQUE constraint는 반드시 DB 마이그레이션에 포함한다.
