# Ant Design 컴포넌트 둘러보기 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** antd 6.7.2 컴포넌트 73개를 공식 그룹별로 한글 검색·즐겨찾기·바로 해보기·속성(API) 표로 보여주는 개인 참조 사이트.

**Architecture:** 참고 구현 `C:\Workspace\claudeCode\astryx-gallery`의 구조(registry / demos / favorites / # 라우팅)를 그대로 옮기고 UI는 antd로 만든다. 속성 표는 antd 저장소의 6.7.2 문서 마크다운을 스크립트로 파싱해 JSON으로 커밋한다.

**Tech Stack:** Vite 7, React 19, TypeScript 5, antd 6.7.2, @ant-design/icons, dayjs, Vitest + @testing-library/react + jsdom. Node 26(스크립트는 `node scripts/x.ts`로 타입 제거 실행).

**Spec:** `docs/superpowers/specs/2026-11-26-antd-gallery-design.md`

## Global Constraints

- antd 버전 고정: `"antd": "6.7.2"` (캐럿 없이). API 문서 원본 태그도 `6.7.2`.
- 모든 화면 문구는 한국어. `<html lang="ko">`, `ConfigProvider locale={koKR}` (`antd/locale/ko_KR`), dayjs `ko` 로케일.
- 라우트: `#/`, `#/g/<groupId>`, `#/c/<Name>`, `#/fav`. 그 외는 전체(`#/`).
- 즐겨찾기 localStorage 키: `antd-gallery:favorites:v1`. 내보내기 문자열 형식: `antd:Name1,Name2`.
- vite `base: './'`.
- 공식 문서 링크: `https://ant.design/components/<slug>` (Util은 `https://ant.design/components/util`).
- 데모마다 에러 경계(PreviewBoundary)로 감싼다.
- 참고 구현에서 옮겨 올 때 동작·주석(한국어)은 유지하고 Astryx 컴포넌트만 antd로 바꾼다.

## Review Focus

1. 검색어가 한글 일부(예: "날짜", "팝")일 때 한글 이름·설명·키워드 부분일치로 찾아져야 한다 → Task 4 테스트.
2. 즐겨찾기 가져오기에 잘못된 문자열(앞머리 없음, 없는 이름, 공백·쉼표 중복)을 넣으면 있는 이름만 합쳐지고 앱이 죽지 않아야 한다 → Task 6 테스트.
3. 폐지 속성만 있거나 필터 결과가 0개인 API 표는 "일치하는 속성이 없어요"를 보여야 한다 → Task 9 테스트.
4. message·notification·Modal처럼 함수로 띄우는 컴포넌트 데모는 jsdom 렌더에서 예외 없이 버튼만 그려야 한다 → Task 10~13 스모크 테스트가 커버.
5. 모바일 폭(≤ 768px)에서 사이드 메뉴가 Drawer로 바뀌고 메뉴 항목을 누르면 닫혀야 한다 → Task 8 테스트(Drawer 닫힘을 `onNavigate` 호출로 확인).

---

## File Structure

```
package.json, vite.config.ts, vitest.config.ts, tsconfig.json, index.html, .gitignore
.github/workflows/deploy.yml, README.md
scripts/fetch-api.ts            # 6.7.2 문서 받아 src/api/data/<slug>.json 생성
src/main.tsx                    # ConfigProvider(koKR) + App
src/App.tsx                     # 상단바·레이아웃·화면 선택
src/route.ts                    # parseHash / routeHash / routeLabel / useRoute
src/registry.ts                 # GROUPS, ENTRIES, BY_NAME, searchEntries, docsUrl
src/favorites.ts                # useFavorites, parseImport
src/api/parse.ts                # parseApiMarkdown
src/api/data/<slug>.json        # 생성물 (커밋)
src/api/slugs.ts                # SLUGS (스크립트와 앱 공유)
src/api/index.ts                # API_DOCS: Record<slug, ApiDoc> (import.meta.glob eager)
src/api-ko.ts                   # 주요 속성 한글 설명
src/demoTypes.ts                # Control, Values, Demo, s, b
src/demos.ts                    # DEMOS, defaultValues, buildCode
src/demos/general-layout.tsx, navigation-other.tsx, entry.tsx, display.tsx, feedback.tsx
src/components/Sidebar.tsx, Lists.tsx, FavTools.tsx, Detail.tsx, Playground.tsx, ApiTable.tsx, PreviewBoundary.tsx, shared.tsx
src/styles.css
tests/fixtures/button.en-US.md, select.en-US.md
tests/*.test.ts(x)
```

---

### Task 1: 프로젝트 뼈대 + 테스트 환경

**Files:**
- Create: `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig.json`, `index.html`, `.gitignore`, `src/main.tsx`, `src/App.tsx`(임시), `src/styles.css`, `tests/setup.ts`, `tests/smoke.test.tsx`

- [ ] **Step 1: git 저장소와 패키지 준비**

`git init -b main`. `package.json`은 참고 구현과 같은 scripts(`dev: vite --host`, `build: tsc --noEmit && vite build`, `preview`, `typecheck`) + `"test": "vitest run"`, `"fetch-api": "node scripts/fetch-api.ts"`.
`npm install antd@6.7.2 @ant-design/icons dayjs react@19 react-dom@19` 후 package.json의 antd를 `"6.7.2"`로 고정.
`npm install -D vite@7 @vitejs/plugin-react typescript@5 @types/react @types/react-dom vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`.
`.gitignore`: `node_modules`, `dist`.
tsconfig는 참고 구현 그대로 + `"types": ["vite/client", "vitest/globals", "@testing-library/jest-dom"]`, include에 `tests`.
`vitest.config.ts`: jsdom, globals, `setupFiles: ['tests/setup.ts']`. `tests/setup.ts`는 jest-dom 등록 + jsdom에 없는 `window.matchMedia`, `ResizeObserver`, `IntersectionObserver` 대체(antd 반응형·Splitter·Image가 사용).

- [ ] **Step 2: 실패하는 테스트 작성** — `tests/smoke.test.tsx`

```tsx
test('앱 제목이 보인다', () => {
  render(<Root />);
  expect(screen.getByText('Ant Design 둘러보기')).toBeInTheDocument();
});
```

- [ ] **Step 3: 실패 확인** — `npx vitest run tests/smoke.test.tsx` → FAIL (Root 없음)

- [ ] **Step 4: 구현** — `src/main.tsx`에서 `export function Providers({children})`(ConfigProvider locale=koKR + antd `App`)와 `export function Root()`(`<Providers><App/></Providers>`)를 내보내고 `createRoot`는 `document.getElementById('root')`가 있을 때만 실행. `App`은 지금은 제목 텍스트만. dayjs `ko` 로케일 설정. `index.html`은 참고 구현 그대로, title `Ant Design 컴포넌트 둘러보기`.

- [ ] **Step 5: 통과 확인** — `npm test` → PASS, `npm run build` → 성공

- [ ] **Step 6: 커밋** (설계·계획 문서 포함)

```bash
git add -A && git commit -m "프로젝트 뼈대와 테스트 환경"
```

---

### Task 2: API 마크다운 파서

**Files:**
- Create: `src/api/parse.ts`, `tests/fixtures/button.en-US.md`, `tests/fixtures/select.en-US.md`, `tests/parse.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type ApiRow = {prop: string; desc: string; type: string; default: string; version: string; deprecated: boolean};
  export type ApiSection = {section: string; rows: ApiRow[]};
  export type ApiDoc = {slug: string; title: string; group: string; sections: ApiSection[]};
  export function parseApiMarkdown(slug: string, md: string): ApiDoc
  ```

- [ ] **Step 1: 고정 자료 저장** — `https://raw.githubusercontent.com/ant-design/ant-design/6.7.2/components/{button,select}/index.en-US.md`를 `tests/fixtures/`에 저장.

- [ ] **Step 2: 실패하는 테스트 작성** — `tests/parse.test.ts`

```ts
const button = parseApiMarkdown('button', read('button.en-US.md'));
const select = parseApiMarkdown('select', read('select.en-US.md'));

test('머리말에서 제목과 그룹을 읽는다 (group 두 가지 표기 모두)', () => {
  expect(button).toMatchObject({title: 'Button', group: 'General'});   // group:\n  title: General
  expect(select).toMatchObject({title: 'Select', group: 'Data Entry'}); // group: Data Entry
});
test('소제목 없는 API 표는 제목 이름의 구역 하나', () => {
  expect(button.sections.map((s) => s.section)).toEqual(['Button']);
});
test('### 소제목별로 구역을 나눈다', () => {
  expect(select.sections.map((s) => s.section)).toEqual(
    expect.arrayContaining(['Select props', 'Select Methods', 'Option props', 'OptGroup props']));
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
test('Global Config 열이 있어도 다섯 열만 읽는다', () => {
  expect(row(button, 'block')).toEqual({prop: 'block', desc: 'Option to fit button width to its parent width', type: 'boolean', default: 'false', version: '', deprecated: false});
});
test('## API 구역 밖의 표는 무시', () => {
  const props = select.sections.flatMap((s) => s.rows.map((r) => r.prop));
  expect(props).not.toContain('Token Name');
});
```
(`row(doc, prop)`은 모든 구역에서 prop으로 찾는 테스트 내 도우미.)

- [ ] **Step 3: 실패 확인** — `npx vitest run tests/parse.test.ts` → FAIL

- [ ] **Step 4: 구현** — `## API` 줄부터 다음 `## `(두 개짜리) 전까지만 본다. `### ` 줄이 현재 구역 이름, 첫 표 전에 소제목이 없으면 구역 이름은 `title`. 표 머리 줄은 `| Property`(또는 `| Name`/`| Method` 등 첫 칸)로 시작하고 구분 줄(`| ---`)은 건너뛴다. 셀 분리는 `\|`를 임시 문자로 바꾼 뒤 `|`로 나누고 되돌린다. 정리: `[글자](주소)` → 글자, 백틱 제거, 앞뒤 공백 제거. 행이 없는 구역은 버린다.

- [ ] **Step 5: 통과 확인** → PASS

- [ ] **Step 6: 커밋** `git commit -m "API 문서 파서"`

---

### Task 3: API 데이터 받기 스크립트 + 생성

**Files:**
- Create: `scripts/fetch-api.ts`, `src/api/data/*.json`, `src/api/index.ts`

**Interfaces:**
- Consumes: `parseApiMarkdown` (Task 2) — 스크립트는 `import {parseApiMarkdown} from '../src/api/parse.ts'`
- Produces: `src/api/index.ts` → `export const API_DOCS: Record<string, ApiDoc>` (키는 slug), `export const SLUGS: string[]`

- [ ] **Step 1: 스크립트 작성** — `SLUGS`(아래 73개, `src/api/slugs.ts`에 두고 스크립트와 앱이 공유)마다 `https://raw.githubusercontent.com/ant-design/ant-design/6.7.2/components/<dir>/index.en-US.md`를 받아(`_util` 디렉터리 → slug `util`) 파싱해 `src/api/data/<slug>.json`에 들여쓰기 2로 저장. 받기 실패하면 slug를 출력하고 종료 코드 1.

slug 목록(공식 그룹):
- General: button, float-button, icon, typography
- Layout: divider, flex, grid, layout, masonry, space, splitter
- Navigation: anchor, breadcrumb, dropdown, menu, pagination, steps, tabs
- Data Entry: auto-complete, cascader, checkbox, color-picker, date-picker, form, input, input-number, mentions, radio, rate, select, slider, switch, time-picker, transfer, tree-select, upload
- Data Display: avatar, badge, calendar, card, carousel, collapse, descriptions, empty, image, list, listy, popover, qr-code, segmented, statistic, table, tag, timeline, tooltip, tour, tree
- Feedback: alert, drawer, message, modal, notification, popconfirm, progress, result, skeleton, spin, watermark
- Other: affix, app, border-beam, config-provider, util

- [ ] **Step 2: 실행** — `npm run fetch-api` → 73개 json 생성, 오류 없음.

- [ ] **Step 3: `src/api/index.ts`** — `import.meta.glob('./data/*.json', {eager: true, import: 'default'})`로 `API_DOCS` 구성.

- [ ] **Step 4: 실패할 수 있는 무결성 테스트** — `tests/api-data.test.ts`

```ts
test('73개 slug 모두 API 문서가 있다', () => {
  expect(SLUGS).toHaveLength(73);
  for (const s of SLUGS) expect(API_DOCS[s], s).toBeDefined();
});
test('Util·App·Icon 외에는 속성 표가 비어 있지 않다', () => {
  const EMPTY_OK = ['util', 'icon', 'app'];
  for (const s of SLUGS) if (!EMPTY_OK.includes(s)) expect(API_DOCS[s].sections.length, s).toBeGreaterThan(0);
});
```
실행 → 비어 있는 slug가 더 나오면 파서가 그 문서 형태를 놓친 것이므로 Task 2에 고정 자료+테스트를 추가해 고친다(EMPTY_OK를 늘려 덮지 말 것. 실제로 문서에 표가 없을 때만 추가).

- [ ] **Step 5: 통과 확인 후 커밋** `git commit -m "antd 6.7.2 API 데이터 생성"`

---

### Task 4: 컴포넌트 목록(registry) + 검색

**Files:**
- Create: `src/registry.ts`, `tests/registry.test.ts`

**Interfaces:**
- Consumes: `API_DOCS`, `SLUGS` (Task 3)
- Produces:
  ```ts
  export type Group = {id: string; label: string; en: string; hint: string};
  export type Entry = {name: string; slug: string; ko: string; desc: string; group: string; kw: string};
  export const GROUPS: Group[]; export const ENTRIES: Entry[]; export const BY_NAME: Record<string, Entry>;
  export function searchEntries(list: Entry[], query: string): Entry[];
  export function docsUrl(e: Entry): string;
  ```

GROUPS (순서 고정): `general` 통용 / General, `layout` 레이아웃 / Layout, `navigation` 내비게이션 / Navigation, `entry` 데이터 입력 / Data Entry, `display` 데이터 표시 / Data Display, `feedback` 피드백 / Feedback, `other` 기타 / Other. `name`은 API_DOCS의 `title`(예: `QRCode`, `Util`).

- [ ] **Step 1: 실패하는 테스트 작성**

```ts
test('73개, 이름·slug 중복 없음', () => {
  expect(ENTRIES).toHaveLength(73);
  expect(new Set(ENTRIES.map((e) => e.name)).size).toBe(73);
  expect(new Set(ENTRIES.map((e) => e.slug))).toEqual(new Set(SLUGS));
});
test('그룹은 공식 문서의 group과 일치', () => {
  for (const e of ENTRIES) expect(GROUPS.find((g) => g.id === e.group)!.en, e.name).toBe(API_DOCS[e.slug].group);
});
test('이름은 공식 문서 제목과 일치', () => {
  for (const e of ENTRIES) expect(e.name).toBe(API_DOCS[e.slug].title);
});
test('한글 이름·설명은 모두 채워짐', () => { for (const e of ENTRIES) { expect(e.ko).not.toBe(''); expect(e.desc).not.toBe(''); } });
test('검색: 한글 부분일치, 영문 대소문자 무시, 여러 단어는 모두 포함', () => {
  expect(searchEntries(ENTRIES, '날짜').map((e) => e.name)).toContain('DatePicker');
  expect(searchEntries(ENTRIES, 'datepicker').map((e) => e.name)).toEqual(['DatePicker']);
  expect(searchEntries(ENTRIES, '팝').map((e) => e.name)).toEqual(expect.arrayContaining(['Modal', 'Popover']));
  expect(searchEntries(ENTRIES, '   ')).toBe(ENTRIES);
});
test('docsUrl', () => {
  expect(docsUrl(BY_NAME.DatePicker)).toBe('https://ant.design/components/date-picker');
  expect(docsUrl(BY_NAME.Util)).toBe('https://ant.design/components/util');
});
```

- [ ] **Step 2: 실패 확인** → FAIL
- [ ] **Step 3: 구현** — 참고 구현 `registry.ts`의 `SOURCE` 행 방식(`[slug, ko, desc, kw]`)을 그룹별로. `name`/`group`은 직접 쓰지 말고 slug로 API_DOCS에서 읽어 그룹 en → id로 매핑. `searchEntries`는 참고 구현 그대로(검색 대상에 slug 추가).
- [ ] **Step 4: 통과 확인** → PASS
- [ ] **Step 5: 커밋** `git commit -m "컴포넌트 목록과 한글 검색"`

---

### Task 5: 주소 라우팅

**Files:**
- Create: `src/route.ts`, `tests/route.test.ts`

**Interfaces:**
- Consumes: `GROUPS`, `BY_NAME`
- Produces: `type Route = {view:'all'}|{view:'fav'}|{view:'group';id:string}|{view:'comp';name:string}`, `type ListRoute`, `parseHash(hash: string): Route`, `routeHash(r: ListRoute): string`, `routeLabel(r: ListRoute): string`, `useRoute(): Route`

- [ ] **Step 1: 실패하는 테스트** — `parseHash('#/c/Button')` → comp Button; `'#/c/Nope'`, `'#/g/nope'`, `''`, `'#/zzz'` → all; `'#/g/entry'` → group entry; `'#/fav'` → fav; `routeHash({view:'group',id:'entry'})` → `'#/g/entry'`; `routeLabel({view:'fav'})` → `'즐겨찾기'`, group → 그룹 label, all → `'전체'`.
- [ ] **Step 2: 실패 확인** → FAIL
- [ ] **Step 3: 구현** — 참고 구현 `App.tsx` 상단의 라우팅 코드를 그대로 옮김.
- [ ] **Step 4: 통과 확인 / Step 5: 커밋** `git commit -m "주소 라우팅"`

---

### Task 6: 즐겨찾기

**Files:**
- Create: `src/favorites.ts`, `tests/favorites.test.ts`

**Interfaces:**
- Produces: `useFavorites(): {favs: string[]; toggle(name: string): void; merge(names: string[]): void}`, `parseImport(text: string, known: Set<string>): string[]`, `exportText(favs: string[]): string` (→ `antd:A,B`)

- [ ] **Step 1: 실패하는 테스트**

```ts
test('토글은 저장되고 다시 불러와진다', () => { /* renderHook → toggle('Button') → localStorage[KEY] === '["Button"]' → 새 renderHook에서 favs ['Button'] */ });
test('깨진 저장값은 빈 목록', () => { localStorage.setItem(KEY, '{oops'); expect(renderHook(useFavorites).result.current.favs).toEqual([]); });
test('merge는 중복 없이 합친다', ...);
test('parseImport: 앞머리 있든 없든, 공백·빈칸·모르는 이름 무시', () => {
  const known = new Set(['Button', 'Table']);
  expect(parseImport('antd:Button, ,Table,Nope,Button', known)).toEqual(['Button', 'Table']);
  expect(parseImport('Button', known)).toEqual(['Button']);
  expect(parseImport('', known)).toEqual([]);
});
```
- [ ] **Step 2: 실패 확인 / Step 3: 구현** — 참고 구현 `favorites.ts` 그대로 + 키만 변경, `parseImport`/`exportText` 추가(참고 구현 `FavTools.tsx`의 파싱 로직을 여기로).
- [ ] **Step 4: 통과 확인 / Step 5: 커밋** `git commit -m "즐겨찾기"`

---

### Task 7: 데모 틀 (코드 생성·에러 경계)

**Files:**
- Create: `src/demoTypes.ts`, `src/demos.ts`, `src/components/PreviewBoundary.tsx`, `tests/demos-code.test.tsx`

**Interfaces:**
- Produces: `Control`, `Values`, `Demo`, `s`, `b` (참고 구현 `demoTypes.ts`와 같은 모양; `Demo.tag`는 `'Button'` 또는 `'Input.TextArea'`처럼 점 표기 허용), `DEMOS: Record<string, Demo>` (그룹 데모 파일들을 합침; 처음엔 빈 객체), `defaultValues(demo): Values`, `buildCode(demo, v): string`, `PreviewBoundary`
- `Demo`에 `noPreview?: string` 추가: 화면 미리보기 대신 보여줄 안내(예: Util). 이때 `code`는 필수.

- [ ] **Step 1: 실패하는 테스트**

```ts
const demo: Demo = {tag: 'Button', controls: [
  {kind: 'select', key: 'type', label: '종류', options: ['default', 'primary'], default: 'default'},
  {kind: 'bool', key: 'disabled', label: '비활성', default: false},
  {kind: 'text', key: 'children', label: '글자', default: '버튼'},
  {kind: 'number', key: 'count', label: '수', default: 0, min: 0, max: 9}], Preview: () => null};
test('기본값과 같은 속성은 생략, children은 자식으로', () => {
  expect(buildCode(demo, defaultValues(demo))).toBe(`import {Button} from 'antd';\n\n<Button>버튼</Button>`);
});
test('바꾼 속성만 적는다', () => {
  expect(buildCode(demo, {...defaultValues(demo), type: 'primary', disabled: true, count: 3, children: 'a"b'}))
    .toBe(`import {Button} from 'antd';\n\n<Button type="primary" disabled count={3}>a"b</Button>`);
});
test('점 표기 태그는 앞 이름만 import', () => {
  expect(buildCode({tag: 'Input.TextArea', controls: [], Preview: () => null}, {})).toBe(`import {Input} from 'antd';\n\n<Input.TextArea />`);
});
test('code가 있으면 그대로', ...);
test('PreviewBoundary는 자식 오류를 안내로 바꾼다', () => {
  const Boom = () => { throw new Error('펑'); };
  render(<PreviewBoundary><Boom /></PreviewBoundary>);
  expect(screen.getByText('이 속성 조합은 미리보기를 그리지 못했어요')).toBeInTheDocument();
  expect(screen.getByText('펑')).toBeInTheDocument();
});
```
- [ ] **Step 2: 실패 확인 / Step 3: 구현** — 참고 구현 `buildCode`에서: 기본값과 같으면 생략, `children` 키는 자식으로, 문자열 속성은 `"`를 `&quot;`로(자식 텍스트는 그대로), `extra` 유지. PreviewBoundary는 antd `Alert type="error"`.
- [ ] **Step 4: 통과 확인 / Step 5: 커밋** `git commit -m "데모 틀과 코드 생성"`

---

### Task 8: 화면 틀 (상단바·사이드 메뉴·목록·즐겨찾기 화면)

**Files:**
- Create: `src/components/Sidebar.tsx`, `src/components/Lists.tsx`, `src/components/FavTools.tsx`, `src/components/shared.tsx`, `tests/app.test.tsx`
- Modify: `src/App.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: Task 4~7 전부
- Produces: `CardList({entries, fav})`, `Sidebar({activeKey, favCount, open, onNavigate})`, `CopyButton({text, label})`, `copyText(text): Promise<boolean>`, `FavApi`. `Detail`은 Task 9에서 — 이 태스크에서는 상세 라우트에 이름만 보이는 임시 화면.

UI: antd `Layout`(Header 고정 + Sider) / 헤더에 ☰(`Button` + `MenuOutlined`, 모바일만), 제목 링크 `Ant Design 둘러보기`, `Input.Search allowClear placeholder="검색 (예: 날짜, 팝업, 표)"`, `Button` `★ {n}` → `#/fav`. 사이드는 `Menu`(전체 / ★ 즐겨찾기 / 7개 그룹 + 개수); `Grid.useBreakpoint()`로 md 미만이면 `Drawer` 안에 같은 `Menu`. 카드는 `Card size="small"`: 영문 이름(제목) + 한글 이름 + 설명 + 즐겨찾기 별(`StarFilled`/`StarOutlined`, `aria-label="즐겨찾기 추가|해제"`), 카드 전체가 `#/c/<Name>` 링크, `id="card-<Name>"`. 화면별 문구·스크롤 복귀는 참고 구현 `App.tsx` 그대로.

- [ ] **Step 1: 실패하는 테스트** (`window.location.hash`를 바꾸고 `hashchange`를 쏘는 도우미 사용)

```tsx
test('전체 화면은 7개 그룹 제목과 73개 카드', () => { render(<Root/>); expect(screen.getAllByTestId('card')).toHaveLength(73); });
test('검색하면 결과 수와 카드가 바뀐다', async () => { /* '날짜' 입력 → '검색 결과 N개' 보이고 DatePicker 카드 존재 */ });
test('그룹 화면', () => { go('#/g/feedback'); /* 피드백 제목 + 11개 카드 */ });
test('별을 누르면 즐겨찾기 화면에 나온다', async () => { /* Button 카드 별 클릭 → go('#/fav') → Button 카드 1개 */ });
test('즐겨찾기 가져오기', async () => { /* 입력칸에 'antd:Table,Nope' → 가져오기 → Table 카드 */ });
test('모바일: 메뉴 항목을 누르면 Drawer가 닫힌다', async () => { /* matchMedia를 모두 false로 → ☰ 클릭 → '피드백' 클릭 → 해시 '#/g/feedback' 그리고 Drawer 닫힘 */ });
```
- [ ] **Step 2: 실패 확인 / Step 3: 구현 / Step 4: 통과 확인**
- [ ] **Step 5: 눈으로 확인** — `npm run dev`로 데스크톱 폭과 375px 폭에서 상단바 고정, Drawer 동작 확인
- [ ] **Step 6: 커밋** `git commit -m "화면 틀: 상단바, 메뉴, 목록, 즐겨찾기"`

---

### Task 9: 상세 화면 (바로 해보기 + 속성 표)

**Files:**
- Create: `src/components/Detail.tsx`, `src/components/Playground.tsx`, `src/components/ApiTable.tsx`, `src/api-ko.ts`, `tests/detail.test.tsx`, `tests/api-ko.test.ts`
- Modify: `src/App.tsx` (임시 상세 → Detail)

**Interfaces:**
- Consumes: `API_DOCS`, `DEMOS`, `buildCode`, `defaultValues`, `BY_NAME`, `docsUrl`, `PreviewBoundary`, `CopyButton`
- Produces: `API_KO: Record<string /*slug*/, Record<string /*prop*/, string>>`, `ApiTable({doc}: {doc: ApiDoc})`, `Detail({name, fav, backHref, backLabel})`

상세 순서: ← 돌아가기 링크 / 영문 이름 + 한글 이름 + 그룹 Tag + 별 / 설명 / 「바로 해보기」(Playground: 미리보기 Card, 속성 조절 — bool→`Switch`, text→`Input`, number→`InputNumber`, select→`Select`, 코드 블록 + 복사; 데모 없으면 「아직 바로 해보기가 없어요」, `noPreview`면 그 안내 + 코드) / 「속성」(ApiTable) / 공식 문서 링크 `공식 문서(영문) ↗` 새 탭.
ApiTable: 구역마다 소제목 + antd `Table`(`pagination={false}`, `size="small"`, `scroll={{x: 'max-content'}}`), 열: 속성 / 설명 / 타입 / 기본값 / 버전. 설명은 `API_KO[slug][prop]`이 있으면 그것, 없으면 영문 + `Tag` 「영문」. 폐지 행은 맨 아래 + 속성 이름 취소선(`<del>`) + `Tag` 「폐지」. 표 위 `Input allowClear placeholder="속성 이름으로 찾기"` — 속성 이름 대소문자 무시 부분일치, 모든 구역에 적용, 결과 0개인 구역은 숨기고 전부 0개면 「일치하는 속성이 없어요」. 문서에 표가 없으면 「이 컴포넌트는 속성 표가 없어요. 공식 문서를 참고하세요.」

- [ ] **Step 1: 실패하는 테스트**

```tsx
test('Button 속성 표: 한글 설명 우선, 없는 건 영문 표시', () => {
  render(<ApiTable doc={API_DOCS.button} />);
  expect(screen.getByText(API_KO.button.type)).toBeInTheDocument();
  /* API_KO.button에 없는 속성 하나의 영문 desc와 '영문' 태그 존재 */
});
test('폐지 속성은 맨 아래, 폐지 표시', () => { /* 마지막 행에 iconPosition, '폐지' */ });
test('필터: 대소문자 무시, 0개면 안내', async () => {
  /* 'ICON' 입력 → icon, iconPlacement, iconPosition만 / 'zzz' → '일치하는 속성이 없어요' */
});
test('Select는 구역 소제목이 여러 개', () => { /* 'Select props', 'Option props' 보임 */ });
test('상세: 바로 해보기에서 속성을 바꾸면 코드가 바뀐다', async () => {
  /* vi.mock으로 DEMOS에 Button 데모(type select 컨트롤) 하나를 주입 → 「종류(type)」에서 primary 선택 → 코드 블록에 type="primary" */
});
test('상세: 공식 문서 링크', () => { /* href === 'https://ant.design/components/button', target _blank */ });
```
`tests/api-ko.test.ts`:
```ts
test('한글 설명이 붙은 속성은 실제 표에 있다', () => {
  for (const [slug, props] of Object.entries(API_KO))
    for (const p of Object.keys(props))
      expect(API_DOCS[slug].sections.some((s) => s.rows.some((r) => r.prop === p)), `${slug}.${p}`).toBe(true);
});
```
- [ ] **Step 2: 실패 확인 / Step 3: 구현** — 이 태스크에서 `API_KO`는 `button`만(type, size, shape, disabled, loading, icon, danger, block, href, onClick). 나머지는 Task 10~13에서 데모와 함께.
- [ ] **Step 4: 통과 확인 / Step 5: 375px 폭에서 표 가로 스크롤 눈으로 확인 / Step 6: 커밋** `git commit -m "상세 화면: 바로 해보기와 속성 표"`

---

### Task 10~13: 그룹별 데모 + 한글 속성 설명

공통 방식 (각 태스크 동일):

**Files:** `src/demos/<file>.tsx` 생성, `src/demos.ts`에 합치기, `src/api-ko.ts`에 해당 slug 추가, `tests/demos.smoke.test.tsx`(Task 10에서 생성, 이후 그대로 커버)

- 데모 키는 Entry `name`. 컴포넌트마다 미리보기 1개, 자주 쓰는 속성 3~6개를 컨트롤로. 고르는 기준: 공식 문서 API 표에서 화면이 눈에 띄게 바뀌는 것(type/variant, size, disabled, status, placement 등). 컨트롤 라벨은 한글(`종류(type)`처럼 괄호에 속성 이름).
- message·notification·Modal.confirm 등 함수형은 `App.useApp()`을 쓰는 버튼 데모(Task 1의 `Providers`가 antd `App`을 이미 감쌈).
- 오버레이(Modal, Drawer, Tour 등)는 `open`을 bool 컨트롤로 두지 말고 「열기」 버튼 + 내부 state.
- `API_KO`: 데모에 쓴 속성 + 자주 쓰는 것, 컴포넌트당 5~10개.
- Util: `noPreview` 안내 + `GetProp`/`GetProps`/`GetRef` 사용 코드. Icon: `@ant-design/icons` 아이콘 몇 개 + 코드 `import {SmileOutlined} from '@ant-design/icons'`.

- [ ] **Task 10 Step 1: 스모크 테스트 작성 (실패)** — `tests/demos.smoke.test.tsx`

```tsx
test.each(Object.entries(DEMOS))('%s 데모가 오류 없이 그려진다', (_name, demo) => {
  const spy = vi.spyOn(console, 'error');
  if (demo.noPreview) { expect(demo.code).toBeDefined(); return; }
  render(<Providers><demo.Preview v={defaultValues(demo)} /></Providers>);  // Providers: ConfigProvider+App만 감싼 테스트 도우미
  expect(spy).not.toHaveBeenCalled();
});
test('데모 키는 모두 실제 컴포넌트 이름', () => { for (const k of Object.keys(DEMOS)) expect(BY_NAME[k], k).toBeDefined(); });
```
(antd가 내는 경고 중 jsdom 때문에 생기는 것만 `tests/setup.ts`에서 걸러냄. 경고를 통째로 끄지 말 것.)

- **Task 10: 통용 + 레이아웃 + 기타** (`src/demos/general-layout.tsx`, `src/demos/other.tsx`) — Button, FloatButton, Icon, Typography, Divider, Flex, Grid, Layout, Masonry, Space, Splitter, Affix, App, BorderBeam, ConfigProvider, Util (16개)
- **Task 11: 내비게이션 + 피드백** (`src/demos/navigation-feedback.tsx`) — Anchor, Breadcrumb, Dropdown, Menu, Pagination, Steps, Tabs, Alert, Drawer, Message, Modal, Notification, Popconfirm, Progress, Result, Skeleton, Spin, Watermark (18개)
- **Task 12: 데이터 입력** (`src/demos/entry.tsx`) — 18개
- **Task 13: 데이터 표시** (`src/demos/display.tsx`) — 21개

각 태스크 단계:
- [ ] 데모 추가 전 스모크 테스트가 해당 이름들에 대해 아직 없음을 확인(`npx vitest run tests/demos.smoke.test.tsx` 이름 목록)
- [ ] 데모 + API_KO 작성
- [ ] `npm test` → 스모크·api-ko 테스트 PASS
- [ ] `npm run dev`로 그룹 화면 열어 각 상세의 미리보기·코드 복사 눈으로 확인
- [ ] 커밋 `git commit -m "<그룹> 데모"`

- [ ] **Task 13 마지막 Step: 완전성 테스트 추가** — `tests/demos.smoke.test.tsx`에

```ts
test('73개 컴포넌트 모두 데모가 있다', () => { for (const e of ENTRIES) expect(DEMOS[e.name], e.name).toBeDefined(); });
test('모든 컴포넌트에 한글 속성 설명이 있다 (표가 없는 것 제외)', () => {
  for (const e of ENTRIES) if (API_DOCS[e.slug].sections.length) expect(Object.keys(API_KO[e.slug] ?? {}).length, e.name).toBeGreaterThanOrEqual(5);
});
```
PASS 확인 후 커밋.

---

### Task 14: 배포·문서·최종 확인

**Files:**
- Create: `.github/workflows/deploy.yml` (참고 구현 그대로, `npm install` 뒤 `npm test` 단계 추가), `README.md`

README: 참고 구현 README 형식 — 소개(antd 6.7.2 기준), 기능(그룹·검색·즐겨찾기·바로 해보기·속성 표), 실행/테스트/배포, 「컴포넌트 추가·수정」(registry, demos, api-ko), 「antd 버전 올리기」(`scripts/fetch-api.ts`의 태그와 package.json 버전 변경 → `npm run fetch-api` → `npm test`).

- [ ] **Step 1:** 파일 작성
- [ ] **Step 2: 최종 확인** — `npm test`(전부 PASS), `npm run build`(성공), `npm run preview`로 빌드본에서 상세 하나 열어 확인
- [ ] **Step 3: 커밋** `git commit -m "배포 설정과 README"`
