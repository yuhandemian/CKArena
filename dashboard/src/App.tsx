import { useState } from 'react';
import data from './data/generated/dashboard-data.json';
import { AppShell } from './components/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { HarnessPage } from './pages/HarnessPage';
import { DecisionsPage } from './pages/DecisionsPage';

export type PageId = 'overview' | 'roadmap' | 'harness' | 'decisions';

const pages = {
  overview: <OverviewPage data={data} />,
  roadmap: <RoadmapPage data={data} />,
  harness: <HarnessPage data={data} />,
  decisions: <DecisionsPage data={data} />,
};

function App() {
  const [page, setPage] = useState<PageId>('overview');

  return (
    <AppShell activePage={page} onPageChange={setPage}>
      {pages[page]}
    </AppShell>
  );
}

export default App;
