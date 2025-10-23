<script lang="ts">
	import { getBreadCrumbsStore } from './breadCrumbs';

	export let data;

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/', text: 'Simulations' }
	]);

	const sortedSimulations = data.simulations.toSorted((s1, s2) =>
		s1.created_on.localeCompare(s2.created_on, 'en')
	);
</script>

<div class="w-4/5 mt-4 table-container self-center">
	<table class="mt-4 table table-hover">
		<thead>
			<tr>
				<th>ID</th>
				<th>Created on</th>
				<th>System</th>
				<th>State</th>
				<th>Number of variations</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedSimulations as simulation}
				<tr>
					<td><a class="anchor" href="/simulations/{simulation.id}">{simulation.id}</a></td>
					<td>{simulation.created_on}</td>
					<td>{simulation.parameters.values.type}</td>
					<td>{simulation.state}</td>
					<td>{simulation.variations.length}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
