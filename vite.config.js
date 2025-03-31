import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { SourceMapConsumer } from 'source-map';
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',   // เปิดให้ฟังทุก IP
    port: 2024,        // เลือกพอร์ตที่ต้องการ
    hmr: {
      overlay: false
    },
    logLevel: 'error', // แสดงเฉพาะข้อผิดพลาดที่สำคัญ
  },
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@tailwindConfig': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    exclude: [
      'path', // Exclude Node.js built-in modules
      'fs',   // Exclude filesystem module
      'url',  // Exclude URL module
      'source-map' // Exclude source-map-js
    ],
    include: [
      '@tailwindConfig',
      
    ]
  }, 
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
})
