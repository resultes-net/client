<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import {
		type ModalComponent,
		type ModalSettings,
		type PopupSettings,
		TableOfContents,
		getModalStore,
		popup,
		tocCrawler
	} from '@skeletonlabs/skeleton';

	import { EllipsisVertical } from 'lucide-svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	import DownladAllResults from './downladAllResults.svelte';
	import { loadMoreResults } from './results';

	export let data;

	const parameters = data.parameters;
	let displayResults = data.displayResults;

	const modalStore = getModalStore();

	const simulationId = $page.params.simulationId as string;
	const variationId = $page.params.variationId as string;

	const variationMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'variation-menu-drop-down',
		placement: 'bottom'
	};

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulationId}`, text: simulationId },
		{ text: 'Variations' },
		{
			href: `/simulations/${simulationId}/variations/${variationId}`,
			text: variationId
		}
	]);

	const demand = parameters.values.demand;

	const yearlyHeatDemandGWh =
		demand.hourly_heat_demand_MW.reduce((s, p) => s + demand.scaling_factor * p, 0) / 1000;

	$: {
		if (data.shallDownload) {
			downloadAllResults();
		}
	}

	function downloadAllResults() {
		const endPoint = `/variations/${variationId}/results`;
		const targetFileName = `${variationId}.zip`;

		const url = $page.url;
		function onClose({ closeModal }: { closeModal: boolean }) {
			if (closeModal) {
				modalStore.close();
			}
			goto(url.pathname);
		}

		const modalComponent: ModalComponent = {
			ref: DownladAllResults,
			props: { endPoint, targetFileName, onClose }
		};

		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
	}

	onMount(async () => {
		if (displayResults === null) {
			return;
		}

		await loadMoreResults({ displayResults, variationId, nResultsToLoad: null });
		displayResults = displayResults;
	});

	onDestroy(() => {
		if (displayResults === null) {
			return;
		}

		for (const displayResult of displayResults) {
			const url = displayResult.url;

			if (url) {
				URL.revokeObjectURL(url);
			}
		}
	});
</script>

<div data-popup="variation-menu-drop-down">
	<nav class="bg-secondary-50-900-token list-nav w-52 pt-2">
		<div class="bg-secondary-50-900-token arrow" />
		<ul>
			<li>
				<a href="?download" class="btn w-full">Download all results</a>
			</li>
			<li>
				<a href={`/simulations/${simulationId}/variations/${variationId}/log`} class="btn w-full"
					>Logs</a
				>
			</li>
		</ul>
	</nav>
</div>

<div class="flex flex-row mt-6">
	<TableOfContents class="sticky top-10 h-screen ml-4" indentStyles={{ h5: 'ml-0' }} />

	<div class="ml-6 flex flex-col">
		<div class="flex flex-row">
			<h2 class="h2">Variation {variationId}</h2>
			<div class="self-center" use:popup={variationMenuPopupSettings}><EllipsisVertical /></div>
		</div>
		<div class="mt-8" use:tocCrawler={{ mode: 'generate' }}>
			<h5 class="h5">Parameters</h5>

			<div class="table-container">
				<table class="table table-hover">
					<thead>
						<tr>
							<th>Description</th>
							<th>Value</th>
							<th>Unit</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{$t('common.yearlyHeatDemand')}</td>
							<td>{yearlyHeatDemandGWh.toFixed(1)}</td>
							<td> GWh </td>
							<td />
						</tr>
						<tr>
							<td>{$t('common.collectorArea')}</td>
							<td>{parameters.values.collector_field.area.value}</td>
							{#if parameters.values.collector_field.area.scaling == 'absolute_m2'}
								<td>
									m<sup>2</sup>
								</td>
								<td />
							{:else if parameters.values.collector_field.area.scaling == 'relative_to_demand_m2_per_MWh'}
								<td>
									m<sup>2</sup>MWh<sup>-1</sup>
								</td>
								<td
									>{(
										parameters.values.collector_field.area.value *
										yearlyHeatDemandGWh *
										1000
									).toFixed(0)} m<sup>2</sup>
								</td>
							{/if}
						</tr>
						{#if parameters.values.type === 'ptes'}
							<tr>
								<td>{$t('common.storageVolume')}</td>
								<td>{parameters.values.storage.volume.value}</td>
								{#if parameters.values.storage.volume.scaling == 'absolute_m3'}
									<td>m<sup>3</sup></td>
									<td />
								{:else if parameters.values.storage.volume.scaling == 'relative_to_demand_m3_per_MWh'}
									<td>m<sup>3</sup>MWh<sup>-1</sup></td>
									<td
										>{(parameters.values.storage.volume.value * yearlyHeatDemandGWh * 1000).toFixed(
											0
										)} m<sup>3</sup>
									</td>
								{/if}
							</tr>
							<tr>
								<td>{$t('common.portHeightTop')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.top}</td>
								<td>&percnt;</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.portHeightMiddle')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.middle}</td>
								<td>&percnt;</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.portHeightBottom')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.bottom}</td>
								<td>&percnt;</td>
								<td />
							</tr>
						{/if}
					</tbody>
				</table>
			</div>

			{#if displayResults}
				{#each displayResults as displayResult}
					<div class="mt-6">
						<h5 class="h5" id={displayResult.id}>{displayResult.title}</h5>
						{#if displayResult.url}
							<img src={displayResult.url} alt={displayResult.title} />
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
</div>
