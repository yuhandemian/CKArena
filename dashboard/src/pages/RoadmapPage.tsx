import { SectionHeader } from '../components/SectionHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { DashboardData } from '../types';

type RoadmapPageProps = {
  data: DashboardData;
};

function EpicProgress({
  epicKeys,
  epicGroups,
}: {
  epicKeys: string[];
  epicGroups: DashboardData['githubStats']['epicGroups'];
}) {
  const relevant = epicKeys.filter((k) => epicGroups[k]);
  if (relevant.length === 0) return null;

  return (
    <div className="epic-progress">
      {relevant.map((key) => {
        const g = epicGroups[key];
        const pct = g.total > 0 ? Math.round((g.closed / g.total) * 100) : 0;
        return (
          <div key={key} className="epic-row">
            <span className="epic-key">{key}</span>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill progress-bar-green" style={{ width: `${pct}%` }} />
            </div>
            <span className="epic-count">{g.closed}/{g.total}</span>
          </div>
        );
      })}
    </div>
  );
}

export function RoadmapPage({ data }: RoadmapPageProps) {
  return (
    <section className="page-stack">
      <SectionHeader
        eyebrow="Roadmap"
        title="MVP 진행 흐름"
        description="Roadmap 단계 상태는 GitHub Issues 실제 open/closed 수를 기준으로 자동 계산됩니다."
      />

      <div className="timeline">
        {data.roadmap.map((phase) => (
          <article className="timeline-item" key={phase.title}>
            <div>
              <StatusBadge status={phase.status} />
              <h2>{phase.title}</h2>
            </div>
            <EpicProgress
              epicKeys={phase.epicKeys}
              epicGroups={data.githubStats.epicGroups}
            />
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
          description="MVP 문서의 핵심 항목입니다."
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
