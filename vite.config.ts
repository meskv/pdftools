import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';
export default defineConfig({base:'/',plugins:[react(),VitePWA({registerType:'autoUpdate',
 manifest:{name:'PDF Tools',short_name:'PDF Tools',theme_color:'#3b5bdb',background_color:'#3b5bdb',icons:[{src:'icon.svg',sizes:'any',type:'image/svg+xml'}]},
 workbox:{maximumFileSizeToCacheInBytes:6e6,globPatterns:['**/*.{js,css,html,svg,wasm,webmanifest}'],cleanupOutdatedCaches:true,navigateFallback:'index.html'}})]});
