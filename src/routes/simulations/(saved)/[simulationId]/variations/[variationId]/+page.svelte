<script lang="ts">
	import type { PageData } from './$types';

	import { onDestroy, onMount } from 'svelte';
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

	var energyBalanceObjectURL: string | null = null;

	onMount(() => {
		energyBalanceObjectURL = URL.createObjectURL(data.energyBalanceBlob);
	});

	onDestroy(() => {
		if (energyBalanceObjectURL) {
			URL.revokeObjectURL(energyBalanceObjectURL);
		}
	});
</script>

<div class="w-4/5 mt-6 table-container self-center">
	<h5 class="h5">Energy Balance</h5>
	<img src={energyBalanceObjectURL} alt="Monthly energy balance of the system" />
</div>
