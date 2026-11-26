import {useEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import {Badge, Button, Flex, Grid, Input, Typography} from 'antd';
import {MenuOutlined, StarFilled} from '@ant-design/icons';
import {BY_NAME, ENTRIES, GROUPS, searchEntries} from './registry';
import {useFavorites} from './favorites';
import {routeHash, routeLabel, useRoute, type ListRoute, type Route} from './route';
import {CardList} from './components/Lists';
import {FavTools} from './components/FavTools';
import {Sidebar} from './components/Sidebar';
import {Detail} from './components/Detail';

const {Title, Paragraph} = Typography;

export function App() {
  const route = useRoute();
  const fav = useFavorites();
  const [query, setQuery] = useState('');
  const [sideOpen, setSideOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const isMobile = screens.md === false;

  // 화면을 이동하면 검색어를 비우고 메뉴를 닫는다
  useEffect(() => {
    setQuery('');
    setSideOpen(false);
  }, [route]);

  // 상세에서 돌아갈 목록(전체/그룹/즐겨찾기)을 기억한다
  const [lastList, setLastList] = useState<ListRoute | null>(null);
  useEffect(() => {
    if (route.view !== 'comp') setLastList(route);
  }, [route]);

  // 스크롤: 상세로 가면 맨 위, 상세에서 목록으로 돌아오면 방금 보던 카드로 이동
  const prevRoute = useRef<Route | null>(null);
  useEffect(() => {
    const prev = prevRoute.current;
    prevRoute.current = route;
    if (prev === route) return;
    if (route.view !== 'comp' && prev?.view === 'comp') {
      const id = `card-${prev.name}`;
      const goto = () => document.getElementById(id)?.scrollIntoView?.({block: 'center'});
      if (document.getElementById(id)) {
        goto();
        requestAnimationFrame(goto); // 레이아웃이 자리 잡은 뒤 한 번 더
        return;
      }
    }
    window.scrollTo?.({top: 0});
  }, [route]);

  const searching = query.trim().length > 0;
  const results = useMemo(() => searchEntries(ENTRIES, query), [query]);
  const favEntries = useMemo(() => ENTRIES.filter((e) => fav.favs.includes(e.name)), [fav.favs]);

  let main: ReactNode;
  if (searching) {
    main = (
      <>
        <Title level={2}>검색 결과 {results.length}개</Title>
        <CardList entries={results} fav={fav} />
      </>
    );
  } else if (route.view === 'comp') {
    const back: ListRoute = lastList ?? {view: 'group', id: BY_NAME[route.name].group};
    main = (
      <Detail key={route.name} name={route.name} fav={fav} backHref={routeHash(back)} backLabel={routeLabel(back)} />
    );
  } else if (route.view === 'fav') {
    main = (
      <>
        <Title level={2}>즐겨찾기 {favEntries.length}개</Title>
        {favEntries.length === 0 ? (
          <Paragraph type="secondary">마음에 드는 컴포넌트의 ☆를 누르면 여기에 모여요.</Paragraph>
        ) : (
          <CardList entries={favEntries} fav={fav} />
        )}
        <FavTools fav={fav} />
      </>
    );
  } else if (route.view === 'group') {
    const g = GROUPS.find((x) => x.id === route.id)!;
    main = (
      <>
        <Title level={2}>{g.label}</Title>
        <Paragraph type="secondary">
          {g.en} · {g.hint}
        </Paragraph>
        <CardList entries={ENTRIES.filter((e) => e.group === g.id)} fav={fav} />
      </>
    );
  } else {
    main = (
      <>
        <Title level={2}>전체 {ENTRIES.length}개</Title>
        <Paragraph type="secondary">
          그룹별로 둘러보거나 위에서 검색하세요. 「바로 해보기」가 붙은 건 화면에서 속성을 바꿔볼 수 있어요.
        </Paragraph>
        {GROUPS.map((g) => {
          const list = ENTRIES.filter((e) => e.group === g.id);
          return (
            <section key={g.id} className="gx-group">
              <Flex align="center" gap={8}>
                <Title level={3} style={{margin: 0}}>
                  <a href={`#/g/${g.id}`}>{g.label}</a>
                </Title>
                <Typography.Text type="secondary">{g.en}</Typography.Text>
                <Badge count={list.length} color="#8c8c8c" />
              </Flex>
              <CardList entries={list} fav={fav} />
            </section>
          );
        })}
      </>
    );
  }

  const activeKey =
    route.view === 'group' ? route.id : route.view === 'comp' ? BY_NAME[route.name].group : route.view;

  return (
    <div className="gx">
      <header className="gx-top">
        {isMobile && (
          <Button type="text" aria-label="그룹 메뉴 열기" icon={<MenuOutlined />} onClick={() => setSideOpen(true)} />
        )}
        <a href="#/" className="gx-title">
          Ant Design 둘러보기
        </a>
        <Input.Search
          className="gx-search"
          aria-label="컴포넌트 검색"
          allowClear
          placeholder="검색 (예: 날짜, 팝업, 표)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="text" href="#/fav" icon={<StarFilled className="gx-star on" />}>
          {fav.favs.length}
        </Button>
      </header>
      <div className="gx-body">
        <Sidebar
          activeKey={activeKey}
          favCount={fav.favs.length}
          isMobile={isMobile}
          open={sideOpen}
          onClose={() => setSideOpen(false)}
        />
        <main className="gx-main">{main}</main>
      </div>
    </div>
  );
}
