<script lange="ts">
	import { writable } from 'svelte/store';
	import { setBreadCrumbStore } from './breadCrumbs';

	import { House } from 'lucide-svelte';

	const breadCrumbs = writable([]);

	setBreadCrumbStore(breadCrumbs);
</script>

<div class="flex flex-col mt-[2%]">
	<ol class="breadcrumb ml-4">
		<li class="crumb"><a class="badge" href="/"><House /></a></li>
		{#each $breadCrumbs as crumb, i}
			<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			{#if i < $breadCrumbs.length - 1}
				<li class="crumb">
					{#if crumb?.href}
						<a class="anchor" href={crumb.href}>{crumb.text}</a>
					{:else}
						{crumb.text}
					{/if}
				</li>
			{:else}
				<li class="crumb">{crumb.text}</li>
			{/if}
		{/each}
	</ol>

	<slot />
</div>
