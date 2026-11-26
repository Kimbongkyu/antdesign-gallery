import {parseHash, routeHash, routeLabel} from '../src/route';

test('컴포넌트 상세', () => {
  expect(parseHash('#/c/Button')).toEqual({view: 'comp', name: 'Button'});
});
test('그룹', () => {
  expect(parseHash('#/g/entry')).toEqual({view: 'group', id: 'entry'});
});
test('즐겨찾기', () => {
  expect(parseHash('#/fav')).toEqual({view: 'fav'});
});
test('없는 이름·그룹·빈 주소는 전체', () => {
  for (const h of ['#/c/Nope', '#/g/nope', '', '#/', '#/zzz']) expect(parseHash(h), h).toEqual({view: 'all'});
});
test('routeHash', () => {
  expect(routeHash({view: 'group', id: 'entry'})).toBe('#/g/entry');
  expect(routeHash({view: 'fav'})).toBe('#/fav');
  expect(routeHash({view: 'all'})).toBe('#/');
});
test('routeLabel', () => {
  expect(routeLabel({view: 'fav'})).toBe('즐겨찾기');
  expect(routeLabel({view: 'group', id: 'entry'})).toBe('데이터 입력');
  expect(routeLabel({view: 'all'})).toBe('전체');
});
