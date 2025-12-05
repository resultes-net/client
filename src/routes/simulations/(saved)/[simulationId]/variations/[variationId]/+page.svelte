<script lang="ts">
	import { onDestroy } from 'svelte';

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

	import { page } from '$app/stores';

	import { getBreadCrumbsStore } from '../../../breadCrumbs';

	import DownladAllResults from './downladAllResults.svelte';

	export let data;

	let { displayResults } = data;

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

	onDestroy(() => {
		for (const displayResult of displayResults) {
			const url = displayResult.url;

			if (url) {
				URL.revokeObjectURL(url);
			}
		}
	});
</script>

<div data-popup="variation-menu-drop-down">
	<nav class="list-nav bg-surface-50-900-token pt-2">
		<div class="arrow bg-surface-50-900-token" />
		<ul>
			<li>
				<button on:click={downloadAllResults}>Download all results</button>
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
			{#each displayResults as displayResult}
				<h5 class="h5" id={displayResult.id}>{displayResult.title}</h5>
				{#if displayResult.url}
					<img src={displayResult.url} alt={displayResult.title} />
				{/if}
			{/each}
		</div>
	</div>
</div>
