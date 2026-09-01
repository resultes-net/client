<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n/translations';

	let checked;
	$: checked = $page.url.pathname === '/register';

	function onCheckedChanged(event: Event): void {
		const target = event.target as HTMLInputElement;
		const checked = target.checked;

		const redirect = encodeURIComponent($page.url.searchParams.get('redirect') ?? '/');
		const base = checked ? '/register' : '/login';
		const url = `${base}?redirect=${redirect}`;

		goto(url);
	}
</script>

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
