import heroImage from '../assets/hero.png';
import { MetricCard } from '../components/MetricCard';
import { SectionHeader } from '../components/SectionHeader';
import type { DashboardData } from '../types';

type OverviewPageProps = {
  data: DashboardData;
};

export function OverviewPage({ data }: OverviewPageProps) {
  return (
    <section className="page-stack">
      <div className="hero-band">
        <div className="hero-copy">
          <span>docs 기반 자동 시각화</span>
          <h1>{data.overview.title}</h1>
          <p>{data.overview.tagline}</p>
          <strong>{data.overview.sourcePrinciple}</strong>
        </div>
        <img src={heroImage} alt="CKArena dashboard visual" />
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
          eyebrow="Interview narrative"
          title="면접에서 설명할 수 있는 구조"
          description="개발 결과물뿐 아니라 AI를 어떤 기준으로 활용하고 검증했는지 보여주는 대시보드입니다."
        />
        <blockquote>{data.overview.interviewSummary}</blockquote>
      </section>

      <section className="content-band">
        <SectionHeader
          eyebrow="Source documents"
          title="Dashboard가 읽는 문서"
          description="아래 문서들이 dashboard의 원본 데이터입니다."
        />
        <div className="doc-grid">
          {data.docsIndex.slice(0, 8).map((doc) => (
            <a className="doc-card" href={`../${doc.path}`} key={doc.path}>
              <strong>{doc.title}</strong>
              <span>{doc.path}</span>
            </a>
          ))}
        </div>
      </section>
    </section>
  );
}
