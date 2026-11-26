import {render} from '@testing-library/react';
import {API_DOCS} from '../src/api';
import {API_KO} from '../src/api-ko';
import {DEMOS, defaultValues} from '../src/demos';
import {Providers} from '../src/main';
import {BY_NAME, ENTRIES} from '../src/registry';

// 데모를 다 만든 그룹. 그룹을 끝낼 때마다 늘린다.
const DONE_GROUPS = ['general', 'layout', 'other', 'navigation', 'feedback', 'entry'];

test.each(Object.entries(DEMOS))('%s 데모가 오류 없이 그려진다', (_name, demo) => {
  if (demo.noPreview) {
    expect(demo.code).toBeDefined();
    return;
  }
  const errors = vi.spyOn(console, 'error');
  render(
    <Providers>
      <demo.Preview v={defaultValues(demo)} />
    </Providers>,
  );
  expect(errors).not.toHaveBeenCalled();
  errors.mockRestore();
});

test('데모 키는 모두 실제 컴포넌트 이름', () => {
  for (const k of Object.keys(DEMOS)) expect(BY_NAME[k], k).toBeDefined();
});

test.each(DONE_GROUPS)('%s 그룹: 모든 컴포넌트에 데모와 한글 속성 설명(5개 이상)이 있다', (group) => {
  for (const e of ENTRIES.filter((x) => x.group === group)) {
    expect(DEMOS[e.name], e.name).toBeDefined();
    if (API_DOCS[e.slug].sections.length)
      expect(Object.keys(API_KO[e.slug] ?? {}).length, e.name).toBeGreaterThanOrEqual(
        Math.min(5, API_DOCS[e.slug].sections.flatMap((s) => s.rows).filter((r) => !r.deprecated).length),
      );
  }
});
