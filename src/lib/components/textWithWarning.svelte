<script context="module" lang="ts">
	export type Config = {
		shallWarn: boolean;
		errorMessage: string | null;
	};

	// Skeleton opens the first element with a popup's name, so each instance needs its own.
	let nextPopupId = 0;
</script>

<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { TriangleAlert } from 'lucide-svelte';

	import { portal } from '$lib/portal';

	export let text: string;
	export let config: Config;

	const popupTarget = `warningMessagePopup-${nextPopupId++}`;

	const warningMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: popupTarget,
		placement: 'top'
	};
</script>

<div class="flex flex-row gap-x-1">
	{text}
	<div
		class="text-warning-300-600-token"
		hidden={!config.shallWarn}
		use:popup={warningMessagePopupSettings}
	>
		<TriangleAlert />
	</div>
</div>

<div data-popup={popupTarget} use:portal>
	<div hidden={config.errorMessage === null} class="card p-4 variant-filled-warning z-50">
		<p>{config.errorMessage ?? ''}</p>
		<div class="arrow variant-filled-warning" />
	</div>
</div>
