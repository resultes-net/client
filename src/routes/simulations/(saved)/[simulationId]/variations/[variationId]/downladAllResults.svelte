<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';
	import { getResponse } from 'src/ajax';
	import * as auth from 'src/auth';

	export let endPoint: string;
	export let targetFileName: string;
	export let onClose: () => void;

	let closing = false;

	class Progress {
		constructor(
			public downloadedInBytes: number,
			public sizeInMiB: number
		) {}
	}

	class Done extends Progress {
		constructor(
			downloadedInBytes: number,
			sizeInMiB: number,
			public objectUrl: string
		) {
			super(downloadedInBytes, sizeInMiB);
		}
	}

	class DownloadError {
		constructor(public message: string) {}
	}

	type DownloadStatus = 'not-started' | Progress | Done | 'closing' | DownloadError;

	let downloadStatus: DownloadStatus = 'not-started';

	onMount(async () => {
		for await (const state of download()) {
			downloadStatus = state;
		}
	});

	onDestroy(() => {
		closing = true;

		if (downloadStatus instanceof Done) {
			URL.revokeObjectURL(downloadStatus.objectUrl);
		}
	});

	async function* download(): AsyncIterable<DownloadStatus> {
		const bearerToken = auth.getAccessToken();

		let response: Response;
		try {
			response = await getResponse({
				endPoint,
				accept: 'application/zip',
				bearerToken
			});
		} catch (error) {
			yield new DownloadError(`An error occurred fetching ${endPoint}: ${error}`);
			return;
		}

		if (response.status === 401) {
			onClose();
			goto('/login');
			return;
		}

		if (response.status !== 200) {
			yield new DownloadError(`Error calling API endpoint ${endPoint}.`);
			return;
		}

		const contentLength = response.headers.get('Content-Length');

		if (contentLength === null) {
			yield new DownloadError(`${endPoint} did not set Content-Length.`);
			return;
		}

		const sizeInMiB = Math.round(Number.parseInt(contentLength) / 1024 / 1024);

		yield new Progress(0, sizeInMiB);

		if (response.body === null) {
			yield new DownloadError(`${endPoint} returned null body.`);
			return;
		}

		const reader = response.body.getReader();

		const array: Uint8Array<ArrayBuffer>[] = [];

		let downloadedInBytes = 0;
		try {
			while (!closing) {
				const { value, done } = await reader.read();

				if (done) {
					break;
				}

				downloadedInBytes += value.length;

				yield new Progress(downloadedInBytes, sizeInMiB);

				array.push(value);
			}
		} catch (error) {
			if (!(error instanceof TypeError)) {
				throw error;
			}

			yield new DownloadError(`An error occurred reading from the server: ${error}.`);
			return;
		} finally {
			reader.releaseLock();
		}

		if (closing) {
			yield 'closing';
			return;
		}

		const blob = new Blob(array, { type: 'application/zip' });

		const objectUrl = URL.createObjectURL(blob);

		yield new Done(downloadedInBytes, sizeInMiB, objectUrl);
	}
</script>

<div class="card p-4 w-80 flex flex-col">
	<!-- ORDER IS IMPORTANT: `Done` inherits from `Progress` so must be checked against first -->
	{#if downloadStatus instanceof Done}
		{@const downloadedInMiB = Math.round(downloadStatus.downloadedInBytes / 1024 / 1024)}
		{@const sizeInMiB = downloadStatus.sizeInMiB}
		<div>Done.</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={downloadedInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{downloadedInMiB} of {sizeInMiB} MiB</div>
		<a class="anchor" href={downloadStatus.objectUrl} on:click={onClose} download={targetFileName}
			>Save</a
		>
	{:else if downloadStatus instanceof Progress}
		{@const downloadedInMiB = Math.round(downloadStatus.downloadedInBytes / 1024 / 1024)}
		{@const sizeInMiB = downloadStatus.sizeInMiB}
		<div>Downloading results...</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={downloadedInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{downloadedInMiB} of {sizeInMiB} MiB</div>
	{:else if downloadStatus === 'not-started'}
		<div>Not started.</div>
	{:else if downloadStatus === 'closing'}
		<div>Closing.</div>
	{:else if downloadStatus instanceof DownloadError}
		<div>An error occurred while downloading. Please try again.</div>
		<div class="mt-6 text-xs">Details: {downloadStatus.message}</div>
	{/if}
</div>
