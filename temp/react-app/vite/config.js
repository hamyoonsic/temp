import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 🆕 이 줄 추가! (외부 접속 허용)
    port: 5173,
    // 개발 환경에서만 프록시 사용 (React dev server와 Spring이 다른 포트일 때)
    proxy: {
      '/v1/api': {
        target: 'http://172.20.80.224:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    // 빌드 결과물을 Spring의 static 폴더로 출력
    outDir: '../app-api/src/main/resources/static',
    emptyOutDir: true,
  },
})