import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/packing-list/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui': ['@mui/material', '@mui/icons-material'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
})