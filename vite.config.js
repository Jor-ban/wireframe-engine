import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  plugins: [
      vue(),
      dts({
        tsconfigPath: 'tsconfig.json',
      }),
  ],
  assetsInclude: ['**/*.gltf'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
      '⚙️': path.resolve(__dirname, './src/engine'),
      'public': path.resolve(__dirname, './public'),
    }
  }
})
