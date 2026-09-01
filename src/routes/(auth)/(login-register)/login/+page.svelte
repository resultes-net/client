<script lang="ts">
	import { goto } from '$app/navigation';
	import { t } from '$lib/i18n/translations';
	import { assert } from '$lib/utils';
	import { page } from '$app/stores';

	import { type Token } from 'src/lib/openapi/generated/model/token';

	import * as auth from 'src/auth';

	import { getJson, UnauthorizedError } from 'src/ajax';

	const hasJustRegistered = $page.url.searchParams.has('registered');

	const redirect = $page.url.searchParams.get('redirect') ?? '/';

	type MessageType = 'info' | 'error';
	let message: { type: MessageType; value: string } | null = hasJustRegistered
		? { type: 'info', value: 'Registration successful. You can now log in.' }
		: null;

	function getVariant(type: MessageType) {
		switch (type) {
			case 'info':
				return 'variant-ghost-success';
			case 'error':
				return 'variant-ghost-error';
			default:
				throw new Error(`Unknown message type: '${type}'.`);
		}
	}

	async function onSubmit(): Promise<void> {
		const contentType = 'application/x-www-form-urlencoded';

		assert(formData.password && formData.username);

		const username = formData.username;
		const password = formData.password;

		const body = new URLSearchParams({ grant_type: 'password', username, password });

		try {
			const token = await getJson<Token>({ endPoint: '/token', body, contentType });

			assert(token.token_type === 'bearer');

			auth.setToken(username, token);

			goto(redirect);
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				message = { type: 'error', value: $t('auth.WrongUserNameOrPassword') };
				return;
			} else if (error instanceof Error) {
				message = { type: 'error', value: error.message };
				return;
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
</script>

<form class="flex flex-col w-[80%] self-center gap-y-4" on:submit|preventDefault={onSubmit}>
	<label class="label">
		<span>{$t('auth.username')}</span>
		<input
			class="input"
			type="text"
			autocomplete="username"
			required
			bind:value={formData.username}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.password')}</span>
		<input
			class="input"
			type="password"
			autocomplete="current-password"
			required
			bind:value={formData.password}
		/>
	</label>
	<button type="submit" class="btn variant-filled-primary self-center mt-2">
		{$t('auth.login')}
	</button>
</form>

{#if message}
	<div role="alert" class="alert mt-3">
		<div class="alert-message text-sm {getVariant(message.type)}">
			<div class="ml-1 mr-1">{message.value}</div>
		</div>
	</div>
{/if}
