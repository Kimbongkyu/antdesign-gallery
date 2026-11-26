import * as matchers from '@testing-library/jest-dom/matchers';
import {cleanup} from '@testing-library/react';

// jest-dom/vitest 진입점은 vitest 5에서 매처가 등록되지 않아 직접 등록한다.
expect.extend(matchers);

afterEach(() => cleanup());

// jsdom에 없는 브라우저 API. antd의 반응형(Grid)·Splitter·Image 등이 사용한다.
// 기본은 데스크톱 폭처럼 모든 미디어 쿼리가 맞는 것으로 둔다.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: (query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
for (const name of ['ResizeObserver', 'IntersectionObserver'] as const) {
  if (!(name in window)) Object.defineProperty(window, name, {writable: true, configurable: true, value: NoopObserver});
}
