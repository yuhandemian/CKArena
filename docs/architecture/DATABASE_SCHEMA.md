# Database Schema

## Draft Tables

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

## Notes
- The first implementation may allow anonymous or nickname-only chat before full authentication.
- Rating should be constrained from 1 to 5.
