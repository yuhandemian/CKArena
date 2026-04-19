import type { ReactNode } from 'react';
import type { PageId } from '../App';

const navItems: Array<{ id: PageId; label: string; detail: string }> = [
  { id: 'overview', label: 'Overview', detail: '프로젝트 요약' },
  { id: 'roadmap', label: 'Roadmap', detail: 'MVP 진행 흐름' },
  { id: 'decisions', label: 'Decisions', detail: '의사결정 기록' },
];

type AppShellProps = {
  activePage: PageId;
  onPageChange: (page: PageId) => void;
  children: ReactNode;
};

export function AppShell({ activePage, onPageChange, children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Dashboard navigation">
        <div className="brand">
          <span className="brand-mark">CK</span>
          <div>
            <strong>CKArena</strong>
            <span>Docs Dashboard</span>
          </div>
        </div>
        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activePage === item.id ? 'nav-item active' : 'nav-item'}
              type="button"
              onClick={() => onPageChange(item.id)}
            >
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </button>
          ))}
        </nav>
        <p className="sidebar-note">
          docs를 원본으로 읽고, dashboard는 자동 생성된 JSON으로 시각화합니다.
        </p>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
