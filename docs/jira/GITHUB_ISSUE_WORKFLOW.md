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
# .github/pull_request_template.md가 자동으로 body에 로드됨
# "Closes #이슈번호" 를 채우면 merge 시 이슈 자동 close
gh pr create --title "CKAR-X 작업 내용 요약"

# 4. PR merge → 이슈 자동 close (별도 작업 불필요)
```

## PR 템플릿 사용법

PR을 생성하면 `.github/pull_request_template.md`가 body에 자동으로 로드된다.
**`Closes #이슈번호`** 를 채워서 PR을 올리면 merge 시 해당 이슈가 자동으로 닫힌다.

```markdown
## Jira Epic
CKAR-3

## Summary
- WebSocket 채팅 Controller 구현
- STOMP 메시지 broadcast 연결

## Test plan
- [ ] /ws 엔드포인트 연결 확인
- [ ] 메시지 송수신 확인

## Closes
Closes #7
Closes #8
```

여러 이슈를 닫으려면 `Closes #` 줄을 여러 개 추가하면 된다.

## Merge된 브랜치에 후속 커밋이 생겼을 때

Claude Code와 Codex가 순차적으로 작업하다 보면 이미 merge된 feature branch에 후속 커밋이 추가될 수 있다.

예:
1. Claude Code가 `feature/CKAR-1-project-setup`에서 구현한다.
2. PR이 squash merge된다.
3. 같은 브랜치에 Codex가 보조 검토/학습 문서 커밋을 추가한다.
4. 이 브랜치로 다시 PR을 만들면 이미 merge된 기본 세팅 변경까지 diff에 다시 잡힐 수 있다.

이 경우 기존 브랜치로 PR을 만들지 않고, `origin/main` 기준 새 브랜치를 만든 뒤 필요한 후속 커밋만 cherry-pick한다.

### 확인 명령

```bash
git fetch origin
git log --oneline --graph --decorate --all -12
git diff --stat origin/main...HEAD
git log --oneline origin/main..HEAD
```

아래 상황이면 새 브랜치 + cherry-pick을 사용한다.

- 이전 PR이 이미 merge됐다.
- `git diff origin/main...HEAD`에 이미 merge된 변경까지 다시 보인다.
- 새 PR에 포함할 변경이 일부 후속 커밋뿐이다.

### 처리 절차

```bash
# 1. origin/main 기준 새 브랜치 생성
git checkout -b docs/CKAR-1-test-slice-learning origin/main

# 2. 필요한 후속 커밋만 cherry-pick
git cherry-pick <commit-sha>

# 여러 커밋이면 순서대로 적용
git cherry-pick <commit-sha-1> <commit-sha-2>

# 3. PR에 포함될 diff 확인
git diff --stat origin/main...HEAD

# 4. 필요한 검증 실행
./gradlew test
npm run build

# 5. push 후 PR 생성
git push -u origin docs/CKAR-1-test-slice-learning
gh pr create --base main --head docs/CKAR-1-test-slice-learning
```

### 주의 사항

- 이미 merge된 브랜치에 계속 후속 작업을 쌓지 않는다.
- 새 PR은 실제 필요한 변경만 포함해야 한다.
- `git reset --hard`, force push는 사용자 명시 허가 없이 사용하지 않는다.
- PR 제목과 커밋 메시지에는 Jira 연동을 위해 `CKAR-*` 키를 포함한다.

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
