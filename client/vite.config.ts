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
            // React core - MUST be first to avoid multiple instances
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'react-vendor';
            }
            // React ecosystem libraries that depend on React
            if (id.includes('react-router') || id.includes('react-redux') || id.includes('react-is')) {
              return 'react-vendor';
            }
            // Tanstack Query
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            // Charts and related dependencies
            if (id.includes('recharts') || id.includes('redux')) {
              return 'ui-vendor';
            }
            // Other node modules
            return 'vendor';
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
    chunkSizeWarningLimit: 600,
  },
})
