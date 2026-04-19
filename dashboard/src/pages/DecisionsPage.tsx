import { SectionHeader } from '../components/SectionHeader';
import type { DashboardData } from '../types';

type DecisionsPageProps = {
  data: DashboardData;
};

export function DecisionsPage({ data }: DecisionsPageProps) {
  return (
    <section className="page-stack">
      <SectionHeader
        eyebrow="Decision Timeline"
        title="AI와 함께 내린 결정의 기록"
        description="AI_DECISION_LOG.md를 타임라인으로 보여줍니다."
      />

      <div className="decision-list">
        {data.decisions.map((decision) => (
          <article className="decision-item" key={`${decision.date}-${decision.title}`}>
            <time>{decision.date}</time>
            <h2>{decision.title}</h2>
            <p>{decision.summary}</p>
            <dl>
              <div>
                <dt>Reason</dt>
                <dd>{decision.reason}</dd>
              </div>
              <div>
                <dt>Follow-up</dt>
                <dd>{decision.followUp}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
