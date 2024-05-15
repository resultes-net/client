import type { PlaywrightTestConfig } from '@playwright/test';

const url = 'http://localhost:4173/';

const config: PlaywrightTestConfig = {
	use: {
		baseURL: url
	},
	webServer: {
		command: 'npm run build && npm run preview',
		url: url
	},
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
};

export default config;
