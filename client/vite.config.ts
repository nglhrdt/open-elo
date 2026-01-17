import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
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
          // Node modules
          if (id.includes('node_modules')) {
            // React core and ALL React-based libraries MUST be together
            if (
              id.includes('react') ||
              id.includes('redux') ||
              id.includes('@radix-ui') ||
              id.includes('@floating-ui') ||
              id.includes('use-sync-external-store') ||
              id.includes('use-callback-ref') ||
              id.includes('use-sidecar')
            ) {
              return 'react-vendor';
            }
            // Tanstack Query
            if (id.includes('@tanstack')) {
              return 'react-vendor';
            }
            // Charts - keep with React to avoid circular deps
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'react-vendor';
            }
            // Pure utility libraries only
            if (
              id.includes('clsx') ||
              id.includes('class-variance-authority') ||
              id.includes('tailwind-merge') ||
              id.includes('lucide-react') ||
              id.includes('qs')
            ) {
              return 'vendor';
            }
            // Everything else with React
            return 'react-vendor';
          }

          // Feature-based splitting for source code
          if (id.includes('/src/features/game/')) {
            return 'game-features';
          }
          if (id.includes('/src/features/league/')) {
            return 'league-features';
          }
          if (id.includes('/src/features/user/')) {
            return 'user-features';
          }
          if (id.includes('/src/features/user-ranking/')) {
            return 'ranking-features';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
