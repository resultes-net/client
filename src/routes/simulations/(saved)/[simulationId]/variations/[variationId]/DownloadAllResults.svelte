<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { ProgressBar } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';
	import { getResponse } from 'src/ajax';
	import * as auth from 'src/auth';
	import { gotoLoginWithRedirect } from '$lib/components/goto';

	export let endPoint: string;
	export let targetFileName: string;
	export let onClose: ({ closeModal }: { closeModal?: boolean }) => void;

	let closing = false;

	type DownloadStatus =
		| { status: 'not-started' }
		| { status: 'progressing'; downloadedInMiB: number; sizeInMiB: number }
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

		onClose({ closeModal: false });
	});

	function bytesToFullMiB(bytes: number): number {
		return Math.round(bytes / 1024 / 1024);
	}

	async function* download(): AsyncIterable<DownloadStatus> {
		const token = auth.getTokenOrNull();

		if (token === null) {
			gotoLoginWithRedirect($page.url);
			yield { status: 'error', message: 'Not logged in.' };
			return;
		}

		let response: Response;
		try {
			response = await getResponse({
				endPoint,
				accept: 'application/zip',
				bearerToken: token.token
			});
		} catch (error) {
			yield { status: 'error', message: `An error occurred fetching ${endPoint}: ${error}` };
			return;
		}

		if (response.status === 401) {
			onClose({ closeModal: true });
			gotoLoginWithRedirect($page.url);
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

		const sizeInBytes = Number.parseInt(contentLength);
		const sizeInMiB = bytesToFullMiB(sizeInBytes);

		yield { status: 'progressing', downloadedInMiB: 0, sizeInMiB };

		if (response.body === null) {
			yield { status: 'error', message: `${endPoint} returned null body.` };
			return;
		}

		const array: Uint8Array<ArrayBuffer>[] = [];

		let downloadedInBytes = 0;
		let previouslyDownloadedInMiB = 0;
		try {
			for await (const chunk of response.body) {
				if (closing) {
					break;
				}

				downloadedInBytes += chunk.length;

				const downloadedInMiB = bytesToFullMiB(downloadedInBytes);

				if (downloadedInMiB > previouslyDownloadedInMiB) {
					yield { status: 'progressing', downloadedInMiB, sizeInMiB };
					previouslyDownloadedInMiB = downloadedInMiB;
				}

				array.push(chunk);
			}
		} catch (error) {
			if (!(error instanceof TypeError)) {
				throw error;
			}

			yield { status: 'error', message: `An error occurred reading from the server: ${error}.` };
			return;
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
		<div>Downloading results...</div>
		<ProgressBar
			class="mt-2 w-4/5 self-center"
			value={downloadStatus.downloadedInMiB}
			max={downloadStatus.sizeInMiB}
		/>
		<div class="text-xs mt-1 mb-2">
			{downloadStatus.downloadedInMiB} of {downloadStatus.sizeInMiB} MiB
		</div>
	{:else if downloadStatus.status === 'done'}
		{@const sizeInMiB = downloadStatus.sizeInMiB}
		<div>Done.</div>
		<ProgressBar class="mt-2 w-4/5 self-center" value={sizeInMiB} max={sizeInMiB} />
		<div class="text-xs mt-1 mb-2">{sizeInMiB} of {sizeInMiB} MiB</div>
		<a
			class="anchor"
			href={downloadStatus.objectUrl}
			on:click={() => onClose({ closeModal: true })}
			download={targetFileName}>Save</a
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
