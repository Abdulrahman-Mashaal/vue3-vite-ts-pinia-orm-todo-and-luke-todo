import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import eslintPLugin from "vite-plugin-eslint"
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [vue(), eslintPLugin()],
  define: {
    __VUE_OPTIONS_API__: false,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    // Add other necessary flags here (consult Vue docs)
  },
})
