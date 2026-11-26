// 자주 쓰는 속성의 한글 설명. {slug: {속성: 설명}}. 없는 속성은 공식 영문 설명을 보여준다.
// 속성 이름은 src/api/data/<slug>.json 에 있어야 한다 (tests/api-ko.test.ts 가 확인).
export const API_KO: Record<string, Record<string, string>> = {
  button: {
    type: '버튼 종류(간편 지정). variant·color를 주면 그것을 따른다',
    variant: '버튼 모양: outlined, dashed, solid, filled, text, link',
    color: '버튼 색: default, primary, danger 또는 기본 색 이름',
    size: '크기: large, medium, small',
    shape: '모양: default, circle(원), round(둥근 모서리)',
    disabled: '비활성(누를 수 없음)',
    loading: '로딩 중 표시. { delay } 로 지연 가능',
    icon: '버튼에 넣을 아이콘',
    danger: '위험(빨간색) 버튼으로 표시',
    block: '부모 너비에 꽉 차게',
    href: '링크 주소. 주면 <a> 로 그려진다',
    onClick: '눌렀을 때 실행할 함수',
  },
};
