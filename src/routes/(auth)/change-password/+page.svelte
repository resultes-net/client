<script lang="ts">
	import { goto } from '$app/navigation';

	import { t } from '$lib/i18n/translations';

	import type { UserModify } from 'src/lib/openapi/generated/model/userModify';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	let user_create: UserModify = {
		old_plain_password: '',
		new_plain_password: ''
	};

	async function onClick(): Promise<void> {
		// assert(user_create.full_name && ...);

		const body = JSON.stringify(user_create);

		const bearerToken = auth.getAccessToken();

		await getJson({ endPoint: '/user', httpVerb: 'PUT', body, bearerToken });

		goto('/');
	}
</script>

<form class="flex flex-col w-[80%] self-center gap-y-4">
	<label class="label">
		<span>{$t('auth.currentPassword')}</span>
		<input
			class="input"
			type="password"
			autocomplete="current-password"
			bind:value={user_create.old_plain_password}
		/>
	</label>
	<label class="label">
		<span>{$t('auth.newPassword')}</span>
		<input
			class="input"
			type="password"
			autocomplete="new-password"
			bind:value={user_create.new_plain_password}
		/>
	</label>
	<button type="button" class="btn variant-filled-primary self-center mt-2" on:click={onClick}
		>{$t('auth.changePassword')}</button
	>
</form>
