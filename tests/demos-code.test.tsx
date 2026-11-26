import {render, screen} from '@testing-library/react';
import {buildCode, defaultValues} from '../src/demos';
import type {Demo} from '../src/demoTypes';
import {PreviewBoundary} from '../src/components/PreviewBoundary';

const demo: Demo = {
  tag: 'Button',
  controls: [
    {kind: 'select', key: 'type', label: '종류', options: ['default', 'primary'], default: 'default'},
    {kind: 'bool', key: 'disabled', label: '비활성', default: false},
    {kind: 'text', key: 'children', label: '글자', default: '버튼'},
    {kind: 'number', key: 'count', label: '수', default: 0, min: 0, max: 9},
  ],
  Preview: () => null,
};

test('기본값과 같은 속성은 생략, children은 자식으로', () => {
  expect(buildCode(demo, defaultValues(demo))).toBe(`import {Button} from 'antd';\n\n<Button>버튼</Button>`);
});

test('바꾼 속성만 적는다', () => {
  expect(buildCode(demo, {...defaultValues(demo), type: 'primary', disabled: true, count: 3, children: 'a"b'})).toBe(
    `import {Button} from 'antd';\n\n<Button type="primary" disabled count={3}>a"b</Button>`,
  );
});

test('기본값이 true인 bool을 끄면 ={false}', () => {
  const d: Demo = {tag: 'Switch', controls: [{kind: 'bool', key: 'showInfo', label: 'x', default: true}], Preview: () => null};
  expect(buildCode(d, {showInfo: false})).toBe(`import {Switch} from 'antd';\n\n<Switch showInfo={false} />`);
});

test('문자열 속성의 따옴표는 &quot;', () => {
  const d: Demo = {tag: 'Input', controls: [{kind: 'text', key: 'placeholder', label: 'x', default: ''}], Preview: () => null};
  expect(buildCode(d, {placeholder: 'a"b'})).toBe(`import {Input} from 'antd';\n\n<Input placeholder="a&quot;b" />`);
});

test('점 표기 태그는 앞 이름만 import', () => {
  expect(buildCode({tag: 'Input.TextArea', controls: [], Preview: () => null}, {})).toBe(
    `import {Input} from 'antd';\n\n<Input.TextArea />`,
  );
});

test('extra는 끝에 붙는다', () => {
  expect(buildCode({tag: 'Switch', controls: [], extra: 'onChange={setOn}', Preview: () => null}, {})).toBe(
    `import {Switch} from 'antd';\n\n<Switch onChange={setOn} />`,
  );
});

test('code가 있으면 그대로', () => {
  expect(buildCode({tag: 'X', controls: [], code: (v) => `hi ${v.a}`, Preview: () => null}, {a: 1})).toBe('hi 1');
});

test('PreviewBoundary는 자식 오류를 안내로 바꾼다', () => {
  const Boom = () => {
    throw new Error('펑');
  };
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <PreviewBoundary>
      <Boom />
    </PreviewBoundary>,
  );
  expect(screen.getByText('이 속성 조합은 미리보기를 그리지 못했어요')).toBeInTheDocument();
  expect(screen.getByText('펑')).toBeInTheDocument();
});
