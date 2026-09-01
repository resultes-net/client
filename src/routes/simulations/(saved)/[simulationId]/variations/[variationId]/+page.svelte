<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import {
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
	import DownladAllResults from './DownloadAllResults.svelte';
	import TabbedKpisTables from './TabbedKpisTables.svelte';
	import ParametersTable from './TabbedParametersTables.svelte';
	import { gotoLoginWithRedirect } from '$lib/components/goto';

	export let data;

	const systemType = data.systemType;
	const parameters = data.parameters;

	$: variation = data.variation;
	$: variationId = variation.id;
	$: kpis = data.kpis;

	let displayResults = data.displayResults;

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
				gotoLoginWithRedirect($page.url);
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
		{ href: '/simulations', text: $t('common.Simulations') },
		{ href: `/simulations/${simulationId}`, text: simulationId },
		{ text: $t('common.Variations') },
		{
			href: `/simulations/${simulationId}/variations/${variationId}`,
			text: variationId
		}
	]);

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
			<h2 class="h2">{$t('common.Variation')} {variationId}</h2>
			<span class="ml-2 font-mono text-xs content-start">{systemType.toLocaleUpperCase()}</span>
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
			<h5 class="h5">{$t('common.Parameters')}</h5>
			<ParametersTable {parameters} />
			{#if variation.state === 'done'}
				<h5 class="h5 mt-6">{$t('kpis.YearlyKPIs')}</h5>
				{#if kpis}
					<TabbedKpisTables {kpis} />
				{:else}
					<span>{$t('kpis.KPIsNotAvailable')}</span>
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
