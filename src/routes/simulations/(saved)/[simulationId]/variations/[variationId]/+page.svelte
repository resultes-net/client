<script lang="ts">
	import { TableOfContents, tocCrawler } from '@skeletonlabs/skeleton';
	import { onDestroy } from 'svelte';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	import type { Results } from './results';

	import type { PageData } from './$types';

	export let data: PageData;

	const { variation, objectUrls } = data;

	const breadCrumbs = getBreadCrumbsStore();

	const titles: { [K in Results]: string } = {
		energyBalance: 'Monthly energy balance of the system',
		boiler: 'Boiler power',
		hpBalance: 'Heat pump energy balance',
		hpQt: 'Heat pump Q vs. T plot',
		hxEffectiveness: 'Heat exchanger effectiveness',
		hxLmtd: 'Heat exchanger LMTD',
		ptesBalance: 'PTES energy balance',
		ptesSoc: 'PTES state of charge (SoC)',
		ptesT: 'PTES temperatures',
		sink: 'Demand power',
		solarQt: 'Collector Q vs. T plot',
		solarPHourly: 'Collector power hourly',
		solarPMonthly: 'Collector power monthly',
		source: 'Additional source power'
	};

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${variation.simulation_id}`, text: variation.simulation_id },
		{ text: 'Variations' },
		{
			href: `/simulations/${variation.simulation_id}/variations/${variation.id}`,
			text: variation.id
		}
	]);

	onDestroy(() => {
		for (const objectUrl of Object.values(objectUrls)) {
			URL.revokeObjectURL(objectUrl);
		}
	});
</script>

<div class="flex flex-row mt-6">
	<TableOfContents class="sticky top-10 h-screen ml-4" indentStyles={{ h5: 'ml-0' }} />

	<div class="w-4/5 ml-6 self-center flex-col" use:tocCrawler={{ mode: 'generate' }}>
		{#each Object.entries(titles) as [result, title]}
			{@const firstKey = Object.keys(objectUrls)[0]}
			{@const margin = result === firstKey ? '' : 'mt-6'}
			{@const url = objectUrls[result]}
			<h5 class={`h5 ${margin}`} id={result}>{title}</h5>
			<img src={url} alt={title} />
		{/each}
	</div>
</div>
