import type {FavApi} from './shared';

// 임시 상세 화면 (Task 9에서 바로 해보기·속성 표로 교체)
export function Detail({name}: {name: string; fav: FavApi; backHref: string; backLabel: string}) {
  return <h2>{name}</h2>;
}
