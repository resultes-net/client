<script lang="ts">
	import { type PtesStorage } from '$lib/openapi/generated/model/ptesStorage';

	import type { OnAreParametersValidChanged } from '../onAreParametersValidChanged';
	import type { Phase } from '../phase';
	import Ports from './ports.svelte';
	import Size from './size.svelte';

	export let projectPhase: Phase;
	export let parameters: PtesStorage;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<Size parameters={parameters.volume} {onAreParametersValidChanged} />
{#if projectPhase == 'design'}
	<Ports parameters={parameters.ports_relative_heights_1} {onAreParametersValidChanged} />
{/if}
