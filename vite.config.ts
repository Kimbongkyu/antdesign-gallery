import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// base './' : GitHub Pages 하위 경로와 로컬 어디서든 같은 빌드가 동작한다(# 라우팅).
export default defineConfig({
  base: './',
  plugins: [react()],
});
