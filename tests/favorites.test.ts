import {act, renderHook} from '@testing-library/react';
import {exportText, parseImport, useFavorites} from '../src/favorites';

const KEY = 'antd-gallery:favorites:v1';
beforeEach(() => localStorage.clear());

test('토글은 저장되고 다시 불러와진다', () => {
  const {result} = renderHook(useFavorites);
  act(() => result.current.toggle('Button'));
  expect(localStorage.getItem(KEY)).toBe('["Button"]');
  expect(renderHook(useFavorites).result.current.favs).toEqual(['Button']);
  act(() => result.current.toggle('Button'));
  expect(result.current.favs).toEqual([]);
});

test('깨진 저장값은 빈 목록', () => {
  localStorage.setItem(KEY, '{oops');
  expect(renderHook(useFavorites).result.current.favs).toEqual([]);
  localStorage.setItem(KEY, '[1,"Table"]');
  expect(renderHook(useFavorites).result.current.favs).toEqual(['Table']);
});

test('merge는 중복 없이 합친다', () => {
  const {result} = renderHook(useFavorites);
  act(() => result.current.toggle('Button'));
  act(() => result.current.merge(['Button', 'Table']));
  expect(result.current.favs).toEqual(['Button', 'Table']);
});

test('parseImport: 앞머리 있든 없든, 공백·빈칸·모르는 이름·중복 무시', () => {
  const known = new Set(['Button', 'Table']);
  expect(parseImport('antd:Button, ,Table,Nope,Button', known)).toEqual(['Button', 'Table']);
  expect(parseImport('  Button  ', known)).toEqual(['Button']);
  expect(parseImport('', known)).toEqual([]);
});

test('exportText', () => {
  expect(exportText(['Button', 'Table'])).toBe('antd:Button,Table');
});
