import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { DashboardData } from '../types';

type RoadmapPageProps = {
  data: DashboardData;
};

export function RoadmapPage({ data }: RoadmapPageProps) {
  return (
    <section className="page-stack">
      <SectionHeader
        eyebrow="Roadmap"
        title="MVP 진행 흐름"
        description="ROADMAP.md와 MVP_SCOPE.md에서 추출한 단계별 진행 상황입니다."
      />

      <div className="timeline">
        {data.roadmap.map((phase) => (
          <article className="timeline-item" key={phase.title}>
            <div>
              <StatusBadge status={phase.status} />
              <h2>{phase.title}</h2>
            </div>
            <ul>
              {phase.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <section className="content-band">
        <SectionHeader
          eyebrow="MVP scope"
          title="처음부터 크게 만들지 않는 기준"
          description="MVP 문서의 주요 항목을 dashboard에서 바로 확인합니다."
        />
        <div className="pill-list">
          {data.mvpScope.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </section>
  );
}
