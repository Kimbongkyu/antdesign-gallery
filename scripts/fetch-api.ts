// antd 저장소의 문서에서 속성 표를 받아 src/api/data/<slug>.json 으로 저장한다.
// 실행: npm run fetch-api  (antd 버전을 올릴 때 src/api/slugs.ts 의 ANTD_TAG 를 바꾸고 다시 실행)
import {writeFileSync} from 'node:fs';
import {parseApiMarkdown} from '../src/api/parse.ts';
import {ANTD_TAG, SLUGS, SOURCE_DIR} from '../src/api/slugs.ts';

const failed: string[] = [];
for (const slug of SLUGS) {
  const dir = SOURCE_DIR[slug] ?? slug;
  const url = `https://raw.githubusercontent.com/ant-design/ant-design/${ANTD_TAG}/components/${dir}/index.en-US.md`;
  const res = await fetch(url);
  if (!res.ok) {
    failed.push(`${slug} (${res.status})`);
    continue;
  }
  const doc = parseApiMarkdown(slug, await res.text());
  writeFileSync(new URL(`../src/api/data/${slug}.json`, import.meta.url), JSON.stringify(doc, null, 2) + '\n');
  console.log(`${slug}: ${doc.sections.reduce((n, s) => n + s.rows.length, 0)}개 속성`);
}
if (failed.length) {
  console.error(`받지 못함: ${failed.join(', ')}`);
  process.exit(1);
}
