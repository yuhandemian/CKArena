import { MetricCard } from '../components/MetricCard';
import { SectionHeader } from '../components/SectionHeader';
import type { DashboardData } from '../types';

type OverviewPageProps = {
  data: DashboardData;
};

export function OverviewPage({ data }: OverviewPageProps) {
  const { githubStats, apiProgress } = data;
  const phasesDone = data.roadmap.filter((p) => p.status === '완료').length;
  const phasesTotal = data.roadmap.length;

  return (
    <section className="page-stack">
      <div className="hero-band">
        <div className="hero-copy">
          <span>docs 기반 자동 시각화</span>
          <h1>{data.overview.title}</h1>
          <p>{data.overview.tagline}</p>
          <strong>{data.overview.sourcePrinciple}</strong>
        </div>
      </div>

      <div className="metric-grid">
        {data.overview.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            tone={metric.tone}
          />
        ))}
      </div>

      <section className="content-band">
        <SectionHeader
          eyebrow="진행 현황"
          title="지금 어디까지 왔나"
          description="GitHub Issues 실제 상태와 구현된 API 수를 빌드 시점에 반영합니다."
        />
        <div className="progress-summary">
          <div className="progress-row">
            <span>Roadmap 단계</span>
            <span>{phasesDone} / {phasesTotal} 완료</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${(phasesDone / phasesTotal) * 100}%` }}
            />
          </div>

          <div className="progress-row" style={{ marginTop: '1rem' }}>
            <span>구현된 API</span>
            <span>{apiProgress.implemented} / {apiProgress.total}</span>
          </div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill progress-bar-cyan"
              style={{ width: apiProgress.total > 0 ? `${(apiProgress.implemented / apiProgress.total) * 100}%` : '0%' }}
            />
          </div>

          {githubStats.totalIssues > 0 && (
            <>
              <div className="progress-row" style={{ marginTop: '1rem' }}>
                <span>GitHub Issues</span>
                <span>{githubStats.closedIssues} / {githubStats.totalIssues} 완료</span>
              </div>
              <div className="progress-bar-wrap">
                <div
                  className="progress-bar-fill progress-bar-green"
                  style={{ width: `${(githubStats.closedIssues / githubStats.totalIssues) * 100}%` }}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="개발 접근법"
          title="AI와 함께 만드는 방식"
          description="AI를 어떤 기준으로 활용하고 검증했는지 설명합니다."
        />
        <blockquote>{data.overview.approachSummary}</blockquote>
      </section>
    </section>
  );
}
