<script lang="ts">
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';

	import { page } from '$app/state';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	export let data;

	let { displayResults } = data;

	const simulationId = page.params.simulationId as string;
	const variationId = page.params.variationId as string;

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulationId}`, text: simulationId },
		{ text: 'Variations' },
		{
			href: `/simulations/${variationId}/variations/${variationId}`,
			text: variationId
		}
	]);

	onDestroy(() => {
		for (const displayResult of displayResults) {
			const url = displayResult.url;

			if (url) {
				URL.revokeObjectURL(url);
			}
		}
	});
</script>

<div class="flex flex-row mt-6">
	<TableOfContents class="sticky top-10 h-screen ml-4" indentStyles={{ h5: 'ml-0' }} />

	<div class="w-4/5 ml-6 self-center flex-col" use:tocCrawler={{ mode: 'generate' }}>
		{#each displayResults as displayResult}
			{@const margin = displayResult === displayResults[0] ? '' : 'mt-6'}
			<h5 class={`h5 ${margin}`} id={displayResult.id}>{displayResult.title}</h5>
			{#if displayResult.url}
				<img src={displayResult.url} alt={displayResult.title} />
			{/if}
		{/each}
	</div>
</div>
