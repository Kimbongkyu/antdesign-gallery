import {API_DOCS, SLUGS} from '../src/api';

test('73개 slug 모두 API 문서가 있다', () => {
  expect(SLUGS).toHaveLength(73);
  for (const s of SLUGS) expect(API_DOCS[s], s).toBeDefined();
});

test('표가 없는 문서 외에는 속성 표가 비어 있지 않다', () => {
  const EMPTY_OK = ['util']; // Util 문서는 표 없이 타입 설명만 있다
  for (const s of SLUGS) if (!EMPTY_OK.includes(s)) expect(API_DOCS[s].sections.length, s).toBeGreaterThan(0);
});
