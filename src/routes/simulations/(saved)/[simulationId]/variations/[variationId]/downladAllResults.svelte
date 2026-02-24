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

	type DownloadStatus =
		| { status: 'not-started' }
		| { status: 'progressing'; downloadedInBytes: number; sizeInMiB: number }
		| { status: 'done'; sizeInMiB: number; objectUrl: string }
		| { status: 'closing' }
		| { status: 'error'; message: string };

	let downloadStatus: DownloadStatus = { status: 'not-started' };

	onMount(async () => {
		for await (const state of download()) {
			downloadStatus = state;
		}
	});

	onDestroy(() => {
		closing = true;

		if (downloadStatus.status === 'done') {
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
			yield { status: 'error', message: `An error occurred fetching ${endPoint}: ${error}` };
			return;
		}

		if (response.status === 401) {
			onClose();
			goto('/login');
			return;
		}

		if (response.status !== 200) {
			yield { status: 'error', message: `Error calling API endpoint ${endPoint}.` };
			return;
		}

		const contentLength = response.headers.get('Content-Length');

		if (contentLength === null) {
			yield { status: 'error', message: `${endPoint} did not set Content-Length.` };
			return;
		}

		const sizeInMiB = Math.round(Number.parseInt(contentLength) / 1024 / 1024);

		yield { status: 'progressing', downloadedInBytes: 0, sizeInMiB };

		if (response.body === null) {
			yield { status: 'error', message: `${endPoint} returned null body.` };
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

				yield { status: 'progressing', downloadedInBytes, sizeInMiB };

				array.push(value);
			}
		} catch (error) {
			if (!(error instanceof TypeError)) {
				throw error;
			}

			yield { status: 'error', message: `An error occurred reading from the server: ${error}.` };
			return;
		} finally {
			reader.releaseLock();
		}

		if (closing) {
			yield { status: 'closing' };
			return;
		}

		const blob = new Blob(array, { type: 'application/zip' });

		const objectUrl = URL.createObjectURL(blob);

		yield { status: 'done', sizeInMiB, objectUrl };
	}
</script>

<div class="card p-4 w-80 flex flex-col">
	{#if downloadStatus.status === 'progressing'}
		{@const downloadedInMiB = Math.round(downloadStatus.downloadedInBytes / 1024 / 1024)}
		{@const sizeInMiB = downloadStatus.sizeInMiB}
		<div>Downloading results...</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={downloadedInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{downloadedInMiB} of {sizeInMiB} MiB</div>
	{:else if downloadStatus.status === 'done'}
		{@const sizeInMiB = downloadStatus.sizeInMiB}
		<div>Done.</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={sizeInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{sizeInMiB} of {sizeInMiB} MiB</div>
		<a class="anchor" href={downloadStatus.objectUrl} on:click={onClose} download={targetFileName}
			>Save</a
		>
	{:else if downloadStatus.status === 'not-started'}
		<div>Not started.</div>
	{:else if downloadStatus.status === 'closing'}
		<div>Closing.</div>
	{:else if downloadStatus.status === 'error'}
		<div>An error occurred while downloading. Please try again.</div>
		<div class="mt-6 text-xs">Details: {downloadStatus.message}</div>
	{/if}
</div>
