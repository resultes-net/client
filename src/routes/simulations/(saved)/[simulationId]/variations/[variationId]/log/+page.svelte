<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { EllipsisVertical } from 'lucide-svelte';

	import { getBlob } from 'src/ajax';
	import * as auth from 'src/auth';

	import { getBreadCrumbsStore } from '../../../../breadCrumbs';

	import { FetchError } from 'src/ajax';
	import type { Variation } from 'src/lib/openapi/generated/model/variation';

	const breadCrumbs = getBreadCrumbsStore();

	export let data;
	const variation = data.variation;
	const simulation = data.simulation;

	const simulationId = simulation.id;
	const variationId = variation.id;

	const logMenuPopupSettings: PopupSettings = {
		event: 'click',
		target: 'log-menu-drop-down',
		placement: 'bottom',
		closeQuery: '.closes-popup'
	};

	breadCrumbs.set([
		{ href: '/', text: 'Home' },
		{ href: '/simulations', text: 'Simulations' },
		{ href: `/simulations/${simulationId}`, text: simulationId },
		{ text: 'Variations' },
		{
			href: `/simulations/${simulationId}/variations/${variationId}`,
			text: variationId
		},
		{ href: `/simulations/${simulationId}/variations/${variationId}/log`, text: 'Logs' }
	]);

	class LogFileData {
		constructor(
			public contents: string,
			public objectUrl: string
		) {}
	}
	let logFileStatus: 'unavailable' | LogFileData | null = null;

	function getLogFileName(variation: Variation): string {
		const deckFileBaseName = variation.relative_deck_file_containing_dir_path.split('\\').at(-1)!;
		const logFileName = `${deckFileBaseName}.log`;
		return logFileName;
	}

	async function downloadLogFile(): Promise<LogFileData> {
		const variationEndPoint = `/variations/${variationId}`;
		const logFileName = getLogFileName(variation);
		const endPoint = `${variationEndPoint}/results/${logFileName}`;

		const bearerToken = auth.getAccessToken();

		const blob = await getBlob({
			endPoint,
			bearerToken,
			accept: 'text/plain'
		});

		const textDecoder = new TextDecoder('windows-1251');
		const arrayBuffer = await blob.arrayBuffer();
		const contents = textDecoder.decode(arrayBuffer);
		const objectUrl = URL.createObjectURL(blob);

		const logFileData = new LogFileData(contents, objectUrl);

		return logFileData;
	}

	onMount(async () => {
		try {
			logFileStatus = await downloadLogFile();
		} catch (error) {
			if (error instanceof FetchError) {
				logFileStatus = 'unavailable';
			} else {
				throw error;
			}
		}
	});

	onDestroy(() => {
		if (logFileStatus instanceof LogFileData) {
			URL.revokeObjectURL(logFileStatus.objectUrl);
		}
	});
</script>

<div data-popup="log-menu-drop-down">
	<nav class="bg-secondary-50-900-token list-nav w-52 pt-2">
		<div class="bg-secondary-50-900-token arrow" />
		<ul>
			<li>
				{#if logFileStatus instanceof LogFileData}
					<a href={logFileStatus.objectUrl} class="btn w-full closes-popup">Download log file</a>
				{:else}
					<span class="italic">Log file not available</span>
				{/if}
			</li>
		</ul>
	</nav>
</div>

<div class="flex flex-col mt-6 ml-6">
	<div class="flex flex-row">
		<h2 class="h2">Log entries for Variation {variationId}</h2>
		<div class="self-center" use:popup={logMenuPopupSettings}><EllipsisVertical /></div>
	</div>
	{#if logFileStatus === 'unavailable'}
		<p class="italic mt-6">Log file not available</p>
	{:else if logFileStatus instanceof LogFileData}
		<pre class="pre mt-6">{logFileStatus.contents}</pre>
	{/if}
</div>
