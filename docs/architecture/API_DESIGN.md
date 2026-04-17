# API Design

## Draft Endpoints

## Chat
- `GET /api/chat/rooms`: list chat rooms.
- `GET /api/chat/rooms/{roomId}/messages`: list recent messages.
- `POST /api/chat/rooms/{roomId}/messages`: create a message.
- `GET /api/chat/daily-question`: get today's discussion question.

## Synergy Reviews
- `GET /api/players`: list players.
- `GET /api/champions`: list champions.
- `GET /api/synergy-reviews`: list reviews.
- `POST /api/synergy-reviews`: create a review.
- `GET /api/synergy-reviews/players/{playerId}`: list reviews by player.
- `GET /api/synergy-reviews/champions/{championId}`: list reviews by champion.

## News
- `GET /api/news`: list LCK news.
- `POST /api/news/{newsId}/likes`: like a news article.
- `DELETE /api/news/{newsId}/likes`: unlike a news article.
- `GET /api/news/liked`: list liked articles.
- `GET /api/news/{newsId}/comments`: list comments.
- `POST /api/news/{newsId}/comments`: create a comment.

## API Principles
- Use JSON request and response bodies.
- Use consistent error response shape.
- Keep pagination in list APIs from the beginning.
- Add authentication after MVP flow is visible.
