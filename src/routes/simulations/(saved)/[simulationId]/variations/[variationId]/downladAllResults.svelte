<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { getResponse } from 'src/ajax';
	import * as auth from 'src/auth';

	export let endPoint: string;
	export let targetFileName: string;
	export let onClose: () => void;

	let closing = false;

	let sizeInMiB: number | null = null;
	let downloadedInBytes = 0;
	let objectUrl: string | null = null;

	onMount(download);

	onDestroy(() => {
		closing = true;

		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
		}
	});

	async function download(): Promise<void> {
		const bearerToken = auth.getAccessToken();

		const response = await getResponse({
			endPoint,
			accept: 'application/zip',
			bearerToken
		});

		if (response.status !== 200) {
			throw new Error(`Error calling API endpoint ${endPoint}`);
		}

		const contentLength = response.headers.get('Content-Length');

		if (contentLength === null) {
			throw new Error(`${endPoint} did not set Content-Length`);
		}

		sizeInMiB = Math.round(Number.parseInt(contentLength) / 1024 / 1024);

		if (response.body === null) {
			throw Error(`${endPoint} returned null body.`);
		}

		const reader = response.body.getReader();

		const array: Uint8Array<ArrayBuffer>[] = [];

		try {
			while (!closing) {
				const { value, done } = await reader.read();

				if (done) {
					break;
				}

				downloadedInBytes += value.length;

				array.push(value);
			}
		} finally {
			reader.releaseLock();
		}

		if (closing) {
			return;
		}

		const blob = new Blob(array, { type: 'application/zip' });

		objectUrl = URL.createObjectURL(blob);
	}
</script>

{#if sizeInMiB !== null}
	{@const downloadedInMiB = Math.round(downloadedInBytes / 1024 / 1024)}
	<div class="card p-4 w-80 flex flex-col">
		<div>Downloading results...</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={downloadedInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{downloadedInMiB} of {sizeInMiB} MiB</div>
		{#if objectUrl}
			<a class="anchor" href={objectUrl} on:click={onClose} download={targetFileName}>Save</a>
		{/if}
	</div>
{/if}
