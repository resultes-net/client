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

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	import { FetchError } from 'src/ajax';
	import DownladAllResults from './downladAllResults.svelte';
	import { downloadResultToObjectUrl } from './downloadResult';
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
		placement: 'bottom',
		closeQuery: '.closes-popup'
	};

	const breadCrumbs = getBreadCrumbsStore();

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulationId}`, text: simulationId },
		{ text: 'Variations' },
		{
			href: `/simulations/${variationId}/variations/${variationId}`,
			text: variationId
		}
	]);

	function downloadAllResults() {
		const endPoint = `/variations/${variationId}/results`;
		const targetFileName = `${variationId}.zip`;

		const modalComponent: ModalComponent = {
			ref: DownladAllResults,
			props: { endPoint, targetFileName, onClose: modalStore.close }
		};

		const modal: ModalSettings = {
			type: 'component',
			component: modalComponent
		};
		modalStore.trigger(modal);
	}

	async function downloadLogFile() {
		const objectUrl = await downloadResultToObjectUrl({
			resultPath: '/variation.log',
			variationId
		});
		logFileStatus = { objectUrl };
	}

	type LogFileStatus = 'unavailable' | 'available' | 'downloading' | { objectUrl: string };
	let logFileStatus: LogFileStatus = 'unavailable';

	onMount(async () => {
		try {
			await downloadResultToObjectUrl({
				resultPath: 'variation.log',
				variationId,
				httpVerb: 'HEAD',
				fetchFunction: fetch
			});

			logFileStatus = 'available';
		} catch (error) {
			if (!(error instanceof FetchError)) {
				throw error;
			}
		}

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
				<button class="btn w-full closes-popup" on:click={downloadAllResults}>Download all results</button>
			</li>
			<li>
				{#if logFileStatus === 'unavailable'}
					<div class="italic btn w-full closes-popup">No log file available</div>
				{:else if logFileStatus === 'available'}
					<button class="btn w-full text-left" on:click={downloadLogFile}>Download log file</button>
				{:else if logFileStatus === 'downloading'}
					<ProgressBar class="w-full"/>
				{:else}
					<a href={logFileStatus.objectUrl} target="_blank" class="btn w-full closes-popup">Open log file in new tab</a>
				{/if}
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
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{$t('common.collectorArea')}</td>
							<td>{parameters.values.collector_field.area.value}</td>
							<td>
								{#if parameters.values.collector_field.area.scaling == 'absolute_m2'}
									m<sup>2</sup>
								{:else if parameters.values.collector_field.area.scaling == 'relative_to_demand_m2_per_MWh'}
									m<sup>2</sup>GWh<sup>-1</sup>
								{/if}
							</td>
						</tr>
						{#if parameters.values.type === 'ptes'}
							<tr>
								<td>{$t('common.storageVolume')}</td>
								<td>{parameters.values.storage.volume.value}</td>
								<td>
									{#if parameters.values.storage.volume.scaling == 'absolute_m3'}
										m<sup>3</sup>
									{:else if parameters.values.storage.volume.scaling == 'relative_to_demand_m3_per_MWh'}
										m<sup>3</sup>GWh<sup>-1</sup>
									{/if}
								</td>
							</tr>
							<tr>
								<td>{$t('common.portHeightTop')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.top}</td>
								<td>&percnt;</td>
							</tr>
							<tr>
								<td>{$t('common.portHeightMiddle')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.middle}</td>
								<td>&percnt;</td>
							</tr>
							<tr>
								<td>{$t('common.portHeightBottom')}</td>
								<td>{parameters.values.storage.ports_relative_heights_1.bottom}</td>
								<td>&percnt;</td>
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
