# Dashboard Plan

## 목적
CKArena Dashboard는 `docs/`에 쌓인 기획, 아키텍처, AI 의사결정, 학습 기록을 시각화하는 정적 웹 문서다.

핵심 원칙:
- `docs/`는 source of truth다.
- `dashboard/`는 docs를 읽어 보여주는 시각화 결과물이다.
- GitHub Pages는 자동 배포 대상이다.

## 첫 MVP 범위
처음부터 모든 문서를 시각화하지 않고, 프로젝트 정체성을 가장 잘 보여주는 4개 화면부터 만든다.

1. Overview
2. Roadmap
3. Harness Engineering
4. AI Decision Timeline

## 자동화 흐름
```text
docs/*.md
  ↓
dashboard/scripts/generate-dashboard-data.mjs
  ↓
dashboard/src/data/generated/dashboard-data.json
  ↓
React Dashboard
  ↓
GitHub Pages
```

사람은 `docs/`를 수정하고, dashboard는 빌드 시점에 docs를 읽어 JSON을 재생성한다.

## 화면별 데이터 출처

## Overview
- `README.md`
- `docs/product/PRD.md`
- `docs/product/MVP_SCOPE.md`
- `docs/product/ROADMAP.md`

## Roadmap
- `docs/product/ROADMAP.md`
- `docs/product/MVP_SCOPE.md`
- `docs/jira/EPICS_AND_TASKS.md`

## Harness Engineering
- `docs/ai/HARNESS_ENGINEERING.md`
- `docs/ai/AI_WORKFLOW.md`
- `docs/ai/CLAUDE_CODE_GUIDE.md`
- `docs/ai/CODEX_GUIDE.md`

## AI Decision Timeline
- `docs/ai/AI_DECISION_LOG.md`

## GitHub Pages 배포
`main`에 `dashboard/**`, `docs/**`, `.github/workflows/dashboard-pages.yml` 변경이 push되면 GitHub Actions가 dashboard를 빌드하고 GitHub Pages에 배포한다.

## 면접 설명 문장
CKArena에서는 `docs/`를 프로젝트의 원본 지식 저장소로 두고, 이를 자동으로 읽어 `dashboard/`에서 시각화하도록 설계했습니다. 기획, 아키텍처, AI 의사결정, 학습 기록이 Markdown으로 쌓이면 GitHub Actions가 이를 JSON으로 변환하고, React 기반 Dashboard를 GitHub Pages에 배포하는 구조입니다. 이를 통해 단순히 개발 결과물만 보여주는 것이 아니라, AI를 어떤 기준으로 활용하고 검증했는지까지 시각화할 수 있게 했습니다.
