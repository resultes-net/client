<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';

	import type { Simulation } from 'src/lib/openapi/generated/model/simulation';

	import { getJson } from 'src/ajax';
	import * as auth from 'src/auth';
	import { toLocalDateTimeIgnoringTodayDate } from 'src/lib/utils';

	import { getBreadCrumbsStore } from './breadCrumbs';

	import { TimeRemainingEstimator, millisecondsToMinutes } from './time';

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

	function getEllapsedMinutes(simulation: Simulation): number {
		const start = new Date(simulation.created_on);
		const end =
			simulation.state === 'done' || simulation.state == 'error'
				? new Date(simulation.state_changed_on)
				: new Date();

		const millisecondsElapsed = end.getTime() - start.getTime();

		return millisecondsToMinutes(millisecondsElapsed);
	}

	function toMilliseconds(minutes: number): number {
		return minutes * 60 * 1000;
	}

	function formatEstimatedDoneTime(estimatedMinutesRemaining: number): string {
		const milliseconds = Date.now() + toMilliseconds(estimatedMinutesRemaining);
		const roundedMilliseconds = Math.round(milliseconds / 60000) * 60000;
		const date = new Date(roundedMilliseconds);
		return date.toLocaleTimeString(undefined, { timeStyle: 'short' });
	}
</script>

<div class="w-4/5 mt-4 table-container self-center">
	<table class="mt-4 table table-hover text-end">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Created on</th>
				<th>System</th>
				<th>State</th>
				<th>Progress</th>
				<th>Time elapsed</th>
				<th>Estimated time remaining</th>
				<th>Estimated time done</th>
				<th>Number of variations</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedSimulations as simulation}
				{@const ellapsedMinutes = getEllapsedMinutes(simulation)}
				<tr>
					<td><a class="anchor" href="/simulations/{simulation.id}">{simulation.id}</a></td>
					<td>{simulation.name}</td>
					<td>{toLocalDateTimeIgnoringTodayDate(simulation.created_on)}</td>
					<td>{simulation.parameters.values.type}</td>
					<td>{simulation.state}</td>
					<td class="flex flex-row">
						{#if simulation.state == 'done'}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" value={100} max={100} />
							</div>
							<span class="w-14">100/100</span>
						{:else if (simulation.state === 'running-variations' || simulation.state === 'error') && simulation.progress < 100}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" value={simulation.progress} max={100} />
							</div>
							<span class="w-14">{simulation.progress}/100</span>
						{:else if simulation.state === 'running-variations' && simulation.progress === 100}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" />
							</div>
							<span class="w-14">100/100</span>
						{:else}
							<div class="flex flex-row w-24">
								<ProgressBar class="self-center" />
							</div>
							<span class="w-14"></span>
						{/if}
					</td>
					<td>{ellapsedMinutes} min</td>
					{#if simulation.state === 'done' || simulation.state === 'error'}
						<td>0 min</td>
						<td>&ndash;</td>
					{:else if simulation.id in timeRemainingEstimators && timeRemainingEstimators[simulation.id].hasEstimate()}
						{@const estimatedMinutesRemaining =
							timeRemainingEstimators[simulation.id].getEstimatedMinutes()}
						<td>{estimatedMinutesRemaining} min</td>
						<td>{formatEstimatedDoneTime(estimatedMinutesRemaining)}</td>
					{:else}
						<td>TBD</td>
						<td>TBD</td>
					{/if}
					<td>{simulation.variations.length}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
