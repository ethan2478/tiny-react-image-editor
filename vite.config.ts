import react from '@vitejs/plugin-react'
import { defineConfig, UserConfig } from 'vite'

const commonConfig: UserConfig = {
  css: {
    modules: {
      // [name] = 文件名; [local] = 原始类名; [hash:base64:5] = 5位 hash
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'web') {
    return {
      base: './',
      plugins: [react()],
      ...commonConfig
    }
  }

  if (mode === 'lib') {
    return {
      build: {
        outDir: 'lib',
        lib: {
          entry: './src/ImageEditor/index.tsx',
          formats: ['es', 'cjs'],
          fileName: format => `index.${format}.js`
        },
        rollupOptions: {
          external: ['react', 'react-dom']
        }
      },
      plugins: [
        react({
          jsxRuntime: 'classic'
        })
      ],
      ...commonConfig
    }
  }

  return {
    plugins: [react()],
    ...commonConfig
  }
})
