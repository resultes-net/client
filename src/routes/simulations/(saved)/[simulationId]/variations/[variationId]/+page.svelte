<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import {
		Tab,
		TabGroup,
		TableOfContents,
		getModalStore,
		popup,
		tocCrawler,
		type ModalComponent,
		type ModalSettings,
		type PopupSettings
	} from '@skeletonlabs/skeleton';

	import { EllipsisVertical, LoaderCircle } from 'lucide-svelte';

	import { goto, invalidate } from '$app/navigation';
	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	import { UnauthorizedError } from 'src/ajax';
	import type { PageData } from './$types.js';
	import { loadMoreResults } from './displayResults';
	import DownladAllResults from './downloadAllResults.svelte';

	export let data;

	const parameters = data.parameters;

	$: variation = data.variation;
	$: variationId = variation.id;
	$: kpis = data.kpis;

	let displayResults = data.displayResults;

	type ActiveParamtersTab = 'demand' | 'collector' | 'storage' | 'control';
	let activeParametersTab: ActiveParamtersTab = 'demand';

	$: if (displayResults !== null) {
		for (const displayResult of displayResults) {
			const data = displayResult.data;

			if (data.status !== 'downloaded') {
				continue;
			}

			displayResult.data = { status: 'object-url-created', url: URL.createObjectURL(data.blob) };
		}
	}

	$: loadAllDisplayResults(data);

	async function loadAllDisplayResults(myData: PageData) {
		if (myData.displayResults === null) {
			return;
		}

		try {
			await loadMoreResults({
				displayResults: myData.displayResults,
				variationId,
				nResultsToLoad: null
			});

			displayResults = myData.displayResults;
		} catch (exception) {
			if (exception instanceof UnauthorizedError) {
				goto('/login');
				return;
			}

			throw exception;
		}
	}

	const modalStore = getModalStore();

	const simulationId = $page.params.simulationId as string;

	const variationMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'variation-menu-drop-down',
		placement: 'bottom'
	};

	const breadCrumbs = getBreadCrumbsStore();

	$: breadCrumbs.set([
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

	let isDestroyed = false;
	function invalidateVariationLoop() {
		if (isDestroyed || variation.state === 'done' || variation.state === 'error') {
			return;
		}

		invalidate(`resultes:variation:${variationId}`);

		setTimeout(invalidateVariationLoop, 5000);
	}

	onMount(() => {
		invalidateVariationLoop();
	});

	onDestroy(() => {
		isDestroyed = true;

		if (displayResults === null) {
			return;
		}

		for (const { data } of displayResults) {
			if (data.status === 'object-url-created') {
				URL.revokeObjectURL(data.url);
			}
		}
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
			{#if variation.state !== 'done' && variation.state !== 'error'}
				<div class="self-center"><EllipsisVertical /></div>
				<LoaderCircle class="self-center animate-spin ml-1" />
			{:else}
				<div class="self-center" use:popup={variationMenuPopupSettings}><EllipsisVertical /></div>
			{/if}
		</div>
		<div
			class="mt-8"
			use:tocCrawler={{ mode: 'generate', key: [variation.state, kpis, displayResults] }}
		>
			<h5 class="h5">Parameters</h5>
			<TabGroup>
				<Tab bind:group={activeParametersTab} name="demand" value="demand"
					>{$t('common.demand')}</Tab
				>
				<Tab bind:group={activeParametersTab} name="collector" value="collector"
					>{$t('common.collector')}</Tab
				>
				<Tab bind:group={activeParametersTab} name="demand" value="storage"
					>{$t('common.storage')}</Tab
				>
				<Tab bind:group={activeParametersTab} name="demand" value="control"
					>{$t('common.Control')}</Tab
				>

				<svelte:fragment slot="panel">
					<div class="ltr:ml-[1%] rtl:mr-[1%]">
						{#if activeParametersTab === 'demand'}
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
									</tbody>
								</table>
							</div>
						{:else if activeParametersTab === 'collector'}
							{@const collector = parameters.values.collector_field}
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
											<td>{$t('common.collectorArea')}</td>
											<td>{collector.area.value}</td>
											{#if collector.area.scaling == 'absolute_m2'}
												<td>
													m<sup>2</sup>
												</td>
												<td />
											{:else if collector.area.scaling == 'relative_to_demand_m2_per_MWh'}
												<td>
													m<sup>2</sup>MWh<sup>-1</sup>
												</td>
												<td
													>{collectorFieldAreaM2.toFixed(0)}
													m<sup>2</sup>
												</td>
											{:else}
												ERROR: Unknown area scaling: `{collector.area.scaling}`.
											{/if}
										</tr>
										<tr>
											<td>{$t('common.inclination')}</td>
											<td>{collector.inclination_deg}</td>
											<td>°</td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.orientation')}</td>
											<td>{collector.orientation_east_west_deg}</td>
											<td>°</td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA0')}</td>
											<td>{collector.performance_coefficients.a0_1}</td>
											<td>-</td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA1')}</td>
											<td>{collector.performance_coefficients.a1_kW_per_m2_per_K}</td>
											<td><span>kW m<sup>-2</sup>K<sup>-1</sup></span></td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA2')}</td>
											<td>{collector.performance_coefficients.a2_kW_per_m2_per_K2}</td>
											<td><span>kW m<sup>-2</sup>K<sup>-2</sup></span></td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA3')}</td>
											<td>{collector.performance_coefficients.a3_kJ_per_m3_per_K}</td>
											<td><span>kJ m<sup>-3</sup>K<sup>-1</sup></span></td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA4')}</td>
											<td>{collector.performance_coefficients.a4_1}</td>
											<td>-</td>
											<td />
										</tr>
										<tr>
											<td>{$t('common.perfCoeffA5')}</td>
											<td>{collector.performance_coefficients.a5_kJ_per_m2_per_K}</td>
											<td><span>kJ m<sup>-2</sup>K<sup>-1</sup></span></td>
											<td />
										</tr>
									</tbody>
								</table>
							</div>
						{:else if activeParametersTab === 'storage'}
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
														>{(
															parameters.values.storage.volume.value * yearlyHeatDemandMWh
														).toFixed(0)} m<sup>3</sup>
													</td>
												{:else if parameters.values.storage.volume.scaling == 'relative_to_collector_area_m3_per_m2'}
													<td>m<sup>3</sup>m<sup>-2</sup></td>
													<td
														>{(
															parameters.values.storage.volume.value * collectorFieldAreaM2
														).toFixed(0)} m<sup>3</sup>
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
						{:else if activeParametersTab === 'control'}
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
									</tbody>
								</table>
							</div>
						{:else}
							ERROR: Unknown tab `{activeParametersTab}`.
						{/if}
					</div>
				</svelte:fragment>
			</TabGroup>

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
								{#each kpis as kpi}
									<tr>
										<td>{kpi.description}</td>
										<td>{kpi.formattedValue}</td>
										<td>{kpi.unit}</td>
										{#if kpi.note !== null}
											<td>{kpi.note}</td>
										{:else}
											<td />
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<span>{$t('common.KPIsNotAvailable')}</span>
				{/if}

				{#if displayResults}
					{#each displayResults as { id, title, data }}
						<div class="mt-6">
							<h5 class="h5" {id}>{title}</h5>
							{#if data.status === 'not-downloaded' || data.status == 'downloaded'}
								<span>Downloading...</span>
							{:else if data.status === 'not-found'}
								<span>ERROR: Plot could not be found.</span>
							{:else if data.status === 'object-url-created'}
								<img src={data.url} alt={title} />
							{:else}
								<span>INTERNAL ERROR: Unknown display result status {data.status}</span>
							{/if}
						</div>
					{/each}
				{/if}
			{/if}
		</div>
	</div>
</div>
