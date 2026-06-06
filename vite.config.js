import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` makes Vite emit asset URLs that work under the GitHub Pages project path
// (https://Shadi-1.github.io/alulu-frontend/). Without this, the bundle's
// `/assets/...` paths would 404 on Pages.
export default defineConfig({
  plugins: [react()],
  base: '/alulu-frontend/',
})
