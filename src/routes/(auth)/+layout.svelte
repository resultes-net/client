<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { t } from '$lib/i18n/translations';

	const checked = $page.route.id === '/(auth)/register';

	function onCheckedChanged(event: Event): void {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;

		if (checked) {
			goto('/register');
		} else {
			goto('/login');
		}
	}
</script>

<div class="h-[2rem]" />
<div class="card p-4 flex flex-col h-[36rem] w-[20rem] self-center">
	<slot />
	<div class="flex-grow" />
	<div class="grid grid-cols-3 gap-x-2 w-[70%] self-center items-center">
		<span class="justify-self-end">{$t('auth.login')}</span>
		<SlideToggle
			class="justify-self-center"
			name="login-or-register"
			{checked}
			on:change={onCheckedChanged}
		/>
		<span class="justify-self-start">{$t('auth.register')}</span>
	</div>
</div>
