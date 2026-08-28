<script lang="ts">
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';
	import type { Phase } from '$lib/components/parameters/phase';
	import Size from '$lib/components/parameters/tes/size.svelte';
	import type { TtesStorage } from 'src/lib/openapi/generated/model/ttesStorage';

	export let projectPhase: Phase;
	export let parameters: TtesStorage;
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
