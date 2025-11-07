import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 초기 다크 모드 적용 (localStorage에서 복원)
const savedDarkMode = localStorage.getItem('port-status-storage');
if (savedDarkMode) {
  try {
    const parsed = JSON.parse(savedDarkMode);
    if (parsed.state?.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {
    // 파싱 실패 시 무시
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
