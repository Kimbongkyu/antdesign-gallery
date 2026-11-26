import {render} from '@testing-library/react';
import {API_DOCS} from '../src/api';
import {API_KO} from '../src/api-ko';
import {DEMOS, defaultValues} from '../src/demos';
import {Providers} from '../src/main';
import {BY_NAME, ENTRIES, GROUPS} from '../src/registry';

// 모든 그룹 (73개 전부 데모와 한글 속성 설명이 있어야 한다)
const DONE_GROUPS = GROUPS.map((g) => g.id);

// 컴포넌트 자체가 폐지 예정이라 antd가 늘 내는 경고 (데모 note 로 안내함)
const KNOWN_WARNING: Record<string, RegExp> = {
  List: /\[antd: List\] The `List` component is deprecated/,
};

test.each(Object.entries(DEMOS))('%s 데모가 오류 없이 그려진다', (name, demo) => {
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
  const unexpected = errors.mock.calls.map((c) => String(c[0])).filter((m) => !KNOWN_WARNING[name]?.test(m));
  expect(unexpected).toEqual([]);
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

test('73개 컴포넌트 모두 데모가 있다', () => {
  expect(ENTRIES.filter((e) => !DEMOS[e.name]).map((e) => e.name)).toEqual([]);
});
