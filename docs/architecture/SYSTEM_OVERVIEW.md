# System Overview

## High-Level Architecture
CKArena will use a React frontend and a Spring Boot backend. The frontend communicates with backend REST APIs and, for chat, may use WebSocket or a polling fallback.

## Components
- React frontend: mobile-first user interface.
- Spring Boot backend: API server, business logic, authentication, and integrations.
- Database: stores users, chat messages, reviews, news metadata, likes, and comments.
- External API: Naver News API for LCK-related news.
- Jira: manages epics, stories, tasks, and review status.

## Initial Request Flow
1. User opens the mobile web app.
2. React requests required data from Spring Boot.
3. Spring Boot reads or writes data through the database.
4. News data is periodically or manually fetched from Naver API.
5. Chat messages are delivered through WebSocket or short polling.

## Architecture Principles
- Keep frontend and backend boundaries clear.
- Document API decisions before broad implementation.
- Prefer small tickets and verifiable changes.
- Every AI-assisted feature should leave a learning trail.
