# Codex Guide

## 주로 맡길 작업
- Claude Code가 구현한 변경사항의 보조 검토.
- 테스트 추가 또는 수정.
- repository 구조 파악과 정합성 확인.
- 작은 범위의 보조 구현 또는 refactoring.
- 코드 변경과 연결된 문서 업데이트.

## Prompt 패턴
```text
Ticket: CKAR-123
Goal:
Acceptance Criteria:
Files or area to inspect:
Constraints:
Verification:
```

## 기대사항
- 수정 전에 기존 코드를 먼저 읽는다.
- 변경 범위를 티켓 안으로 제한한다.
- 관련 없는 파일을 다시 쓰지 않는다.
- 가능한 경우 관련 테스트를 실행한다.
- Claude Code가 메인으로 구현한 결과를 검토할 때는 문서 불일치, 테스트 누락, 과한 설계, API/DB 계약 위반을 우선 확인한다.
- 변경 파일과 검증 결과를 요약한다.

## 학습 기록
새로운 개념이 들어간 구현이면 `docs/learning/AI_IMPLEMENTATION_REVIEW.md`에 학습 메모를 남긴다.
