# Frontend Architecture

## 기술 스택
- React
- TypeScript
- Mobile-first responsive CSS
- 백엔드 통신을 위한 API client layer

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

## 원칙
- 랜딩 페이지보다 실제 제품 화면을 먼저 만든다.
- 기능 코드는 도메인별로 묶는다.
- 재사용 UI는 `shared/components`에 둔다.
- `fetch` 호출을 여기저기 흩뿌리지 않고 API layer에 모은다.
- 데스크톱보다 모바일 레이아웃을 먼저 검증한다.

## 첫 화면 후보
- 메인 채팅방.
- 시너지 리뷰 목록.
- 뉴스 목록.
- 좋아요한 뉴스 페이지.
