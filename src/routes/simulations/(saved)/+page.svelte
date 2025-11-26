<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getBreadCrumbsStore } from './breadCrumbs';

	import { LoaderCircle } from 'lucide-svelte';
	import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	export let data;

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/', text: 'Simulations' }
	]);

	let simulations = data.simulations;

	let sortedSimulations: Simulation[];
	$: sortedSimulations = simulations.toSorted((s1, s2) =>
		s2.created_on.localeCompare(s1.created_on, 'en')
	);

	let shallPoll = true;
	let pollingTimeoutId: number | null = null;
	onMount(async () => {
		await pollSimulations();
	});

	onDestroy(() => {
		shallPoll = false;
		if (pollingTimeoutId !== null) {
			window.clearTimeout(pollingTimeoutId);
		}
	});

	async function pollSimulations() {
		const bearerToken = auth.getAccessToken();

		simulations = await getJson({
			endPoint: '/simulations',
			httpVerb: 'GET',
			bearerToken
		});

		if (shallPoll) {
			pollingTimeoutId = window.setTimeout(pollSimulations, 5000);
		}
	}
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
					<td class="flex flex-row">
						{#if simulation.state !== 'done'}
							<LoaderCircle class="animate-spin mr-2" />
						{/if}
						{simulation.state}
					</td>
					<td>{simulation.variations.length}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
