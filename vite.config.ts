import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const useLocalAPI = process.env.NODE_ENV === 'development' && process.argv.includes('--local');
console.log('Using local API:', useLocalAPI);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    '__API_URL__': JSON.stringify(useLocalAPI ? 'http://localhost:8080/' : 'https://simpl-api-ca96d9ccde88.herokuapp.com/')
  }
});
