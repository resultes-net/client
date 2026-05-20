<script lang="ts">
	import { goto } from '$app/navigation';

	import { t } from '$lib/i18n/translations';

	import type { UserCreate } from '$lib/openapi/generated/model/userCreate';

	import { FetchError, getJson } from 'src/ajax';

	let user_create: UserCreate = {
		full_name: '',
		email: '',
		user_name: '',
		plain_password: '',
		registration_key: ''
	};

	let errorMessage: string | null = null;

	async function onSubmit(): Promise<void> {
		const body = JSON.stringify(user_create);

		try {
			await getJson({ endPoint: '/user', body });
		} catch (error) {
			if (error instanceof FetchError) {
				if (error.errorCode == 403) {
					errorMessage = $t('auth.RegistrationCodeInvalid');
					return;
				}

				if (error.errorCode == 409) {
					errorMessage = $t('auth.UsernameAlreadyTaken');
					return;
				}
			} else if (error instanceof Error) {
				errorMessage = `${$t('common.AnErrorOccurred')}: ${error.message}`;
				return;
			}

			throw error;
		}

		goto('/login?registered');
	}
</script>

<form class="flex flex-col w-[80%] self-center gap-y-3" on:submit|preventDefault={onSubmit}>
	<label class="label">
		<span>{$t('auth.fullname')}</span>
		<input
			class="input"
			type="text"
			autocomplete="name"
			required
			bind:value={user_create.full_name}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.email')}</span>
		<input
			class="input"
			type="email"
			autocomplete="email"
			required
			title={$t('auth.MustContainTLD')}
			pattern="([^@\s]+@[^@\s]+(\.[^@\s]+)+)?"
			bind:value={user_create.email}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.username')}</span>
		<input
			class="input"
			type="text"
			autocomplete="username"
			required
			bind:value={user_create.user_name}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.password')}</span>
		<input
			class="input"
			type="password"
			autocomplete="new-password"
			required
			bind:value={user_create.plain_password}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.registrationCode')}</span>
		<input class="input" type="text" required bind:value={user_create.registration_key} />
	</label>
	<button type="submit" class="btn variant-filled-primary self-center mt-2"
		>{$t('auth.register')}</button
	>
</form>

{#if errorMessage}
	<div role="alert" class="alert mt-3">
		<div class="alert-message text-sm variant-ghost-error">
			<div class="ml-1 mr-1">{errorMessage}</div>
		</div>
	</div>
{/if}
