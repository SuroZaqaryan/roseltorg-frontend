import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  publicDir: 'public',
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true, 
  },
  build: {
    assetsDir: 'static',
    outDir: 'build', // Папка для сборки
    rollupOptions: {
      output: {
        manualChunks: {
          antd: ['antd'],
          recharts: ['recharts']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@theme': path.resolve(__dirname, 'src/theme'),
      '@stores': path.resolve(__dirname, 'src/shared/stores'),
      '@types': path.resolve(__dirname, 'src/shared/types'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
    modules: {
      generateScopedName: '[local]_[hash:base64:1]',
    },
    devSourcemap: true,
  },
})
