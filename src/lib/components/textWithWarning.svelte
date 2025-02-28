<script context="module" lang="ts">
	export type Config = {
		shallWarn: boolean,
		errorMessage: string | null
	};
</script>

<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { TriangleAlert } from 'lucide-svelte';

	export let text: string;
	export let config: Config;

	const warningMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'warningMessagePopup',
		placement: 'top'
	};
</script>

<div class="flex flex-row gap-x-1">
    {text}
    <div class="text-warning-300-600-token" hidden={!config.shallWarn} use:popup={warningMessagePopupSettings}>
        <TriangleAlert />
    </div>
</div>

<div data-popup="warningMessagePopup">
	<div hidden={config.errorMessage === null} class="card p-4 variant-filled-warning z-50">
		<p>config.errorMessasge ?? ''</p>
		<div class="arrow variant-filled-warning" />
	</div>
</div>