import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'PUBLIC')

	const rewrite = env.PUBLIC_API_PROXY_REMOVE_PREFIX == 'true'
		? (path: string) => path.replace(/^\/api/, '')
		: undefined;

	return {
		plugins: [sveltekit(), purgeCss()],
		server: {
			proxy: {
				'/api': {
					target: env.PUBLIC_API_PROXY_TARGET,
					rewrite: rewrite,
				},
			},
		},
	}
});
