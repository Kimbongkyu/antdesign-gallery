// antd 문서(components/<slug>/index.en-US.md)의 ## API 구역에서 속성 표를 뽑는다.
// scripts/fetch-api.ts 가 Node로 직접 실행하므로 타입 제거만으로 돌아가는 문법만 쓴다.

export type ApiRow = {
  prop: string;
  desc: string;
  type: string;
  default: string;
  version: string;
  deprecated: boolean;
};
export type ApiSection = {section: string; rows: ApiRow[]};
export type ApiDoc = {slug: string; title: string; group: string; sections: ApiSection[]};

const PIPE = '\u0000';

// [글자](주소) → 글자, 백틱 제거
function clean(cell: string): string {
  return cell
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`/g, '')
    .trim();
}

function splitRow(line: string): string[] {
  return line
    .replace(/\\\|/g, PIPE)
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((c) => clean(c.split(PIPE).join('|')));
}

// 머리글 이름 → 저장할 칸. 첫 열(Property/Name/Param 등)은 언제나 prop.
const COLUMN: Record<string, keyof Omit<ApiRow, 'prop' | 'deprecated'>> = {
  description: 'desc',
  type: 'type',
  default: 'default',
  version: 'version',
};

function frontmatter(md: string): {title: string; group: string} {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = m ? m[1] : '';
  const title = fm.match(/^title:[ \t]*(.+)$/m)?.[1].trim() ?? '';
  const inline = fm.match(/^group:[ \t]*(\S.*)$/m)?.[1].trim();
  const nested = fm.match(/^group:[ \t]*\r?\n[ \t]+title:[ \t]*(.+)$/m)?.[1].trim();
  return {title, group: inline ?? nested ?? ''};
}

export function parseApiMarkdown(slug: string, md: string): ApiDoc {
  const {title, group} = frontmatter(md);
  const sections: ApiSection[] = [];
  const lines = md.split(/\r?\n/);
  let inApi = false;
  let name = title;
  let header: string[] | null = null;
  let current: ApiSection | null = null;

  for (const line of lines) {
    if (/^## /.test(line)) {
      inApi = /^## API\s*$/.test(line);
      header = null;
      continue;
    }
    if (!inApi) continue;
    if (/^### /.test(line)) {
      name = line.replace(/^###\s+/, '').replace(/\s*\{#.*\}\s*$/, '').trim();
      header = null;
      continue;
    }
    if (!line.trim().startsWith('|')) {
      header = null;
      continue;
    }
    const cells = splitRow(line);
    if (!header) {
      header = cells.map((c) => c.toLowerCase());
      current = {section: name, rows: []};
      sections.push(current);
      continue;
    }
    if (cells.every((c) => /^:?-+:?$/.test(c))) continue; // | --- | 구분 줄
    const r: ApiRow = {prop: '', desc: '', type: '', default: '', version: '', deprecated: false};
    const first = cells[0] ?? '';
    r.deprecated = /^~~.*~~$/.test(first);
    r.prop = first.replace(/^~~(.*)~~$/, '$1').trim();
    header.forEach((h, i) => {
      const key = COLUMN[h];
      if (i > 0 && key) r[key] = cells[i] ?? '';
    });
    if (r.version === '-') r.version = '';
    current!.rows.push(r);
  }
  return {slug, title, group, sections: sections.filter((s) => s.rows.length > 0)};
}
