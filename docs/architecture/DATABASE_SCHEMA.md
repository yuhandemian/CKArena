# Database Schema

## 초안 Tables

## users
- `id`
- `nickname`
- `email` (nullable, MEMBER 전환 시 사용)
- `password_hash` (nullable, MEMBER 전환 시 사용)
- `user_type` (`GUEST` 또는 `MEMBER`)
- `role` (`USER` 또는 `ADMIN`)
- `created_at`
- `updated_at`

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
- `external_id` (UNIQUE)
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
- UNIQUE constraint: `(news_article_id, user_id)` — 동일 기사 중복 좋아요 방지

## news_comments
- `id`
- `news_article_id`
- `user_id`
- `content`
- `created_at`

## guest_sessions

MVP 1에서 닉네임 기반 임시 세션 토큰을 저장한다. 게스트도 `users` 테이블에 `GUEST` 사용자로 저장하고, `guest_sessions`는 해당 사용자를 참조한다.

- `id`
- `user_id`
- `session_token` (UUID, UNIQUE)
- `created_at`
- `expires_at`

## 메모
- 첫 구현에서는 `users.user_type = GUEST`와 `guest_sessions`로 닉네임 기반 임시 인증을 처리한다.
- 정식 회원 인증(MVP 4) 도입 시 `users.user_type = MEMBER`를 사용하고, 게스트 사용자를 회원으로 승격하거나 연결하는 정책을 추가한다.
- 평점은 1점부터 5점까지로 제한하며, DB 레벨에서 CHECK constraint로 강제한다.
- `synergy_reviews`의 `(player_id, champion_id, user_id)` UNIQUE constraint는 반드시 DB 마이그레이션에 포함한다.
- `news_articles.external_id`와 `news_likes(news_article_id, user_id)` UNIQUE constraint는 반드시 DB 마이그레이션에 포함한다.
