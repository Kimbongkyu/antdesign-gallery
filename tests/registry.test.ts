import {API_DOCS, SLUGS} from '../src/api';
import {BY_NAME, ENTRIES, GROUPS, docsUrl, searchEntries} from '../src/registry';

const names = (q: string) => searchEntries(ENTRIES, q).map((e) => e.name);

test('73개, 이름·slug 중복 없음', () => {
  expect(ENTRIES).toHaveLength(73);
  expect(new Set(ENTRIES.map((e) => e.name)).size).toBe(73);
  expect(new Set(ENTRIES.map((e) => e.slug))).toEqual(new Set(SLUGS));
});

test('그룹은 공식 순서 7개', () => {
  expect(GROUPS.map((g) => g.en)).toEqual([
    'General', 'Layout', 'Navigation', 'Data Entry', 'Data Display', 'Feedback', 'Other',
  ]);
});

test('그룹은 공식 문서의 group과 일치', () => {
  for (const e of ENTRIES) expect(GROUPS.find((g) => g.id === e.group)!.en, e.name).toBe(API_DOCS[e.slug].group);
});

test('이름은 공식 문서 제목과 일치', () => {
  for (const e of ENTRIES) expect(e.name).toBe(API_DOCS[e.slug].title);
});

test('한글 이름·설명은 모두 채워짐', () => {
  for (const e of ENTRIES) {
    expect(e.ko, e.slug).not.toBe('');
    expect(e.desc, e.slug).not.toBe('');
  }
});

test('검색: 한글 부분일치', () => {
  expect(names('날짜')).toContain('DatePicker');
  expect(names('팝')).toEqual(expect.arrayContaining(['Modal', 'Popover']));
});

test('검색: 영문 대소문자 무시, slug로도 찾음', () => {
  expect(names('datepicker')).toEqual(['DatePicker']);
  expect(names('date-picker')).toEqual(['DatePicker']);
});

test('검색: 여러 단어는 모두 포함해야 한다', () => {
  expect(names('날짜 범위')).toContain('DatePicker');
  expect(names('날짜 zzz')).toEqual([]);
});

test('검색: 빈 검색어는 목록 그대로', () => {
  expect(searchEntries(ENTRIES, '   ')).toBe(ENTRIES);
});

test('docsUrl', () => {
  expect(docsUrl(BY_NAME.DatePicker)).toBe('https://ant.design/components/date-picker');
  expect(docsUrl(BY_NAME.Util)).toBe('https://ant.design/components/util');
});
