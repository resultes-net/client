<script lang="ts">
	import { goto } from '$app/navigation';

	import { t } from '$lib/i18n/translations';

	import type { UserCreate } from '$lib/openapi/generated/model/userCreate';

	import { getJson } from 'src/ajax';

	var user_create: UserCreate = {
		full_name: '',
		email: '',
		user_name: '',
		plain_password: '',
		registration_key: ''
	};

	async function onClick(): Promise<void> {
		// assert(user_create.full_name && ...);

		const body = JSON.stringify(user_create);

		await getJson({ endPoint: '/user', body });

		await goto('/login');
	}
</script>

<form class="flex flex-col w-[80%] self-center gap-y-4">
	<label class="label">
		<span>{$t('auth.fullname')}</span>
		<input class="input" type="text" autocomplete="name" bind:value={user_create.full_name} />
	</label>
	<label class="label">
		<span>{$t('auth.email')}</span>
		<input
			class="input invalid:input-error"
			type="email"
			autocomplete="email"
			bind:value={user_create.email}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.username')}</span>
		<input class="input" type="text" autocomplete="username" bind:value={user_create.user_name} />
	</label>
	<label class="label">
		<span>{$t('auth.password')}</span>
		<input
			class="input"
			type="password"
			autocomplete="new-password"
			bind:value={user_create.plain_password}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.registrationCode')}</span>
		<input class="input" type="text" bind:value={user_create.registration_key} />
	</label>
	<button type="button" class="btn variant-filled-primary self-center mt-2" on:click={onClick}
		>{$t('auth.register')}</button
	>
</form>
