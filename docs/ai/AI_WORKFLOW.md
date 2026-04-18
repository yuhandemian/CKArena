# AI Workflow

## 목적
이 프로젝트는 AI agent를 개발 파트너로 사용하지만, 최종 결정과 이해, 테스트, 품질 책임은 개발자가 가진다.

더 자세한 Harness Engineering 방식과 면접 답변용 정리는 [`HARNESS_ENGINEERING.md`](HARNESS_ENGINEERING.md)를 기준 문서로 사용한다.

## 기본 루프
1. Jira 티켓을 만들거나 선택한다.
2. Acceptance criteria를 명확히 한다.
3. AI agent에게 작고 구체적인 구현 또는 리뷰를 요청한다.
4. 테스트를 실행하고 결과를 직접 확인한다.
5. AI가 구현한 내용을 학습 기록으로 남긴다.
6. 명확한 메시지로 commit한다.

## Agent 역할
- Claude Code: 메인 구현, 설계 검토, 문서화, 코드 리뷰, `/advisor` 기반 핵심 판단 보강.
- Codex: 보조 구현, 테스트/문서 정합성 확인, 코드 검토, 작은 refactoring.

## 규칙
- 제품의 기준 문서는 하나로 유지하고, AI별로 서로 다른 제품 문서를 만들지 않는다.
- AI prompt는 Jira 티켓 단위로 작고 명확하게 작성한다.
- AI가 만든 기술은 이해하고 공부한 뒤 완료 처리한다.
- 중요한 결정은 `AI_DECISION_LOG.md`에 기록한다.
