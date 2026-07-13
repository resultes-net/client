<script lang="ts">
	import { onMount } from 'svelte';

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

	import DownladAllResults from './downloadAllResults.svelte';
	import { downloadResults } from './results';

	export let data;

	const simulationId = $page.params.simulationId as string;

	const parameters = data.parameters;
	let variationResults = data.variationResults;
	$: variation = variationResults.variation;
	$: kpis = variationResults.results?.kpis ?? null;
	$: displayResults = variationResults.results?.displayResults ?? null;

	$: lastUpdatedOn = new Date(Date.parse(variation.state_changed_on));
	$: variationId = variation.id;

	const modalStore = getModalStore();

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

	const yearlyHeatDemandMWh = demand.hourly_heat_demand_MW.reduce(
		(s, p) => s + demand.scaling_factor * p,
		0
	);

	const yearlyHeatDemandGWh = yearlyHeatDemandMWh / 1000;

	const collectorFieldArea = parameters.values.collector_field.area;
	const collectorFieldAreaScalingFactor =
		collectorFieldArea.scaling === 'relative_to_demand_m2_per_MWh' ? yearlyHeatDemandMWh : 1.0;
	const collectorFieldAreaM2 = collectorFieldArea.value * collectorFieldAreaScalingFactor;

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

	let shallPollForUpdates = true;
	async function pollUpdates() {
		if (!shallPollForUpdates) {
			return;
		}

		const newVariationResults = await downloadResults({
			variationId,
			displayResults,
			lastUpdatedOn,
			nDisplayResultsToDownload: null,
			fetchFunction: fetch
		});

		if (newVariationResults === 'display-results-loaded') {
			displayResults = displayResults;

			// DONE - don't reset timeout
			return;
		} else if (newVariationResults === 'unchanged') {
			// nothing to do
		} else {
			variationResults = newVariationResults;
		}

		setTimeout(pollUpdates, 5000);
	}

	onMount(() => {
		pollUpdates();

		return () => {
			shallPollForUpdates = false;

			if (displayResults === null) {
				return;
			}

			for (const displayResult of displayResults) {
				const url = displayResult.url;

				if (url) {
					URL.revokeObjectURL(url);
				}
			}
		};
	});
</script>

<div data-popup="variation-menu-drop-down">
	<div class="bg-secondary-50-900-token list-nav w-52 pt-2">
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
	</div>
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
									>{collectorFieldAreaM2.toFixed(0)}
									m<sup>2</sup>
								</td>
							{:else}
								ERROR: Unknown area scaling: `{parameters.values.collector_field.area.scaling}`.
							{/if}
						</tr>
						{#if parameters.values.type === 'ptes'}
							<tr>
								<td>{$t('common.demandSetpointTemperature')}</td>
								<td>{parameters.values.control.demand_temperature_setpoint_degC}</td>
								<td>°C</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.DemandDeltaT')}</td>
								<td>{parameters.values.control.demand_delta_T_degC}</td>
								<td>°C</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.maximumStorageTemperature')}</td>
								<td>{parameters.values.control.storage_temperature_maximum_degC}</td>
								<td>°C</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.storageVolume')}</td>
								<td>{parameters.values.storage.volume.value}</td>
								{#if parameters.values.storage.volume.scaling == 'absolute_m3'}
									<td>m<sup>3</sup></td>
									<td />
								{:else if parameters.values.storage.volume.scaling == 'relative_to_demand_m3_per_MWh'}
									<td>m<sup>3</sup>MWh<sup>-1</sup></td>
									<td
										>{(parameters.values.storage.volume.value * yearlyHeatDemandMWh).toFixed(0)} m<sup
											>3</sup
										>
									</td>
								{:else if parameters.values.storage.volume.scaling == 'relative_to_collector_area_m3_per_m2'}
									<td>m<sup>3</sup>m<sup>-2</sup></td>
									<td
										>{(parameters.values.storage.volume.value * collectorFieldAreaM2).toFixed(0)} m<sup
											>3</sup
										>
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

			{#if variation.state === 'done'}
				<h5 class="h5 mt-6">{$t('common.KPIs')}</h5>
				{#if kpis}
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
									<td>{$t('common.TesYearlyCharge')}</td>
									<td>{(kpis.pitStoreQCharge_Tot / 1000 / 1000).toFixed(2)}</td>
									<td>GWh</td>
									<td />
								</tr>
								<tr>
									<td>{$t('common.TesYearlyDischarge')}</td>
									<td>{(kpis.pitStoreQDisharge_Tot / 1000 / 1000).toFixed(2)}</td>
									<td>GWh</td>
									<td />
								</tr>
								<tr>
									<td>{$t('common.TesRoundTripEfficiency')}</td>
									<td>{kpis.pitStoreEff.toFixed(2)}</td>
									<td>-</td>
									<td />
								</tr>
								<tr>
									<td>{$t('common.TesYearlyNetHeatGain')}</td>
									<td>{(kpis.pitStoreQAccum_kW_Tot / 1000 / 1000).toFixed(2)}</td>
									<td>GWh</td>
									<td />
								</tr>
							</tbody>
						</table>
					</div>
				{:else}
					<span>{$t('common.KPIsNotAvailable')}</span>
				{/if}

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
			{/if}
		</div>
	</div>
</div>
