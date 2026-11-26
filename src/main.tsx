import {StrictMode, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {App as AntApp, ConfigProvider} from 'antd';
import koKR from 'antd/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {App} from './App';
import './styles.css';

dayjs.locale('ko');

// 한글 로케일 + antd App(message·notification·modal 훅 제공)
export function Providers({children}: {children: ReactNode}) {
  return (
    <ConfigProvider locale={koKR}>
      <AntApp>{children}</AntApp>
    </ConfigProvider>
  );
}

export function Root() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

const el = document.getElementById('root');
if (el) {
  createRoot(el).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
}
