# GitHub Issue Workflow

## 기본 구조

CKArena는 Jira와 GitHub Issues를 역할을 나눠 병행 사용한다.

| 도구 | 단위 | 예시 |
|------|------|------|
| Jira | Epic 단위 진행 상황 | `CKAR-1` Project Setup |
| GitHub Issues | 실제 구현 작업 단위 | `[CKAR-1] React 프로젝트 생성` |

이슈 제목에 `CKAR-X`를 포함하면 GitHub-Jira 연동으로 Jira Epic에 자동 연결된다.

## Issue 제목 규칙

```
[CKAR-X] 작업 설명
[BUG][CKAR-X] 버그 설명
[SPIKE][CKAR-X] 조사 설명
```

## 브랜치 → 커밋 → PR 흐름

```
# 1. 이슈 생성 후 브랜치 생성
git checkout -b feature/CKAR-X-short-description

# 2. 커밋 (이슈 번호 + Jira 키 모두 포함)
git commit -m "CKAR-X 작업 내용 요약"

# 3. PR 생성 (제목에 CKAR-X 포함)
gh pr create --title "CKAR-X 작업 내용 요약" ...

# 4. PR merge 후 브랜치 삭제, 이슈 close
gh issue close <issue-number>
```

## gh CLI로 이슈 생성하기

### 단일 이슈 생성
```bash
gh issue create \
  --title "[CKAR-1] React 프로젝트 생성" \
  --label "task" \
  --body "$(cat <<'EOF'
## Jira Epic
CKAR-1

## Goal
frontend/ 디렉토리에 React + TypeScript 프로젝트를 생성한다.

## Acceptance Criteria
- [ ] frontend/ 디렉토리에 React + TypeScript 프로젝트가 생성된다.
- [ ] FRONTEND_ARCHITECTURE.md의 폴더 구조가 반영된다.
- [ ] 로컬에서 dev 서버가 정상 실행된다.

## Verification
- [ ] npm run dev 실행 확인
EOF
)"
```

### 이슈 목록 조회
```bash
gh issue list
gh issue list --label task
gh issue list --state open
```

### 이슈 close
```bash
gh issue close <issue-number>
```

### PR에서 이슈 자동 close
PR body에 아래 키워드를 포함하면 PR merge 시 이슈가 자동으로 닫힌다.
```
Closes #<issue-number>
```

## Epic별 이슈 관리 규칙

- 하나의 Jira Epic 아래 GitHub Issues는 독립적으로 완료 가능한 단위로 나눈다.
- 이슈 하나 = 브랜치 하나 = PR 하나를 원칙으로 한다.
- 이슈가 너무 크다 싶으면 sub-issue로 분리한다.
- 완료된 이슈는 PR merge와 함께 close한다.

## Jira 상태 업데이트 기준

| 상황 | Jira 상태 |
|------|-----------|
| 해당 Epic의 첫 이슈 시작 | In Progress |
| 해당 Epic의 모든 이슈 close | Code Review → Done |
