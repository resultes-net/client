<script>
	import Logos from '../Logos.svelte';
</script>

<div class="flex flex-row mt-8">
	<div class="card self-center p-4 flex flex-col h-[38rem] w-[20rem] ml-[6rem]">
		<slot />
	</div>
	<div class="ml-[6rem]">
		<Logos />
	</div>
</div>
