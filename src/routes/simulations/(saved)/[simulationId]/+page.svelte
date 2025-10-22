<script lang="ts">
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
	<h3 class="h3">Variations</h3>
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
					<td
						><a class="anchor" href="/simulations/{simulation.id}/variations/{variation.id}"
							>{variation.id}</a
						></td
					>
					<td>{variation.created_on}</td>
					<td>{variation.state}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
