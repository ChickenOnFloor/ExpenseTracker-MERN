import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  darkMode: 'class',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Now @ points to src folder
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend server
        changeOrigin: true,
        secure: false,
      },
    }
  },
})
