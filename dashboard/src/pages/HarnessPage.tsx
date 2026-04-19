import { SectionHeader } from '../components/SectionHeader';
import type { DashboardData } from '../types';

type HarnessPageProps = {
  data: DashboardData;
};

const flow = ['User Goal', 'Context', 'AI Agent', 'Execution', 'Validation', 'Feedback'];

export function HarnessPage({ data }: HarnessPageProps) {
  return (
    <section className="page-stack">
      <SectionHeader
        eyebrow="Harness Engineering"
        title="AI를 검증 가능한 구조 안에서 사용하기"
        description={data.harness.principle}
      />

      <div className="flow-row">
        {flow.map((item) => (
          <div className="flow-step" key={item}>
            {item}
          </div>
        ))}
      </div>

      <div className="two-column">
        <section className="content-band">
          <SectionHeader
            eyebrow="Rules"
            title="AI에게 적용하는 작업 규칙"
            description="Claude Code와 Codex가 같은 제품 기준을 보도록 만드는 규칙입니다."
          />
          <ul className="check-list">
            {data.harness.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>

        <section className="content-band">
          <SectionHeader
            eyebrow="Validation"
            title="AI 결과물을 받아들이는 기준"
            description="AI가 만든 결과는 테스트, 문서, 코드 리뷰로 다시 확인합니다."
          />
          <ul className="check-list">
            {data.harness.validation.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="content-band">
        <SectionHeader
          eyebrow="Branch hygiene"
          title="AI 협업 중 PR diff를 깨끗하게 유지하기"
          description="Merge된 브랜치에 후속 커밋이 쌓이면 새 브랜치와 cherry-pick으로 정리합니다."
        />
        <ul className="check-list compact">
          {data.harness.branchRule.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
