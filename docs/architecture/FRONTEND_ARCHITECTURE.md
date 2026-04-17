# Frontend Architecture

## Stack
- React
- TypeScript
- Mobile-first responsive CSS
- API client layer for backend communication

## Suggested Structure
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

## Principles
- Build the actual product screen first, not a landing page.
- Keep feature code grouped by domain.
- Keep reusable UI in `shared/components`.
- Keep backend requests in a small API layer instead of scattering fetch calls.
- Optimize layout for mobile before desktop.

## First Screens
- Main chat room.
- Synergy review list.
- News list.
- Liked news page.
