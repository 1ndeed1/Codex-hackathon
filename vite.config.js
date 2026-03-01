import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-stackexchange': {
        target: 'https://api.stackexchange.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-stackexchange/, '')
      }
    }
  }
})
