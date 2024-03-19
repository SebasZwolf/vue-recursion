import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build : {
    lib : {
      entry : resolve(__dirname, 'src/index.ts'),
      name: 'zwolf-components',
      fileName: 'zwolf-components',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    }
  },
  plugins: [vue(), dts({
    insertTypesEntry : true,
  })],

})
