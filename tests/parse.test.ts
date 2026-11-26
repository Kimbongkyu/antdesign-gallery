import {readFileSync} from 'node:fs';
import {parseApiMarkdown, type ApiDoc, type ApiRow} from '../src/api/parse';

const read = (f: string) => readFileSync(`tests/fixtures/${f}`, 'utf8');
const row = (doc: ApiDoc, prop: string): ApiRow => {
  const r = doc.sections.flatMap((s) => s.rows).find((x) => x.prop === prop);
  if (!r) throw new Error(`no row ${prop}`);
  return r;
};

const button = parseApiMarkdown('button', read('button.en-US.md'));
const select = parseApiMarkdown('select', read('select.en-US.md'));

test('머리말에서 제목과 그룹을 읽는다 (group 두 가지 표기 모두)', () => {
  expect(button).toMatchObject({slug: 'button', title: 'Button', group: 'General'});
  expect(select).toMatchObject({slug: 'select', title: 'Select', group: 'Data Entry'});
});

test('소제목 없는 API 표는 제목 이름의 구역 하나', () => {
  expect(button.sections.map((s) => s.section)).toEqual(['Button']);
});

test('### 소제목별로 구역을 나누고 API 구역 밖은 무시한다', () => {
  expect(select.sections.map((s) => s.section)).toEqual([
    'Select props',
    'AllowClearConfig',
    'showSearch',
    'Select Methods',
    'Option props',
    'OptGroup props',
  ]);
});

test('셀 안의 \\| 는 구분자가 아니다', () => {
  const shape = row(button, 'shape');
  expect(shape.type).toBe('default | circle | round');
  expect(shape.default).toBe('default');
});

test('취소선 속성은 deprecated, 이름에서 ~~ 제거', () => {
  expect(row(button, 'iconPosition').deprecated).toBe(true);
  expect(row(button, 'iconPlacement').deprecated).toBe(false);
});

test('링크·백틱은 글자만 남긴다', () => {
  expect(row(button, 'htmlType').desc).toBe('Set the original html type of button, see: MDN');
});

test('Global Config 열이 있어도 필요한 열만 읽는다', () => {
  expect(row(button, 'block')).toEqual({
    prop: 'block',
    desc: 'Option to fit button width to its parent width',
    type: 'boolean',
    default: 'false',
    version: '',
    deprecated: false,
  });
});

test('열이 적은 표(메서드)는 머리글 이름으로 맞춘다', () => {
  expect(row(select, 'blur()')).toEqual({
    prop: 'blur()',
    desc: 'Remove focus',
    type: '',
    default: '',
    version: '',
    deprecated: false,
  });
});
