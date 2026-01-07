<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';

	import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';

	import { getBreadCrumbsStore } from './breadCrumbs';

	import { type Time, TimeRemainingEstimator, formatTime, millisecondsToTime } from './time';

	export let data;

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/', text: 'Simulations' }
	]);

	let simulations = data.simulations;
	let timeRemainingEstimators: { [index: string]: TimeRemainingEstimator } = {};
	updateTimeRemainingEstimators(simulations);

	function updateTimeRemainingEstimators(simulations: Simulation[]): void {
		for (const simulation of simulations) {
			if (simulation.state !== 'done' && simulation.state !== 'running-variations') {
				continue;
			}

			if (!(simulation.id in timeRemainingEstimators)) {
				timeRemainingEstimators[simulation.id] = new TimeRemainingEstimator();
			}

			const timeRemainingEstimator = timeRemainingEstimators[simulation.id];

			timeRemainingEstimator.addProgress(simulation.progress!);
		}

		timeRemainingEstimators = timeRemainingEstimators;
	}

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

	async function pollSimulations(): Promise<void> {
		if (!auth.getIsAuthenticated()) {
			goto('/login');
			return;
		}

		const bearerToken = auth.getAccessToken();

		simulations = await getJson({
			endPoint: '/simulations',
			httpVerb: 'GET',
			bearerToken
		});

		updateTimeRemainingEstimators(simulations);

		if (shallPoll) {
			pollingTimeoutId = window.setTimeout(pollSimulations, 5000);
		}
	}

	function getEllapsedTime(simulation: Simulation): Time {
		const start = new Date(simulation.created_on);
		const end = simulation.state === 'done' ? new Date(simulation.state_changed_on) : new Date();

		const millisecondsElapsed = end - start;

		return millisecondsToTime(millisecondsElapsed);
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
				<th>Time elapsed</th>
				<th>Estimated time remaining</th>
				<th>Number of variations</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedSimulations as simulation}
				{@const ellapsedTime = getEllapsedTime(simulation)}
				<tr>
					<td><a class="anchor" href="/simulations/{simulation.id}">{simulation.id}</a></td>
					<td>{simulation.created_on}</td>
					<td>{simulation.parameters.values.type}</td>
					<td>{simulation.state}</td>
					<td class="flex flex-row">
						{#if !(simulation.state === 'running-variations' && simulation.progress < 100) && simulation.state !== 'done'}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" />
							</div>
							<span class="w-14 text-end"></span>
						{:else}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" value={simulation.progress} max={100} />
							</div>
							<span class="w-14 text-end">{simulation.progress}/100</span>
						{/if}
					</td>
					<td>{formatTime(ellapsedTime)} min</td>
					<td>
						{#if simulation.id in timeRemainingEstimators && timeRemainingEstimators[simulation.id].hasEstimate()}
							{@const estimatedTimeRemaining =
								timeRemainingEstimators[simulation.id].getEstimatedTime()}
							{formatTime(estimatedTimeRemaining)} min
						{:else}
							TBD
						{/if}
					</td>
					<td>{simulation.variations.length}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
