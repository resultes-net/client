<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import { assert } from '$lib/utils';

	import { type Token } from 'src/lib/openapi/generated/model/token';

	import * as auth from 'src/auth';

	import { getJson, UnauthorizedError } from 'src/ajax';

	let hasLoginFailed = false;
	async function onSubmit(): Promise<void> {
		const contentType = 'application/x-www-form-urlencoded';

		assert(formData.password && formData.username);

		const username = formData.username;
		const password = formData.password;

		const body = new URLSearchParams({ grant_type: 'password', username, password });

		try {
			const token = await getJson<Token>({ endPoint: '/token', body, contentType });

			assert(token.token_type === 'bearer');

			auth.setToken(token);

			goto('/');
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				hasLoginFailed = true;
			}

			throw error;
		}
	}

	interface FormData {
		username: string | null;
		password: string | null;
	}

	const formData: FormData = {
		username: null,
		password: null
	};

	function isNullOrEmpty(value: string | null): boolean {
		const result = value === null || value === '';
		return result;
	}

	let disabled: boolean;
	$: disabled = isNullOrEmpty(formData.username) || isNullOrEmpty(formData.password);
</script>

<form class="flex flex-col w-[80%] self-center gap-y-4" on:submit|preventDefault={onSubmit}>
	<label class="label">
		<span>{$t('auth.username')}</span>
		<input class="input" type="text" autocomplete="username" bind:value={formData.username} />
	</label>
	<label class="label">
		<span>{$t('auth.password')}</span>
		<input
			class="input"
			type="password"
			autocomplete="current-password"
			bind:value={formData.password}
		/>
	</label>
	<button
		type="submit"
		class="btn variant-filled-primary self-center mt-2"
		{disabled}
	>
		{$t('auth.login')}
	</button>
</form>
{#if hasLoginFailed}
	<div role="alert" class="alert">
		<div class="alert-message text-sm text-error-900-50-token">Wrong username or password. Please try again.</div>
	</div>
{/if}
