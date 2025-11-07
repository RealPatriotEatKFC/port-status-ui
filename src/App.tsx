/**
 * App 컴포넌트
 * 
 * 메인 애플리케이션 컴포넌트로, 전체 레이아웃을 구성합니다.
 * - 왼쪽: 장비 목록 (EquipmentList) - 토글 가능
 * - 오른쪽: 포트 그리드 (PortGrid)
 * - 반응형 레이아웃
 */

import { useState, useEffect } from 'react';
import EquipmentList from './components/EquipmentList';
import PortGrid from './components/PortGrid';
import { usePortStore } from './store/usePortStore';
import { useTranslation } from './hooks/useTranslation';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isDarkMode, toggleDarkMode, language, setLanguage } = usePortStore();
  const t = useTranslation();

  // 초기 로드 시 다크 모드 적용
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen overflow-hidden relative bg-gray-50 dark:bg-gray-900">
      {/* 왼쪽 사이드바: 장비 목록 */}
      <div
        className={`
          absolute left-0 top-0 h-full z-20
          transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <EquipmentList />
      </div>
      
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`
          absolute top-4 z-30 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-r-md
          p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300
          ${isSidebarOpen ? 'left-[320px]' : 'left-0'}
        `}
        title={isSidebarOpen ? t.sidebar.hide : t.sidebar.show}
      >
        {isSidebarOpen ? (
          // << 아이콘 (숨기기)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          // >> 아이콘 (보이기)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* 언어 변경 버튼 */}
      <button
        onClick={() => setLanguage(language === 'ko' ? 'en' : 'ko')}
        className="absolute top-4 right-20 z-30 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm font-medium"
        title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
      >
        {language === 'ko' ? 'EN' : '한'}
      </button>

      {/* 다크 모드 토글 버튼 */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md p-2 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
        title={isDarkMode ? t.darkMode.toggleLight : t.darkMode.toggle}
      >
        {isDarkMode ? (
          // 태양 아이콘 (라이트 모드로 전환)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          // 달 아이콘 (다크 모드로 전환)
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>
      
      {/* 오른쪽 메인 영역: 포트 그리드 */}
      <div className="flex-1 w-full">
        <PortGrid isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  );
}

export default App;
