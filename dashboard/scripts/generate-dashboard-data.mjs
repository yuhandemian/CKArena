import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(process.cwd(), '..');
const docsDir = path.join(rootDir, 'docs');
const outputPath = path.join(process.cwd(), 'src/data/generated/dashboard-data.json');

const docFiles = [
  'product/PRD.md',
  'product/MVP_SCOPE.md',
  'product/ROADMAP.md',
  'product/DASHBOARD_PLAN.md',
  'architecture/SYSTEM_OVERVIEW.md',
  'architecture/API_DESIGN.md',
  'architecture/DATABASE_SCHEMA.md',
  'ai/HARNESS_ENGINEERING.md',
  'ai/AI_WORKFLOW.md',
  'ai/AI_DECISION_LOG.md',
  'learning/AI_IMPLEMENTATION_REVIEW.md',
  'learning/SPRING_BOOT_NOTES.md',
  'learning/REACT_NOTES.md',
];

function readDoc(relativePath) {
  return fs.readFileSync(path.join(docsDir, relativePath), 'utf8');
}

function firstParagraph(markdown) {
  return markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith('#') && !block.startsWith('```')) ?? '';
}

function headingTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

function extractSection(markdown, heading) {
  const pattern = new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, 'm');
  const match = markdown.match(pattern);
  if (!match || match.index === undefined) {
    return '';
  }
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^##\s+/m);
  return (next >= 0 ? rest.slice(0, next) : rest).trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function bullets(markdown) {
  return markdown
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- '))
    .map((line) => line.slice(2).trim());
}

function parseRoadmap(markdown) {
  const phases = [];
  const lines = markdown.split('\n');
  let current = null;

  for (const line of lines) {
    const phaseMatch = line.match(/^##\s+(Phase\s+\d+:\s+.+)$/);
    if (phaseMatch) {
      current = {
        title: phaseMatch[1],
        status: phases.length === 0 ? '완료' : phases.length === 1 ? '진행중' : '예정',
        items: [],
      };
      phases.push(current);
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
    return {
      date: titleMatch?.[1] ?? '날짜 없음',
      title: titleMatch?.[2] ?? titleLine.trim(),
      summary: firstBulletValue(body, 'Decision') || bullets(body)[0] || '결정 내용 정리 필요',
      reason: firstBulletValue(body, 'Reason') || 'Reason 섹션을 확인하세요.',
      followUp: firstBulletValue(body, 'Follow-up') || 'Follow-up 섹션을 확인하세요.',
    };
  });
}

function firstBulletValue(markdown, key) {
  const regex = new RegExp(`^-\\s+${escapeRegExp(key)}:\\s*(.+)$`, 'm');
  return markdown.match(regex)?.[1]?.trim();
}

function parseHarness(markdown) {
  return {
    title: headingTitle(markdown),
    principle: firstParagraph(markdown),
    rules: bullets(extractSection(markdown, '4. Rules / Policies: AI에게 적용하는 작업 규칙')).slice(0, 8),
    validation: bullets(extractSection(markdown, '5. Test / CI: 검증 기준')).slice(0, 8),
    branchRule: extractSection(markdown, 'AI 협업 중 브랜치 정합성 규칙')
      .split('\n')
      .filter((line) => line.trim().startsWith('- '))
      .map((line) => line.trim().slice(2))
      .slice(0, 6),
  };
}

function parseApiStats(markdown) {
  const endpoints = markdown
    .split('\n')
    .filter((line) => /^-\s+`(GET|POST|PUT|DELETE)\s+/.test(line.trim()));
  const stomp = markdown
    .split('\n')
    .filter((line) => line.includes('STOMP') || line.includes('WebSocket'));
  return {
    restEndpoints: endpoints.length,
    realtimeContracts: stomp.length,
  };
}

const prd = readDoc('product/PRD.md');
const mvp = readDoc('product/MVP_SCOPE.md');
const roadmap = readDoc('product/ROADMAP.md');
const api = readDoc('architecture/API_DESIGN.md');
const decisions = readDoc('ai/AI_DECISION_LOG.md');
const harness = readDoc('ai/HARNESS_ENGINEERING.md');

const docsIndex = docFiles.map((file) => {
  const markdown = readDoc(file);
  return {
    path: `docs/${file}`,
    title: headingTitle(markdown),
    summary: firstParagraph(markdown),
    headings: [...markdown.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1]),
  };
});

const data = {
  generatedAt: new Date().toISOString(),
  overview: {
    title: 'CKArena Dashboard',
    project: 'CKArena',
    tagline: firstParagraph(prd),
    interviewSummary:
      'CKArena에서는 docs/를 프로젝트의 원본 지식 저장소로 두고, 이를 자동으로 읽어 dashboard/에서 시각화하도록 설계했습니다.',
    metrics: [
      { label: '문서 수', value: String(docsIndex.length), tone: 'neutral' },
      { label: 'MVP 단계', value: String(parseRoadmap(roadmap).length), tone: 'green' },
      { label: '의사결정', value: String(parseDecisions(decisions).length), tone: 'red' },
      { label: 'REST API', value: String(parseApiStats(api).restEndpoints), tone: 'cyan' },
    ],
    sourcePrinciple: 'docs는 source of truth, dashboard는 시각화 결과물, GitHub Pages는 자동 배포 대상.',
  },
  roadmap: parseRoadmap(roadmap),
  mvpScope: bullets(mvp).slice(0, 12),
  harness: parseHarness(harness),
  decisions: parseDecisions(decisions),
  apiStats: parseApiStats(api),
  docsIndex,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
