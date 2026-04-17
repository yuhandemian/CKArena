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
- `rating`
- `content`
- `created_at`

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

## 메모
- 첫 구현에서는 로그인 전까지 익명 또는 닉네임 기반 채팅을 허용할 수 있다.
- 평점은 1점부터 5점까지로 제한한다.
