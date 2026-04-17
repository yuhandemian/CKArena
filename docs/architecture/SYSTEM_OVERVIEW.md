# System Overview

## 전체 구조
CKArena는 React 프론트엔드와 Spring Boot 백엔드를 사용한다. 프론트엔드는 REST API를 통해 백엔드와 통신하고, 채팅 기능은 WebSocket 또는 polling 방식 중 하나를 선택해 구현한다.

## 구성 요소
- React frontend: 모바일 중심 사용자 화면.
- Spring Boot backend: API 서버, 비즈니스 로직, 인증, 외부 API 연동.
- Database: 사용자, 채팅 메시지, 리뷰, 뉴스 메타데이터, 좋아요, 댓글 저장.
- External API: LCK 관련 뉴스 검색을 위한 Naver News API.
- Jira: Epic, Story, Task, Review 상태 관리.

## 기본 요청 흐름
1. 사용자가 모바일 웹 앱을 연다.
2. React가 필요한 데이터를 Spring Boot API에 요청한다.
3. Spring Boot가 데이터베이스에서 데이터를 읽거나 저장한다.
4. 뉴스 데이터는 Naver API를 통해 수동 또는 주기적으로 가져온다.
5. 채팅 메시지는 WebSocket 또는 짧은 주기의 polling으로 전달한다.

## 아키텍처 원칙
- 프론트엔드와 백엔드 책임을 명확히 나눈다.
- 큰 구현 전에 API와 데이터 흐름을 먼저 문서로 정리한다.
- 작은 Jira 티켓 단위로 구현하고 검증한다.
- AI가 구현한 기능은 학습 기록을 남긴다.
