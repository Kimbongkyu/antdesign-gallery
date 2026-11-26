# Ant Design 컴포넌트 둘러보기

[Ant Design](https://ant.design/components/overview) **6.7.2** 컴포넌트 73개를 공식 그룹별로 찾고, 한글로 검색하고, 즐겨찾기하고, 바로 속성을 바꿔 보고, 속성(API) 표를 확인하는 갤러리입니다. 모바일에서도 쓸 수 있습니다.

- 그룹(공식 분류): 통용, 레이아웃, 내비게이션, 데이터 입력, 데이터 표시, 피드백, 기타
- 검색: 한글 이름, 영문 이름, 설명, 키워드 (여러 단어는 모두 포함)
- 즐겨찾기: 브라우저(localStorage)에 저장. 폰↔PC 이동은 「즐겨찾기」 화면의 복사/가져오기 사용
- 바로 해보기: 73개 전부. 속성 조절 + 코드 복사
- 속성 표: 공식 6.7.2 문서에서 뽑은 속성·타입·기본값·버전. 자주 쓰는 속성은 한글 설명, 나머지는 영문(「영문」 표시). 폐지 속성은 맨 아래에 취소선

## 실행

```bash
npm install
npm run dev      # 같은 Wi-Fi의 폰에서도 http://PC주소:5173 으로 접속
npm test         # 테스트
npm run build
```

## 배포 (GitHub Pages)

1. 저장소 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 설정
2. `main` 에 푸시하면 `.github/workflows/deploy.yml` 이 테스트·빌드 후 배포

## 컴포넌트 추가·수정

- 목록·한글 이름·설명·검색 키워드: `src/registry.ts`
- 바로 해보기: `src/demos/*.tsx` (그룹별 파일). 속성 이름은 상세 화면의 속성 표에서 확인
- 속성 한글 설명: `src/api-ko.ts` (없는 속성 이름을 쓰면 테스트가 실패해요)

## antd 버전 올리기

1. `package.json` 의 `antd` 버전과 `src/api/slugs.ts` 의 `ANTD_TAG` 를 새 버전으로 변경
2. `npm install` 후 `npm run fetch-api` (Node 22.18 이상: .ts 를 바로 실행) — 새 버전 문서에서 `src/api/data/*.json` 을 다시 만든다
3. `npm test` — 폐지된 속성을 쓰는 데모(antd 경고)나 사라진 속성의 한글 설명이 있으면 실패하니 고친다
