<script lang="ts">
	import type { PageData } from './$types';

	import { onDestroy } from 'svelte';
	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	export let data: PageData;

	const variation = data.variation;

	const breadCrumbs = getBreadCrumbsStore();

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

	const objectUrls: string[] = [];

	function createObjectUrl(blob: Blob): string {
		const url = URL.createObjectURL(blob);
		objectUrls.push(url);
		return url;
	}

	onDestroy(() => {
		for (const objectUrl in objectUrls) {
			URL.revokeObjectURL(objectUrl);
		}
	});
</script>

<div class="w-4/5 mt-6 self-center flex-col">
	<h5 class="h5">Energy Balance</h5>
	<img src={createObjectUrl(data.blobs.energyBalance)} alt="Monthly energy balance of the system" />

	<h5 class="h5 mt-6">Boiler power</h5>
	<img src={createObjectUrl(data.blobs.boiler)} alt="Boiler power" />

	<h5 class="h5 mt-6">Heat pump energy balance</h5>
	<img src={createObjectUrl(data.blobs.hpBalance)} alt="Heat pump energy balance" />

	<h5 class="h5 mt-6">Heat pump Q vs. T plot</h5>
	<img src={createObjectUrl(data.blobs.hpQt)} alt="Heat pump Q vs. T plot" />

	<h5 class="h5 mt-6">Heat exchanger efficiency</h5>
	<img src={createObjectUrl(data.blobs.hxEfficiency)} alt="Heat exchanger efficiency" />

	<h5 class="h5 mt-6">Heat exchanger logarithmic mean temperature difference (LMTD)</h5>
	<img
		src={createObjectUrl(data.blobs.hxLmtd)}
		alt="Heat exchanger logarithmic mean temperature difference (LMTD)"
	/>

	<h5 class="h5 mt-6">PTES energy balance</h5>
	<img src={createObjectUrl(data.blobs.ptesBalance)} alt="PTES energy balance" />

	<h5 class="h5 mt-6">PTES state of charge (SoC)</h5>
	<img src={createObjectUrl(data.blobs.ptesSoc)} alt="PTES state of charge (SoC)" />

	<h5 class="h5 mt-6">PTES temperatures</h5>
	<img src={createObjectUrl(data.blobs.ptesT)} alt="PTES temperatures" />

	<h5 class="h5 mt-6">Demand power</h5>
	<img src={createObjectUrl(data.blobs.sink)} alt="Demand power" />

	<h5 class="h5 mt-6">Collector Q vs. T plot</h5>
	<img src={createObjectUrl(data.blobs.solarQt)} alt="Collector Q vs. T plot" />

	<h5 class="h5 mt-6">Collector power hourly</h5>
	<img src={createObjectUrl(data.blobs.solarPHourly)} alt="Collector power hourly" />

	<h5 class="h5 mt-6">Collector power monthly</h5>
	<img src={createObjectUrl(data.blobs.solarPMonthly)} alt="Collector power hourly" />

	<h5 class="h5 mt-6">Additional source power</h5>
	<img src={createObjectUrl(data.blobs.sink)} alt="Additional source power" />
</div>
