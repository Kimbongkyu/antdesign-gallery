import {useEffect, useMemo, useState} from 'react';
import {BY_NAME, GROUPS} from './registry';

/* ---------- 주소(#) 라우팅 ---------- */

export type Route =
  | {view: 'all'}
  | {view: 'fav'}
  | {view: 'group'; id: string}
  | {view: 'comp'; name: string};

export type ListRoute = Exclude<Route, {view: 'comp'}>;

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/');
  if (parts[0] === 'c' && parts[1] && BY_NAME[parts[1]]) return {view: 'comp', name: parts[1]};
  if (parts[0] === 'g' && GROUPS.some((g) => g.id === parts[1])) return {view: 'group', id: parts[1]};
  if (parts[0] === 'fav') return {view: 'fav'};
  return {view: 'all'};
}

export function routeHash(r: ListRoute): string {
  if (r.view === 'group') return `#/g/${r.id}`;
  if (r.view === 'fav') return '#/fav';
  return '#/';
}

export function routeLabel(r: ListRoute): string {
  if (r.view === 'group') return GROUPS.find((g) => g.id === r.id)?.label ?? '목록';
  if (r.view === 'fav') return '즐겨찾기';
  return '전체';
}

export function useRoute(): Route {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return useMemo(() => parseHash(hash), [hash]);
}
