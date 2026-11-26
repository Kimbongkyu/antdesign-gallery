import type {ReactNode} from 'react';

// 속성 조절 패널에 나오는 항목
export type Control =
  | {kind: 'text'; key: string; label: string; default: string}
  | {kind: 'bool'; key: string; label: string; default: boolean}
  | {kind: 'select'; key: string; label: string; options: string[]; default: string}
  | {kind: 'number'; key: string; label: string; default: number; min: number; max: number; step?: number};

export type Values = Record<string, string | boolean | number>;

export type Demo = {
  tag: string; // 코드 복사에 쓰는 JSX 태그 ('Button', 'Input.TextArea')
  controls: Control[]; // 비어 있으면 속성 조절 패널을 숨긴다
  Preview: (props: {v: Values}) => ReactNode;
  extra?: string; // 상태(value/onChange)처럼 코드에만 붙는 속성
  code?: (v: Values) => string; // 기본 코드 생성이 맞지 않을 때 복사할 코드를 직접 지정
  note?: string; // 화면에 보여줄 짧은 안내
  noPreview?: string; // 미리보기 대신 보여줄 안내 (이때 code 필수)
};

export const s = (x: string | boolean | number): string => String(x);
export const b = (x: string | boolean | number): boolean => x === true;
