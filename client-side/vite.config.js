import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/user": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/image": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/post": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/post-image": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:3000",
        secure: false,
      },
      "/comment": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [react()],
});
