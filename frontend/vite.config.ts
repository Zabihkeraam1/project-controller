import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This binds the server to all available network interfaces
    port: 5173,        // Optional: Specify the port, default is 3000
    strictPort: true   // Optional: If true, will fail if the port is already in use
  }
})
