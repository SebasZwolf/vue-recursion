import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  build : {
    // lib : {
    //   entry : 'src/index.ts',
    //   name: 'index',
    //   fileName: 'index',
    // },
    lib: {
      entry: "src/index.ts",
      name : "VueRecursion",
      formats: ["es", "cjs"],
      fileName: f => `index.${f === "cjs" ? "cjs" : "esm"}.js`
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
  plugins: [vue({}), dts({
    insertTypesEntry : true,
    // rollupTypes : true,
  })],
  root: command === "serve" ? path.resolve(__dirname, "example/") : undefined
}))

console.log(path.resolve(__dirname, "example/"))

import path from 'node:path'