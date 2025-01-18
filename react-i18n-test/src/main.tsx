import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import zhCN from './locales/zh-CN.json'
import enUS from './locales/en-US.json'
import { IntlProvider } from 'react-intl'


const message: Record<string, Record<string, string>> = {
  'en-US': enUS,
  'zh-CN': zhCN
}

const locale = navigator.language

createRoot(document.getElementById('root')!).render(
  <IntlProvider messages={message[locale]} locale={locale}>
    <App />
  </IntlProvider>
)
