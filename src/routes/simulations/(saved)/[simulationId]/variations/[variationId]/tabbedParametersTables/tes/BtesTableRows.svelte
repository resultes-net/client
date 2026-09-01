<script lang="ts">
	import { t } from 'src/lib/i18n/translations';
	import type { BtesStorage } from 'src/lib/openapi/generated/model/btesStorage';
	import { ScaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2 as NBoreholes } from 'src/lib/openapi/generated/model/scaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2';

	export let parameters: BtesStorage;
	export let yearlyHeatDemandMWh: number;
	export let collectorFieldAreaM2: number;

	const { value: scaledNBoreholes, scaling: nBorholesScale } = parameters.n_boreholes;

	const scalingFactor = (
		{
			absolute_1: 1,
			relative_to_collector_area_1_per_m2: collectorFieldAreaM2,
			relative_to_demand_1_per_MWh: yearlyHeatDemandMWh
		} satisfies Record<NBoreholes.ScalingEnum, number>
	)[nBorholesScale];

	const nBoreholes = Math.ceil(scaledNBoreholes * scalingFactor);
	const volume =
		nBoreholes *
		(0.525 * parameters.borehole_spacing_m) ** 2 *
		Math.PI *
		parameters.borehole_depth_m;
</script>

<tr>
	<td>{$t('btes.NumberOfBoreholes')}</td>
	<td>
		{#if nBorholesScale === 'absolute_1'}
			{scaledNBoreholes}
		{:else if nBorholesScale === 'relative_to_collector_area_1_per_m2'}
			{scaledNBoreholes} m<sup>-2</sup>
		{:else if nBorholesScale === 'relative_to_demand_1_per_MWh'}
			{scaledNBoreholes} MWh<sup>-1</sup>
		{:else}
			ERROR: Unknown number of boreholes scale: `{nBorholesScale}`.
		{/if}
	</td>
	<td>-</td>
	<td>
		{#if nBorholesScale !== 'absolute_1'}
			{nBoreholes} {$t('btes.Boreholes')} |
		{/if}
		{volume.toFixed(0)} m<sup>3</sup>
	</td>
</tr>
<tr>
	<td>{$t('btes.BoreholeSpacing')}</td>
	<td>{parameters.borehole_spacing_m}</td>
	<td>m</td>
	<td />
</tr>
<tr>
	<td>{$t('btes.BoreholeDepth')}</td>
	<td>{parameters.borehole_depth_m}</td>
	<td>m</td>
	<td />
</tr>
