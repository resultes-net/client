<script lang="ts">
	import { type PtesStorage } from '$lib/openapi/generated/model/ptesStorage';

	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';
	import type { Phase } from '$lib/components/parameters/phase';
	import Ports from '$lib/components/parameters/tes/ports.svelte';
	import Size from '$lib/components/parameters/tes/size.svelte';

	export let projectPhase: Phase;
	export let parameters: PtesStorage;
	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<Size
	parameters={parameters.volume}
	{yearlyHeatDemandGWh}
	{collectorFieldAreaM2}
	{onAreParametersValidChanged}
/>
{#if projectPhase == 'design'}
	<Ports parameters={parameters.ports_relative_heights_1} {onAreParametersValidChanged} />
{/if}
