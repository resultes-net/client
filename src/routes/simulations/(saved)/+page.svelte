<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	import { getBreadCrumbsStore } from './breadCrumbs';

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
				<th>Progress</th>
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
					<td class="flex flex-row">
						<div class="flex flex-row w-24">
							<ProgressBar class="self-center" value={simulation.progress} max={100} />
						</div>
						<span class="w-14 text-end">{simulation.progress}/100</span>
					</td>
					<td>{simulation.variations.length}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
