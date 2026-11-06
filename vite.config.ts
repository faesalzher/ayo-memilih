import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three',
              test: /node_modules[\\/]three[\\/]/,
              maxSize: 450_000,
            },
            {
              name: 'react-three',
              test: /node_modules[\\/]@react-three[\\/]/,
              maxSize: 450_000,
            },
            {
              name: 'gsap',
              test: /node_modules[\\/]gsap[\\/]/,
            },
          ],
        },
      },
    },
  },
})
