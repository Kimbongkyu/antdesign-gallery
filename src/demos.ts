import type {Demo, Values} from './demoTypes';
import {GENERAL_LAYOUT_OTHER} from './demos/general-layout-other';
import {NAVIGATION_FEEDBACK} from './demos/navigation-feedback';

export type {Control, Demo, Values} from './demoTypes';

export const DEMOS: Record<string, Demo> = {...GENERAL_LAYOUT_OTHER, ...NAVIGATION_FEEDBACK};

export function defaultValues(demo: Demo): Values {
  return Object.fromEntries(demo.controls.map((c) => [c.key, c.default]));
}

// 기본값에서 바꾼 속성만 코드에 적는다. children 키는 자식 글자로.
export function buildCode(demo: Demo, v: Values): string {
  if (demo.code) return demo.code(v);
  const parts: string[] = [];
  let children = '';
  for (const c of demo.controls) {
    const val = v[c.key];
    if (c.key === 'children') {
      children = String(val ?? '');
      continue;
    }
    if (val === undefined || val === c.default) continue;
    if (c.kind === 'bool') parts.push(val === true ? c.key : `${c.key}={false}`);
    else if (c.kind === 'number') parts.push(`${c.key}={${val}}`);
    else parts.push(`${c.key}="${String(val).replace(/"/g, '&quot;')}"`);
  }
  if (demo.extra) parts.push(demo.extra);
  const attrs = parts.length ? ` ${parts.join(' ')}` : '';
  const importLine = `import {${demo.tag.split('.')[0]}} from 'antd';`;
  const jsx = children ? `<${demo.tag}${attrs}>${children}</${demo.tag}>` : `<${demo.tag}${attrs} />`;
  return `${importLine}\n\n${jsx}`;
}
