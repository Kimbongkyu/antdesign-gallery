import {API_DOCS} from '../src/api';
import {API_KO} from '../src/api-ko';

test('한글 설명이 붙은 속성은 실제 표에 있다', () => {
  for (const [slug, props] of Object.entries(API_KO))
    for (const p of Object.keys(props))
      expect(API_DOCS[slug]?.sections.some((s) => s.rows.some((r) => r.prop === p)), `${slug}.${p}`).toBe(true);
});
