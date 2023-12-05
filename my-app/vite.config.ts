import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://0.0.0.0:7000',
    }
  },
  base: "/InternetApps_5sem_Frontend/",
  plugins: [react()]
})