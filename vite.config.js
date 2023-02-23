import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
  },
  assetsInclude: ['**/*.gltf'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
      '⚙️': path.resolve(__dirname, './src/engine'),
      'public': path.resolve(__dirname, './public'),
    }
  }
})
