<script lang="ts">
	import { LoaderCircle } from 'lucide-svelte';

	import type { PageData } from './$types';

	import { getBreadCrumbsStore } from '../breadCrumbs';

	export let data: PageData;

	const simulation = data.simulation;

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulation.id}`, text: simulation.id }
	]);

	const sortedVariations = simulation.variations.toSorted((v1, v2) =>
		v1.created_on.localeCompare(v2.created_on, 'en')
	);
</script>

<div class="w-4/5 mt-6 table-container self-center">
	<div class="flex flex-row">
		<h3 class="h3">
			Simulation {simulation.id}
		</h3>
		{#if simulation.state !== 'done'}
			<LoaderCircle class="animate-spin ml-2" />
		{/if}
	</div>
	<h3 class="h3 mt-4">Variations</h3>
	<table class="mt-4 table table-hover">
		<thead>
			<tr>
				<th>ID</th>
				<th>Created on</th>
				<th>State</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedVariations as variation}
				<tr>
					<td>
						{#if variation.state !== 'done'}
							{variation.id}
						{:else}
							<a class="anchor" href="/simulations/{simulation.id}/variations/{variation.id}">
								{variation.id}
							</a>
						{/if}
					</td>
					<td>{variation.created_on}</td>
					<td class="flex flex-row">
						{#if variation.state !== 'done'}
							<LoaderCircle class="animate-spin mr-2" /> {variation.state}
						{:else}
							{variation.state}
						{/if}
					</td>
				</tr>~
			{/each}
		</tbody>
	</table>
</div>
