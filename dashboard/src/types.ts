export type DashboardData = {
  generatedAt: string;
  overview: {
    title: string;
    project: string;
    tagline: string;
    interviewSummary: string;
    sourcePrinciple: string;
    metrics: Array<{
      label: string;
      value: string;
      tone: string;
    }>;
  };
  roadmap: Array<{
    title: string;
    status: string;
    items: string[];
  }>;
  mvpScope: string[];
  harness: {
    title: string;
    principle: string;
    rules: string[];
    validation: string[];
    branchRule: string[];
  };
  decisions: Array<{
    date: string;
    title: string;
    summary: string;
    reason: string;
    followUp: string;
  }>;
  apiStats: {
    restEndpoints: number;
    realtimeContracts: number;
  };
  docsIndex: Array<{
    path: string;
    title: string;
    summary: string;
    headings: string[];
  }>;
};
