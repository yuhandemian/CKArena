# Frontend Architecture

## 기술 스택
- React
- TypeScript
- Mobile-first responsive CSS
- 백엔드 REST 통신을 위한 API client layer
- `@stomp/stompjs`: WebSocket 채팅 클라이언트

## 추천 구조
```text
frontend/
  src/
    app/
    pages/
    features/
      chat/
      synergy/
      news/
    shared/
      api/
      components/
      hooks/
      styles/
```

## WebSocket 채팅 클라이언트 구조

```text
features/chat/
  hooks/
    useChatSocket.ts   STOMP 연결/구독/전송 로직을 캡슐화한 커스텀 훅
  components/
    ChatRoom.tsx       useChatSocket을 사용하는 채팅 UI
```

- `useChatSocket`: 컴포넌트 mount 시 STOMP connect, unmount 시 disconnect.
- 채팅방 진입 전 REST API로 최근 메시지를 조회해 초기 렌더링.
- WebSocket으로 수신한 메시지를 로컬 state에 append.

## 원칙
- 랜딩 페이지보다 실제 제품 화면을 먼저 만든다.
- 기능 코드는 도메인별로 묶는다.
- 재사용 UI는 `shared/components`에 둔다.
- REST `fetch` 호출은 API layer에 모으고, WebSocket 로직은 feature 내부 훅에 캡슐화한다.
- 데스크톱보다 모바일 레이아웃을 먼저 검증한다.

## 첫 화면 후보
- 메인 채팅방.
- 시너지 리뷰 목록.
- 뉴스 목록.
- 좋아요한 뉴스 페이지.
