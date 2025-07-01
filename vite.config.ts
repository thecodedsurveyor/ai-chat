import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		viteStaticCopy({
			targets: [
				{
					src: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs',
					dest: 'assets',
					rename: 'pdf.worker.min.js',
				},
			],
		}),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'favicon.ico',
				'robots.txt',
				'apple-touch-icon.png',
				'icon-192x192.png',
				'icon-512x512.png',
				'icon-512x512-mask.png',
			],
			manifest: {
				name: 'NeuronFlow',
				short_name: 'NeuronFlow',
				description:
					'AI-powered conversational platform with voice, offline mode, and more',
				theme_color: '#5E35B1',
				background_color: '#1a1a1a',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				orientation: 'portrait-primary',
				icons: [
					{
						src: 'icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'icon-512x512-mask.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},
			workbox: {
				sourcemap: true,
				cleanupOutdatedCaches: true,
				maximumFileSizeToCacheInBytes:
					5 * 1024 * 1024, // 5MB
				navigateFallback: '/',
				navigateFallbackDenylist: [
					/^chrome-extension:\/\//,
					/api\//,
				],
				// Precache critical app shell and landing page
				globPatterns: [
					'**/*.{js,css,html,ico,png,svg,woff2}',
				],
				// Cache strategy for different resource types
				runtimeCaching: [
					// Landing page and app shell - Cache First
					{
						urlPattern: /^https?:\/\/[^/]+\/?$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'app-shell',
							expiration: {
								maxEntries: 5,
								maxAgeSeconds:
									60 * 60 * 24 * 7, // 1 week
							},
						},
					},
					// Static assets - Cache First with long expiration
					{
						urlPattern:
							/\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'static-assets',
							expiration: {
								maxEntries: 100,
								maxAgeSeconds:
									60 * 60 * 24 * 30, // 30 days
							},
						},
					},
					// Google Fonts
					{
						urlPattern:
							/^https:\/\/fonts\.googleapis\.com/,
						handler: 'CacheFirst',
						options: {
							cacheName:
								'google-fonts-stylesheets',
							expiration: {
								maxEntries: 5,
								maxAgeSeconds:
									60 * 60 * 24 * 365, // 1 year
							},
						},
					},
					{
						urlPattern:
							/^https:\/\/fonts\.gstatic\.com/,
						handler: 'CacheFirst',
						options: {
							cacheName:
								'google-fonts-webfonts',
							expiration: {
								maxEntries: 20,
								maxAgeSeconds:
									60 * 60 * 24 * 365, // 1 year
							},
						},
					},
					// User data APIs - Network First with cache fallback
					{
						urlPattern:
							/\/api\/(auth\/profile|conversations|messages)/,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'user-data',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24, // 1 day
							},
							networkTimeoutSeconds: 3,
						},
					},
					// AI APIs - Network Only (require internet)
					{
						urlPattern:
							/\/api\/(ai|chat|openrouter)/,
						handler: 'NetworkOnly',
					},
					{
						urlPattern:
							/^https:\/\/openrouter\.ai/,
						handler: 'NetworkOnly',
					},
				],
			},
		}),
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: [
						'react',
						'react-dom',
						'react-router-dom',
					],
					ui: ['framer-motion', 'lucide-react'],
					utils: [
						'clsx',
						'browser-image-compression',
					],
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
	server: {
		port: 5173,
		strictPort: false, // Allow fallback to another port if 5173 is in use
		host: '0.0.0.0',
		hmr: {
			clientPort: 5173,
			protocol: 'ws',
			overlay: true,
		},
	},
});
