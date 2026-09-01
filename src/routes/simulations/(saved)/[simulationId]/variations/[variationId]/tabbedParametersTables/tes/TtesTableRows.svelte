<script lang="ts">
	import { type ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2 as Volume } from '$lib/openapi/generated/model/scaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2';
	import type { TtesStorage } from '$lib/openapi/generated/model/ttesStorage';
	import PortHeightsRows from './PortHeightsRows.svelte';
	import VolumeRows from './VolumeRows.svelte';

	import { t } from '$lib/i18n/translations';

	export let parameters: TtesStorage;
	export let yearlyHeatDemandMWh: number;
	export let collectorFieldAreaM2: number;

	const { value: scaledVolume, scaling: volumeScale } = parameters.volume;

	const scalingFactor = (
		{
			absolute_m3: 1,
			relative_to_collector_area_m3_per_m2: collectorFieldAreaM2,
			relative_to_demand_m3_per_MWh: yearlyHeatDemandMWh
		} satisfies Record<Volume.ScalingEnum, number>
	)[volumeScale];

	const volume = scaledVolume * scalingFactor;

	const ratio = parameters.height_to_diameter_ratio_1;

	// V = (D/2)**2*pi * h = (D/2)**2*pi * r*D = D**3/4*pi*r => D = [4*V/(pi*r)]**(1/3)
	const diameter = ((4 * volume) / (Math.PI * ratio)) ** (1 / 3);
	const height = ratio * diameter;
</script>

<VolumeRows parameters={parameters.volume} {yearlyHeatDemandMWh} {collectorFieldAreaM2} />
<PortHeightsRows parameters={parameters.ports_relative_heights_1} />
<tr>
	<td>{$t('ttes.HeightToDiameterRatio')}</td>
	<td>{parameters.height_to_diameter_ratio_1}</td>
	<td>-</td>
	<td>{height.toFixed(2)} m : {diameter.toFixed(2)} m</td>
</tr>
<tr>
	<td>{$t('ttes.InsulationThickness')}</td>
	<td>{parameters.insulation_thickness_cm}</td>
	<td>cm</td>
	<td />
</tr>
