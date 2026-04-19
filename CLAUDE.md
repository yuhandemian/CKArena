# CLAUDE.md

CKArena 프로젝트에서 Claude Code가 따르는 운영 지침이다.
상세 내용은 각 링크 문서를 참조한다.

---

## 프로젝트 요약

LCK 팬 커뮤니티 웹 서비스. React(Vite) 프론트엔드 + Spring Boot 백엔드 구조.
실시간 채팅(WebSocket STOMP), 시너지 리뷰, 뉴스 기능을 순서대로 구현한다.
상세: `docs/product/MVP_SCOPE.md`, `docs/architecture/SYSTEM_OVERVIEW.md`

---

## Claude Code 역할

- **메인 구현**: Jira 이슈 단위로 브랜치를 만들고 코드를 작성한다.
- **설계 검토**: API 설계, 데이터 모델, 기술 선택의 tradeoff를 검토한다.
- **문서화**: 결정 근거는 `docs/ai/AI_DECISION_LOG.md`에 기록한다.
- **Harness 운영**: 상세 운영 기준 → `docs/ai/HARNESS_ENGINEERING.md`, `docs/ai/CLAUDE_CODE_GUIDE.md`

---

## `/advisor` 사용 기준

아래 상황에서는 구현 전 반드시 `/advisor`를 호출한다.

- 새 도메인 설계 시작 전
- 기술 선택이 애매할 때 (라이브러리, 패턴, DB 스키마)
- 복잡한 리팩토링 또는 큰 구조 변경 전
- 구현 완료 후 완결성 검토 시

---

## 작업 전 확인 문서

| 문서 | 목적 |
|------|------|
| `docs/architecture/API_DESIGN.md` | API 규격 확인 |
| `docs/architecture/DATABASE_SCHEMA.md` | 스키마 확인 |
| `docs/architecture/SYSTEM_OVERVIEW.md` | 전체 흐름 파악 |
| `docs/jira/EPICS_AND_TASKS.md` | 이슈 범위 확인 |
| `docs/ai/AI_DECISION_LOG.md` | 기존 결정 확인 |

---

## Jira / GitHub 규칙

- 브랜치: `feature/CKAR-X-short-description`
- 커밋: `CKAR-X 작업 내용 요약` (Jira 자동 연동)
- PR 제목: `CKAR-X 작업 내용 요약`
- PR body에 `Closes #이슈번호` 포함 → merge 시 이슈 자동 close
- 상세: `docs/jira/GITHUB_ISSUE_WORKFLOW.md`

---

## Codex와의 역할 분리

- **Claude Code**: 이슈 owner, 메인 구현 담당
- **Codex**: Claude Code 구현 완료 후 보조 검토/정합성 확인 역할
- 같은 이슈를 동시에 수정하지 않는다
- Codex 검토 요청은 PR comment에 "Codex review requested"로 명시
- 상세: `docs/ai/CODEX_GUIDE.md`

---

## 금지 사항

- `git push --force` 금지 (사용자 명시 허가 없이)
- `--no-verify` 금지
- 기능 추가 없이 주석, 리팩토링 PR 생성 금지 (이슈가 없을 경우)
- Entity를 API 응답에 직접 노출 금지 → DTO 필수
- 작업 전 `git pull` 생략 금지

---

## 완료 전 체크리스트

- [ ] `git pull`로 최신 main을 반영했는가
- [ ] 이슈 Acceptance Criteria를 모두 충족했는가
- [ ] DTO/Entity 분리가 지켜졌는가
- [ ] 불필요한 코드/주석이 남지 않았는가
- [ ] `AI_DECISION_LOG.md`에 기록이 필요한 결정이 있었는가
- [ ] PR body에 `Closes #이슈번호`가 포함됐는가
