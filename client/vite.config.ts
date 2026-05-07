import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig } from 'vite'
import type { PluginOption } from 'vite'

const plugins = [react(), tailwindcss()] as unknown as PluginOption[]

// https://vite.dev/config/
export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Put all node_modules in one vendor chunk to avoid circular dependencies
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // Feature-based splitting for source code only
          if (id.includes('/src/components/')) {
            return 'shared-components';
          }
          if (id.includes('/src/features/match/')) {
            return 'match-features';
          }
          if (id.includes('/src/features/league/')) {
            return 'league-features';
          }
          if (id.includes('/src/features/user/')) {
            return 'user-features';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
