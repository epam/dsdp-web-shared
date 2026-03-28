import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  build: {
    outDir: 'build', // CRA's default build output
  },
  define: {
    global: 'window',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.jsx',
    server: {
      deps: {
        inline: [
          'reapop',
          'react-transition-group',
          '@material-ui/core/styles',
          '@material-ui/core',
        ],
      },
    },
        coverage: {
          exclude: ['**/build/**', ...coverageConfigDefaults.exclude],
          reporter: ['lcovonly', 'text-summary']
        }
  },
  resolve: {
    // This is still important for monorepos
    dedupe: ['react', 'react-dom'],
    alias: {
      '#web-components': resolve(__dirname, '../web-components/src'),
      '#shared': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls', 'abs-percent'],
      },
    },
  },
});
