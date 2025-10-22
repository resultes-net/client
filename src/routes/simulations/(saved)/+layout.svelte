<script lange="ts">
	import { writable } from 'svelte/store';
	import { setBreadCrumbStore } from './breadCrumbs';

	const breadCrumbs = writable([]);

	setBreadCrumbStore(breadCrumbs);
</script>

<div class="flex flex-col mt-[2%]">
	<ol class="breadcrumb ml-4">
		{#each $breadCrumbs as crumb, i}
			{#if i < $breadCrumbs.length - 1}
				<li class="crumb">
					{#if crumb?.href}
						<a class="anchor" href={crumb.href}>{crumb.text}</a>
					{:else}
						{crumb.text}
					{/if}
				</li>
				<li class="crumb-separator" aria-hidden>&rsaquo;</li>
			{:else}
				<li class="crumb">{crumb.text}</li>
			{/if}
		{/each}
	</ol>

	<slot />
</div>
