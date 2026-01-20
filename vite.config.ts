import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin to inject CSS into JS bundle
    {
      name: 'inject-css',
      apply: 'build',
      enforce: 'post',
      generateBundle(_, bundle) {
        let cssCode = '';

        // Find and extract CSS
        for (const [fileName, chunk] of Object.entries(bundle)) {
          if (fileName.endsWith('.css') && chunk.type === 'asset') {
            cssCode = chunk.source as string;
            // Remove the CSS file from bundle - we'll inject it
            delete bundle[fileName];
          }
        }

        if (!cssCode) return;

        // Inject CSS into JS files
        for (const chunk of Object.values(bundle)) {
          if (chunk.type === 'chunk' && chunk.isEntry) {
            // Create CSS injection code
            const cssInjection = `
(function() {
  if (typeof document !== 'undefined') {
    var style = document.createElement('style');
    style.setAttribute('data-pimo-player', '');
    style.textContent = ${JSON.stringify(cssCode)};
    document.head.appendChild(style);
  }
})();
`;
            chunk.code = cssInjection + chunk.code;
          }
        }
      }
    }
  ],
  build: {
    lib: {
      // Entry point for the library
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'PimoPlayer',
      // Generate ESM and CJS outputs
      fileName: (format) => `pimo-player.${format}.js`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
    // Don't split CSS - we want it all together
    cssCodeSplit: false,
  },
})
