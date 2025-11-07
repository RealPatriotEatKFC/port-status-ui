/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // 클래스 기반 다크 모드
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 포트 상태별 색상
        'port-normal': '#10b981',      // 정상 - 초록색
        'port-unused': '#6b7280',      // 미사용 - 회색
        'port-check': '#f59e0b',       // 점검필요 - 주황색
      },
    },
  },
  plugins: [],
}

