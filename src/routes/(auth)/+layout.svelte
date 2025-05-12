<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	
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
</div>
