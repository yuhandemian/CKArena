import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = path.resolve(process.cwd(), '..');
const docsDir = path.join(rootDir, 'docs');
const outputPath = path.join(process.cwd(), 'src/data/generated/dashboard-data.json');

// Derive repo owner/name from git remote so hardcoded slug never drifts
function getGitHubRepo() {
  try {
    const remote = execSync('git config --get remote.origin.url', { cwd: rootDir }).toString().trim();
    const match = remote.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    if (match) return { owner: match[1], repo: match[2] };
  } catch { /* fall through */ }
  return null;
}

// --- doc helpers ---

function readDoc(relativePath) {
  return fs.readFileSync(path.join(docsDir, relativePath), 'utf8');
}

function firstParagraph(markdown) {
  return (
    markdown
      .split(/\n{2,}/)
      .map((b) => b.trim())
      .find((b) => b && !b.startsWith('#') && !b.startsWith('```')) ?? ''
  );
}

function headingTitle(markdown) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : 'Untitled';
}

function escapeRegExp(v) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, 'm');
  const m = markdown.match(pattern);
  if (!m || m.index === undefined) return '';
  const rest = markdown.slice(m.index + m[0].length);
  const next = rest.search(/^##\s+/m);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function bullets(markdown) {
  return markdown
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).trim());
}

// --- parsers ---

// Roadmap phase → CKAR epic mapping (based on EPICS_AND_TASKS.md)
// Phase 0: 기획 (no epic, done before Jira)
// Phase 1: CKAR-1 Project Setup
// Phase 2: CKAR-2 Mobile Frontend Shell + CKAR-3 Main Live Chat
// Phase 3: CKAR-4 Player-Champion Synergy Review
// Phase 4: CKAR-5 LCK News + CKAR-6 Likes/Comments/Saved
// Phase 5: CKAR-7 Authentication + CKAR-9 Deployment
const PHASE_EPIC_KEYS = [
  [],
  ['CKAR-1'],
  ['CKAR-2', 'CKAR-3'],
  ['CKAR-4'],
  ['CKAR-5', 'CKAR-6'],
  ['CKAR-7', 'CKAR-9'],
];

function parseRoadmap(markdown) {
  const phases = [];
  const lines = markdown.split('\n');
  let current = null;
  let phaseIndex = 0;

  for (const line of lines) {
    const m = line.match(/^##\s+(Phase\s+\d+:\s+.+)$/);
    if (m) {
      current = {
        title: m[1],
        epicKeys: PHASE_EPIC_KEYS[phaseIndex] ?? [],
        items: [],
      };
      phases.push(current);
      phaseIndex++;
      continue;
    }
    if (current && line.trim().startsWith('- ')) {
      current.items.push(line.trim().slice(2));
    }
  }

  return phases;
}

function parseDecisions(markdown) {
  const sections = markdown.split(/^###\s+/m).slice(1);
  return sections.map((section) => {
    const [titleLine = '', ...bodyLines] = section.split('\n');
    const titleMatch = titleLine.match(/^(\d{4}-\d{2}-\d{2}):\s+(.+)$/);
    const body = bodyLines.join('\n').trim();

    function firstBulletValue(key) {
      const re = new RegExp(`^-\\s+${escapeRegExp(key)}:\\s*(.+)$`, 'm');
      return body.match(re)?.[1]?.trim();
    }

    return {
      date: titleMatch?.[1] ?? '날짜 없음',
      title: titleMatch?.[2] ?? titleLine.trim(),
      summary: firstBulletValue('Decision') || bullets(body)[0] || '결정 내용 정리 필요',
      reason: firstBulletValue('Reason') || 'Reason 섹션을 확인하세요.',
      followUp: firstBulletValue('Follow-up') || 'Follow-up 섹션을 확인하세요.',
    };
  });
}

function parseApiProgress(markdown) {
  const lines = markdown.split('\n');
  let total = 0;
  let implemented = 0;
  for (const line of lines) {
    if (/^-\s+`(GET|POST|PUT|DELETE)\s+/.test(line.trim())) {
      total++;
      if (line.includes('[구현됨]')) implemented++;
    }
  }
  return { total, implemented };
}

// --- GitHub API ---

async function fetchGitHubData(owner, repo) {
  const token = process.env.GITHUB_TOKEN;
  const headers = { 'User-Agent': 'CKArena-Dashboard/1.0', Accept: 'application/vnd.github+json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  async function ghFetch(url) {
    try {
      const res = await fetch(url, { headers });
      if (!res.ok) {
        console.warn(`GitHub API ${res.status}: ${url}`);
        return null;
      }
      return res.json();
    } catch (e) {
      console.warn(`GitHub API fetch failed: ${e.message}`);
      return null;
    }
  }

  const [issuesRaw, commitRaw] = await Promise.all([
    ghFetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100`),
    ghFetch(`https://api.github.com/repos/${owner}/${repo}/commits/main`),
  ]);

  // Filter out PRs (GitHub API includes them in /issues)
  const issues = Array.isArray(issuesRaw)
    ? issuesRaw.filter((i) => !i.pull_request)
    : [];

  const epicGroups = {};
  for (const issue of issues) {
    const m = issue.title.match(/\[CKAR-(\d+)\]/);
    if (m) {
      const key = `CKAR-${m[1]}`;
      if (!epicGroups[key]) epicGroups[key] = { total: 0, closed: 0 };
      epicGroups[key].total++;
      if (issue.state === 'closed') epicGroups[key].closed++;
    }
  }

  const lastCommitAt = commitRaw?.commit?.committer?.date ?? null;

  return {
    lastCommitAt,
    totalIssues: issues.length,
    openIssues: issues.filter((i) => i.state === 'open').length,
    closedIssues: issues.filter((i) => i.state === 'closed').length,
    epicGroups,
  };
}

function computePhaseStatus(epicKeys, epicGroups) {
  if (epicKeys.length === 0) return '완료'; // Phase 0: 기획 — always done

  let total = 0;
  let closed = 0;
  for (const key of epicKeys) {
    const g = epicGroups[key];
    if (g) { total += g.total; closed += g.closed; }
  }

  if (total === 0) return '예정';
  if (closed === total) return '완료';
  return '진행중';
}

// --- validation ---

function validate(data) {
  if (!data.roadmap || data.roadmap.length === 0) {
    throw new Error('Roadmap parsing failed: no phases found. Check ROADMAP.md ## Phase N: headings.');
  }
  if (!data.decisions || data.decisions.length === 0) {
    throw new Error('Decisions parsing failed: no entries found. Check AI_DECISION_LOG.md ### YYYY-MM-DD: headings.');
  }
  if (data.apiProgress.total === 0) {
    throw new Error('API parsing failed: no endpoints found. Check API_DESIGN.md - `GET/POST/PUT/DELETE` lines.');
  }
}

// --- main ---

const repoInfo = getGitHubRepo();
const githubStats = repoInfo
  ? await fetchGitHubData(repoInfo.owner, repoInfo.repo)
  : { lastCommitAt: null, totalIssues: 0, openIssues: 0, closedIssues: 0, epicGroups: {} };

const prd = readDoc('product/PRD.md');
const mvp = readDoc('product/MVP_SCOPE.md');
const roadmapMd = readDoc('product/ROADMAP.md');
const api = readDoc('architecture/API_DESIGN.md');
const decisionsMd = readDoc('ai/AI_DECISION_LOG.md');

const roadmapPhases = parseRoadmap(roadmapMd);
const decisions = parseDecisions(decisionsMd);
const apiProgress = parseApiProgress(api);

// Inject computed status into roadmap phases
const roadmap = roadmapPhases.map((phase) => ({
  ...phase,
  status: computePhaseStatus(phase.epicKeys, githubStats.epicGroups),
}));

// Build real metrics
function daysAgo(isoDate) {
  if (!isoDate) return null;
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '오늘';
  if (days === 1) return '어제';
  return `${days}일 전`;
}

const lastCommitLabel = daysAgo(githubStats.lastCommitAt) ?? '-';

const metrics = [
  {
    label: '완료 이슈',
    value: githubStats.totalIssues > 0
      ? `${githubStats.closedIssues}/${githubStats.totalIssues}`
      : '-',
    tone: 'green',
  },
  {
    label: '구현된 API',
    value: `${apiProgress.implemented}/${apiProgress.total}`,
    tone: 'cyan',
  },
  {
    label: '의사결정',
    value: String(decisions.length),
    tone: 'red',
  },
  {
    label: '마지막 커밋',
    value: lastCommitLabel,
    tone: 'neutral',
  },
];

const data = {
  generatedAt: new Date().toISOString(),
  overview: {
    title: 'CKArena Dashboard',
    project: 'CKArena',
    tagline: firstParagraph(prd),
    approachSummary:
      'docs를 프로젝트의 원본 지식 저장소로 두고, GitHub Issues 실제 상태와 API 구현 현황을 빌드 시점에 자동으로 반영합니다.',
    sourcePrinciple: 'docs는 source of truth, dashboard는 자동 생성, GitHub Issues가 진행 상황을 구동합니다.',
    metrics,
  },
  roadmap,
  mvpScope: bullets(extractSection(mvp, 'MVP 1: 기반 구성과 메인 채팅'))
    .concat(bullets(extractSection(mvp, 'MVP 2: 선수-챔피언 시너지 리뷰')))
    .concat(bullets(extractSection(mvp, 'MVP 3: LCK 뉴스')))
    .slice(0, 12)
    .filter(Boolean),
  decisions,
  apiProgress,
  githubStats,
};

validate(data);

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(`✓ Generated ${path.relative(rootDir, outputPath)}`);
console.log(`  roadmap phases: ${roadmap.length}`);
console.log(`  decisions: ${decisions.length}`);
console.log(`  api: ${apiProgress.implemented}/${apiProgress.total} implemented`);
console.log(`  issues: ${githubStats.closedIssues}/${githubStats.totalIssues} closed`);
console.log(`  last commit: ${githubStats.lastCommitAt ?? 'unavailable'}`);
