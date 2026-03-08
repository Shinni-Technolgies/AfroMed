import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 3000;
  const srcPath = path.resolve(__dirname, 'src');

  return {
    base: API_URL,
    server: {
      open: true,
      port: PORT,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BACKEND_URL || 'http://localhost:8080',
          changeOrigin: true,
        },
      },
    },
    preview: {
      open: true,
      host: true,
      fs: {
        allow: ['..']
      }
    },
    define: {
      global: 'window'
    },
    resolve: {
      alias: {
        '@ant-design/icons': path.resolve(__dirname, 'node_modules/@ant-design/icons'),
        assets: path.resolve(srcPath, 'assets'),
        components: path.resolve(srcPath, 'components'),
        contexts: path.resolve(srcPath, 'contexts'),
        data: path.resolve(srcPath, 'data'),
        hooks: path.resolve(srcPath, 'hooks'),
        layout: path.resolve(srcPath, 'layout'),
        'menu-items': path.resolve(srcPath, 'menu-items'),
        pages: path.resolve(srcPath, 'pages'),
        routes: path.resolve(srcPath, 'routes'),
        sections: path.resolve(srcPath, 'sections'),
        themes: path.resolve(srcPath, 'themes'),
        types: path.resolve(srcPath, 'types'),
        utils: path.resolve(srcPath, 'utils'),
        api: path.resolve(srcPath, 'api'),
        config: path.resolve(srcPath, 'config')
      }
    },
    plugins: [react()],
    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            const ext = name.split('.').pop();
            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
            return `assets/[name]-[hash].${ext}`;
          }
          // manualChunks: { ... } // Add if you want custom chunk splitting
        }
      },
      // Only drop console/debugger in production
      ...(mode === 'production' && {
        esbuild: {
          drop: ['console', 'debugger'],
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      })
      // No need to set build.target unless you need to support older browsers
      // target: 'baseline-widely-available', // This is now the default
    },
    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});
