# Ant Design 컴포넌트 둘러보기 — 설계

## 목적
개발 중 필요한 Ant Design 컴포넌트를 한글로 바로 찾아보고, 생김새·속성을 확인하고, 코드를 복사해 쓰는 개인용 참조 사이트.
공식 사이트(ant.design/components/overview)는 영문이라 찾기가 느리다. 이미 만든 `astryx-gallery`와 같은 사용 경험을 Ant Design에 적용한다.

## 목표
- antd **6.7.2** 기준, 공식 overview의 그룹 분류를 그대로 따른다.
- astryx-gallery와 같은 기능: 그룹별 둘러보기, 한글/영문/키워드 검색, 즐겨찾기(localStorage + 복사/가져오기), 상세 화면의 「바로 해보기」(속성 조절 + 코드 복사), 모바일 대응, GitHub Pages 배포.
- 갤러리 UI 자체도 antd로 만든다.
- TDD: 로직과 "모든 컴포넌트 데모가 깨지지 않고 그려진다"를 테스트로 보장한다.

## 하지 않는 것
- 모든 속성의 한글 번역 — 자주 쓰는 속성만 한글, 나머지는 공식 영문 설명 그대로.
- 공식 문서처럼 컴포넌트마다 예제 여러 개.
- 다크 모드/테마 편집기, 다국어 전환, 서버·로그인.

## 실패로 보는 것
- 공식과 그룹·이름이 달라 공식 문서와 대조하기 어려운 것.
- 데모 하나가 깨져서 화면 전체가 하얗게 되는 것.

## 접근 방식
1. **astryx-gallery 구조를 그대로 옮기고 UI를 antd로 바꾼다 (선택)** — 이미 검증된 구조(registry / demos / favorites / # 라우팅)라 사용자가 같은 감각으로 쓴다. 코드 대부분이 같은 모양이다.
2. 공식 문서의 데모 소스를 가져와 렌더 — 예제는 풍부하지만 영문이고, 6.7.2 문서 소스를 끌어오는 빌드 파이프라인이 필요해 무겁다.
3. 정적 스크린샷 + 코드 조각 — 가볍지만 「바로 해보기」가 없어 목적에 미달.

1번을 고른 이유: 이미 쓰는 도구와 같은 경험, 가장 적은 새 코드.

## 결정한 내용
- **스택**: Vite + React 19 + TypeScript + antd 6.7.2 + @ant-design/icons, `ConfigProvider locale={koKR}`. 테스트는 Vitest + @testing-library/react + jsdom.
- **그룹 (공식 순서)**: 통용(General), 레이아웃(Layout), 내비게이션(Navigation), 데이터 입력(Data Entry), 데이터 표시(Data Display), 피드백(Feedback), 기타(Other).
- **컴포넌트 목록**: 공식 overview 페이지에 나오는 컴포넌트(약 70개). 6.7.2 패키지 폴더 기준으로 확인한 후보:
  affix alert anchor app auto-complete avatar badge border-beam breadcrumb button calendar card carousel cascader checkbox collapse color-picker config-provider date-picker descriptions divider drawer dropdown empty flex float-button form grid(row/col) image input input-number layout list masonry mentions menu message modal notification pagination popconfirm popover progress qr-code radio rate result segmented select skeleton slider space spin splitter statistic steps switch table tabs tag time-picker timeline tooltip tour transfer tree tree-select typography upload watermark (+ Icon은 @ant-design/icons)
  `back-top`(폐지), `qrcode`(중복 별칭), `_util`/`style`/`theme`/`locale`/`version`은 제외. `listy`는 overview에 있을 때만.
- **registry.ts**: `[이름, 한글 이름, 한글 설명, 검색 키워드]` + 공식 문서 slug. 공식 문서 링크는 `https://ant.design/components/<slug>`.
- **상세 화면**: 한글 이름·설명·그룹 → 「바로 해보기」(미리보기 + 속성 조절 + 코드 복사) → 속성(API) 표 → 공식 문서 링크.
- **속성(API) 표 — 자동 추출 + 주요 속성 한글** (사용자 선택):
  - 원본: antd 저장소 `components/<slug>/index.en-US.md` (태그 `6.7.2`)의 `## API` 구역. `### 소제목`(예: Select props, Option props, Select Methods)별로 표가 나뉜다.
  - `scripts/fetch-api` 스크립트가 원본을 받아 표를 파싱해 `src/api/<slug>.json`으로 저장하고, **결과 파일을 커밋**한다. 빌드·실행 시 네트워크 불필요. antd 버전을 올릴 때만 태그를 바꿔 다시 실행.
  - 저장 형태: `{section: string, rows: {prop, desc, type, default, version, deprecated}[]}[]`. `~~iconPosition~~`처럼 취소선 속성은 `deprecated: true`.
  - 한글 설명: `src/api-ko.ts`에 `{slug: {prop: '한글 설명'}}`. 컴포넌트당 자주 쓰는 5~10개. 한글이 없으면 영문 설명을 보여주고 「영문」 표시.
  - 화면: 속성·설명·타입·기본값·버전 열. 폐지 속성은 취소선 + 맨 아래. 표 위에 속성 이름 필터 입력칸. 모바일은 가로 스크롤.
  - 마크다운 안의 링크·백틱은 글자만 남기고 단순 표시(공식 링크는 따로 있음).
- **바로 해보기**: 모든 컴포넌트에 최소 1개 미리보기. 속성 조절은 자주 쓰는 속성(type, size, disabled 등)만. App·ConfigProvider처럼 눈에 보이는 게 적은 것은 코드 예시 위주.
- **데모 격리**: 데모마다 에러 경계로 감싸 하나가 깨져도 나머지는 보인다.
- **레이아웃**: 상단 고정 헤더(로고·검색·즐겨찾기 수) + 왼쪽 Menu(그룹). 모바일은 ☰ → Drawer.
- **라우팅**: `#/`, `#/g/<그룹>`, `#/c/<컴포넌트>`, `#/fav`. 상세에서 돌아오면 보던 카드 위치로 스크롤.
- **즐겨찾기 저장 키**: `antd-gallery:favorites:v1`.
- **배포**: astryx-gallery의 `.github/workflows/deploy.yml` 재사용. vite `base: './'`(# 라우팅이라 저장소 이름과 무관하게 동작).

## 테스트 범위 (TDD)
- `searchEntries`: 한글·영문·키워드·대소문자, 빈 검색어.
- `parseHash`: 각 경로와 잘못된 경로 → 전체.
- `favorites`: 토글, 합치기, 깨진 localStorage 값.
- `buildCode`: 기본값은 생략, 바꾼 속성만 코드에 반영.
- API 마크다운 파서: 실제 Button·Select 문서를 고정 자료(fixture)로 — 소제목 구분, 셀 안의 `\|` 이스케이프, 취소선 → deprecated, 열 개수가 다른 표(Global Config 열 유무), API 구역 밖의 표 무시.
- API 데이터 무결성: 모든 레지스트리 항목에 API json이 있고 비어 있지 않음(Util 같은 예외는 명시). `api-ko`의 속성 이름이 실제 표에 존재.
- 레지스트리 무결성: 모든 항목에 데모가 있고 그룹이 유효하고 이름이 중복되지 않음.
- 스모크: 모든 데모가 jsdom에서 에러 없이 렌더.

## 빌더에게 맡기는 것
- 각 컴포넌트의 한글 설명·키워드 문구, 데모별 속성 선택.
- 파일 분할 방식(astryx-gallery처럼 그룹별 demos 파일 권장).
