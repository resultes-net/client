<script lang="ts">
	import { EllipsisVertical, LoaderCircle } from 'lucide-svelte';

	import type { PageData } from './$types';

	import { goto, invalidate } from '$app/navigation';
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { getJson, UnauthorizedError } from 'src/ajax';
	import * as auth from 'src/auth';
	import { t } from 'src/lib/i18n/translations';
	import type { Simulation } from 'src/lib/openapi/generated/model/simulation';
	import { SimulationState } from 'src/lib/openapi/generated/model/simulationState';
	import type { Variation } from 'src/lib/openapi/generated/model/variation';
	import { toLocalDateTimeIgnoringTodayDate } from 'src/lib/utils';
	import { onMount } from 'svelte';
	import { getBreadCrumbsStore } from '../breadCrumbs';

	export let data: PageData;

	let simulation: Simulation;
	$: simulation = data.simulation;

	const breadCrumbs = getBreadCrumbsStore();

	$: breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulation.id}`, text: simulation.id }
	]);

	let sortedVariations: Variation[];
	$: sortedVariations = simulation.variations.toSorted((v1, v2) =>
		v1.created_on.localeCompare(v2.created_on, 'en')
	);

	const simulationMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'simulation-menu-drop-down',
		placement: 'bottom'
	};

	async function onRestartSimulation() {
		const newState = SimulationState.WaitingForVariationsCreation;
		const endPoint = `/simulations/${simulation.id}/state?new_state=${newState}`;

		const token = auth.getTokenOrNull();

		if (token === null) {
			goto('/login');
			return;
		}

		try {
			await getJson({ endPoint, httpVerb: 'PUT', bearerToken: token.token });
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				goto('/login');
				return;
			}

			throw error;
		}

		invalidate(`resultes:simulation:${simulation.id}`);
	}

	let shallPollSimulationUntilDone = true;
	async function pollSimulationUntilDone() {
		if (!shallPollSimulationUntilDone || simulation.state === 'done') {
			return;
		}

		invalidate(`resultes:simulation:${simulation.id}`);

		setTimeout(pollSimulationUntilDone, 5000);
	}

	onMount(() => {
		pollSimulationUntilDone();

		return () => {
			shallPollSimulationUntilDone = false;
		};
	});
</script>

<div data-popup="simulation-menu-drop-down">
	<div class="bg-secondary-50-900-token list-nav w-52 pt-2">
		<div class="bg-secondary-50-900-token arrow" />
		<ul>
			<li>
				<button class="btn w-full" on:click={onRestartSimulation}>{$t('common.Restart')}</button>
			</li>
		</ul>
	</div>
</div>

<div class="w-4/5 mt-6 table-container self-center">
	<div class="flex flex-row">
		<h2 class="h2">
			Simulation {simulation.id}
		</h2>
		{#if simulation.state === 'error'}
			<div class="self-center" use:popup={simulationMenuPopupSettings}><EllipsisVertical /></div>
		{:else}
			<div class="self-center"><EllipsisVertical /></div>
		{/if}
		{#if simulation.state !== 'done' && simulation.state !== 'error'}
			<LoaderCircle class="self-center animate-spin ml-1" />
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
						<a class="anchor" href="/simulations/{simulation.id}/variations/{variation.id}">
							{variation.id}
						</a>
					</td>
					<td>{toLocalDateTimeIgnoringTodayDate(variation.created_on)}</td>
					<td class="flex flex-row">
						{#if variation.state !== 'done' && variation.state !== 'error'}
							<LoaderCircle class="animate-spin mr-2" /> {variation.state}
						{:else}
							{variation.state}
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
