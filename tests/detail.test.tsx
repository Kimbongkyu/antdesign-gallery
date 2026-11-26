import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from 'antd';
import {API_DOCS} from '../src/api';
import {API_KO} from '../src/api-ko';
import {ApiTable} from '../src/components/ApiTable';
import {Detail} from '../src/components/Detail';
import {Providers} from '../src/main';
import type {Demo} from '../src/demoTypes';

vi.mock('../src/demos', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/demos')>();
  const demo: Demo = {
    tag: 'Button',
    controls: [{kind: 'select', key: 'type', label: '종류(type)', options: ['default', 'primary'], default: 'default'}],
    Preview: ({v}) => <Button type={v.type as 'default'}>버튼</Button>,
  };
  return {...mod, DEMOS: {Button: demo}};
});

const fav = {favs: [] as string[], toggle: vi.fn(), merge: vi.fn()};
const rowsOf = () => screen.getAllByRole('row').slice(1); // 첫 줄은 머리글

test('한글 설명이 있으면 한글, 없으면 영문 + 「영문」 표시', () => {
  render(<ApiTable doc={API_DOCS.button} />);
  expect(screen.getByText(API_KO.button.type)).toBeInTheDocument();
  const ghost = screen.getByText('ghost').closest('tr')!;
  expect(within(ghost).getByText('Make background transparent and invert text and border colors')).toBeInTheDocument();
  expect(within(ghost).getByText('영문')).toBeInTheDocument();
});

test('폐지 속성은 맨 아래, 취소선과 「폐지」 표시', () => {
  render(<ApiTable doc={API_DOCS.button} />);
  const last = rowsOf().at(-1)!;
  expect(within(last).getByText('iconPosition').closest('del')).not.toBeNull();
  expect(within(last).getByText('폐지')).toBeInTheDocument();
});

test('필터: 속성 이름 대소문자 무시 부분일치', async () => {
  render(<ApiTable doc={API_DOCS.button} />);
  await userEvent.type(screen.getByPlaceholderText('속성 이름으로 찾기'), 'ICON');
  const props = rowsOf().map((r) => r.querySelector('td code, td del')!.textContent);
  expect(props).toEqual(['icon', 'iconPlacement', 'loadingIcon', 'iconPosition']); // 폐지(iconPosition)는 맨 아래
});

test('필터 결과가 없으면 안내', async () => {
  render(<ApiTable doc={API_DOCS.button} />);
  await userEvent.type(screen.getByPlaceholderText('속성 이름으로 찾기'), 'zzz');
  expect(screen.getByText('일치하는 속성이 없어요')).toBeInTheDocument();
});

test('구역이 여러 개면 소제목을 보여준다', () => {
  render(<ApiTable doc={API_DOCS.select} />);
  expect(screen.getByRole('heading', {name: 'Select props'})).toBeInTheDocument();
  expect(screen.getByRole('heading', {name: 'Option props'})).toBeInTheDocument();
});

test('표가 없는 문서는 안내', () => {
  render(<ApiTable doc={API_DOCS.util} />);
  expect(screen.getByText('이 컴포넌트는 속성 표가 없어요. 공식 문서를 참고하세요.')).toBeInTheDocument();
});

test('상세: 바로 해보기에서 속성을 바꾸면 코드가 바뀐다', async () => {
  render(<Providers><Detail name="Button" fav={fav} backHref="#/" backLabel="전체" /></Providers>);
  expect(screen.getByTestId('code').textContent).not.toContain('type="primary"');
  await userEvent.click(screen.getByRole('combobox', {name: '종류(type)'}));
  await userEvent.click(await screen.findByTitle('primary'));
  expect(screen.getByTestId('code').textContent).toContain('<Button type="primary"');
});

test('상세: 데모가 없으면 안내', () => {
  render(<Providers><Detail name="Table" fav={fav} backHref="#/" backLabel="전체" /></Providers>);
  expect(screen.getByText('아직 바로 해보기가 없어요.')).toBeInTheDocument();
});

test('상세: 제목·돌아가기·공식 문서 링크', () => {
  render(<Providers><Detail name="Button" fav={fav} backHref="#/g/general" backLabel="통용" /></Providers>);
  expect(screen.getByRole('heading', {level: 2, name: /Button/})).toBeInTheDocument();
  expect(screen.getByRole('link', {name: /통용/})).toHaveAttribute('href', '#/g/general');
  const docs = screen.getByRole('link', {name: /공식 문서/});
  expect(docs).toHaveAttribute('href', 'https://ant.design/components/button');
  expect(docs).toHaveAttribute('target', '_blank');
});
