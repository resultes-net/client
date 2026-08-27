<script lang="ts">
	import type { PtesStorage } from 'src/lib/openapi/generated/model/ptesStorage';
	import PortHeightsRows from './PortHeightsRows.svelte';
	import VolumeRows from './VolumeRows.svelte';

	export let parameters: PtesStorage;
	export let yearlyHeatDemandMWh: number;
	export let collectorFieldAreaM2: number;
</script>

<VolumeRows parameters={parameters.volume} {yearlyHeatDemandMWh} {collectorFieldAreaM2} />
<PortHeightsRows parameters={parameters.ports_relative_heights_1} />
