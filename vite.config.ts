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
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@stores': path.resolve(__dirname, 'src/stores'),
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
