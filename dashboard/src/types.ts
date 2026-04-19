export type DashboardData = {
  generatedAt: string;
  overview: {
    title: string;
    project: string;
    tagline: string;
    approachSummary: string;
    sourcePrinciple: string;
    metrics: Array<{
      label: string;
      value: string;
      tone: string;
    }>;
  };
  roadmap: Array<{
    title: string;
    epicKeys: string[];
    status: string;
    items: string[];
  }>;
  mvpScope: string[];
  decisions: Array<{
    date: string;
    title: string;
    summary: string;
    reason: string;
    followUp: string;
  }>;
  apiProgress: {
    total: number;
    implemented: number;
  };
  githubStats: {
    lastCommitAt: string | null;
    totalIssues: number;
    openIssues: number;
    closedIssues: number;
    epicGroups: Record<string, { total: number; closed: number }>;
  };
};
