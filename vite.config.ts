import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // 确保构建输出到正确的目录，与tauri.conf.json中的frontendDist一致
  build: {
    outDir: 'build',
  },
  // 防止Vite清除控制台
  clearScreen: false,
  // 在开发模式下启用Tauri的热重载
  server: {
    strictPort: true,
  },
});
