<script lang="ts">
	import { t } from 'src/lib/i18n/translations';
	import { type ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2 as Volume } from 'src/lib/openapi/generated/model/scaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2';

	export let parameters: Volume;
	export let yearlyHeatDemandMWh: number;
	export let collectorFieldAreaM2: number;
</script>

<tr>
	<td>{$t('common.storageVolume')}</td>
	<td>{parameters.value}</td>
	{#if parameters.scaling == 'absolute_m3'}
		<td>m<sup>3</sup></td>
		<td />
	{:else if parameters.scaling == 'relative_to_demand_m3_per_MWh'}
		<td>m<sup>3</sup>MWh<sup>-1</sup></td>
		<td>{(parameters.value * yearlyHeatDemandMWh).toFixed(0)} m<sup>3</sup> </td>
	{:else if parameters.scaling == 'relative_to_collector_area_m3_per_m2'}
		<td>m<sup>3</sup>m<sup>-2</sup></td>
		<td>{(parameters.value * collectorFieldAreaM2).toFixed(0)} m<sup>3</sup> </td>
	{/if}
</tr>
