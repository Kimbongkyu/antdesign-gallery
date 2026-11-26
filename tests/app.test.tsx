import {act, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Root} from '../src/main';

function go(hash: string) {
  act(() => {
    window.location.hash = hash;
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  });
}

const cards = () => screen.queryAllByTestId('card');
const cardNames = () => cards().map((c) => c.getAttribute('data-name'));

beforeEach(() => {
  localStorage.clear();
  window.location.hash = '';
});

test('전체 화면은 7개 그룹 제목과 73개 카드', () => {
  render(<Root />);
  expect(cards()).toHaveLength(73);
  for (const g of ['통용', '레이아웃', '내비게이션', '데이터 입력', '데이터 표시', '피드백', '기타'])
    expect(screen.getAllByRole('heading', {name: new RegExp(g)}).length).toBeGreaterThan(0);
});

test('검색하면 결과 수와 카드가 바뀐다', async () => {
  render(<Root />);
  await userEvent.type(screen.getByPlaceholderText(/검색/), '날짜');
  expect(screen.getByText(/검색 결과 \d+개/)).toBeInTheDocument();
  expect(cardNames()).toContain('DatePicker');
  expect(cardNames()).not.toContain('Button');
});

test('검색 결과가 없으면 안내', async () => {
  render(<Root />);
  await userEvent.type(screen.getByPlaceholderText(/검색/), 'zzzz');
  expect(screen.getByText('해당하는 컴포넌트가 없어요.')).toBeInTheDocument();
});

test('그룹 화면', () => {
  render(<Root />);
  go('#/g/feedback');
  expect(screen.getByRole('heading', {level: 2, name: '피드백'})).toBeInTheDocument();
  expect(cards()).toHaveLength(11);
});

test('별을 누르면 즐겨찾기 화면에 나온다', async () => {
  render(<Root />);
  const card = cards().find((c) => c.getAttribute('data-name') === 'Button')!;
  await userEvent.click(within(card).getByRole('button', {name: /즐겨찾기 추가/}));
  go('#/fav');
  expect(cardNames()).toEqual(['Button']);
});

test('즐겨찾기 가져오기', async () => {
  render(<Root />);
  go('#/fav');
  await userEvent.click(screen.getByText('다른 기기로 즐겨찾기 옮기기'));
  await userEvent.type(screen.getByPlaceholderText(/붙여넣기/), 'antd:Table,Nope');
  await userEvent.click(screen.getByRole('button', {name: '가져오기'}));
  expect(cardNames()).toEqual(['Table']);
  expect(screen.getByText('1개를 새로 담았어요.')).toBeInTheDocument();
  // 이미 있는 이름만 다시 넣으면 0개로 세지 않고 경고로 알린다
  await userEvent.type(screen.getByPlaceholderText(/붙여넣기/), 'antd:Table');
  await userEvent.click(screen.getByRole('button', {name: '가져오기'}));
  expect(screen.getByText('새로 담을 이름이 없어요.')).toBeInTheDocument();
});

test('카드를 누르면 상세 주소로 간다', async () => {
  render(<Root />);
  const card = cards().find((c) => c.getAttribute('data-name') === 'Table')!;
  expect(within(card).getByRole('link')).toHaveAttribute('href', '#/c/Table');
});

describe('모바일', () => {
  const desktop = window.matchMedia;
  beforeEach(() => {
    window.matchMedia = ((q: string) => ({...desktop(q), matches: false})) as typeof window.matchMedia;
  });
  afterEach(() => {
    window.matchMedia = desktop;
  });

  test('메뉴 항목을 누르면 이동하고 Drawer가 닫힌다', async () => {
    render(<Root />);
    await userEvent.click(screen.getByRole('button', {name: '그룹 메뉴 열기'}));
    const drawer = await screen.findByRole('dialog');
    expect(document.querySelector('.ant-drawer-open')).not.toBeNull();
    await userEvent.click(within(drawer).getByText('피드백'));
    expect(window.location.hash).toBe('#/g/feedback');
    // 닫힘 애니메이션 때문에 DOM에는 남으므로 열림 클래스로 확인
    expect(document.querySelector('.ant-drawer-open')).toBeNull();
  });
});
