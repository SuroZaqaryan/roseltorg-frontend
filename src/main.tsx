import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import theme from './theme/theme.ts';
import './shared/styles/main.scss'
import App from './app/App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={ruRU} theme={theme}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
