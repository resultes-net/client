<script lang="ts">
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

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

<div class="flex flex-col w-full h-full justify-center">
	<div class="basis-[20%]" />
	<div class="card p-4 flex flex-col flex-auto w-[30%] self-center">
		<slot />
		<div class="grid grid-cols-3 gap-x-2 mt-auto w-[70%] self-center items-center">
			<span class="justify-self-end">Log in</span>
			<SlideToggle
				class="justify-self-center"
				name="login-or-register"
				{checked}
				on:change={onCheckedChanged}
			/>
			<span class="justify-self-start">Register</span>
		</div>
	</div>
	<div class="basis-[30%]" />
</div>
