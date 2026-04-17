# Claude Code Guide

## 주로 맡길 작업
- 제품 아이디어를 구현 계획으로 쪼개기.
- 아키텍처와 tradeoff 검토.
- 긴 문서 초안 작성.
- Codex가 만든 코드의 상위 레벨 리뷰.
- 낯선 기술 설명과 학습 방향 제안.

## Prompt 패턴
```text
Context:
Decision needed:
Current constraints:
Options considered:
Output format:
```

## 기대사항
- 혼자 개발하는 상황에 맞는 실용적인 흐름을 우선한다.
- MVP에 맞는 수준의 아키텍처를 제안한다.
- 위험 요소와 빠진 acceptance criteria를 짚는다.
- 넓은 아이디어를 Jira 티켓으로 바꿀 수 있게 돕는다.

## 리뷰 포인트
- 도메인 모델이 명확한가.
- API 일관성이 있는가.
- 과한 설계가 들어가지는 않았는가.
- 테스트나 학습 노트가 빠지지 않았는가.
