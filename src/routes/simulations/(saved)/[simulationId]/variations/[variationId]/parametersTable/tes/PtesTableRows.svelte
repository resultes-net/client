<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import type { ParametersOutput } from 'src/lib/openapi/generated/model/parametersOutput';

	export let parameters: ParametersOutput;
    export let yearlyHeatDemandMWh: number;
    export let collectorFieldAreaM2: number;
</script>

<tr>
	<td>{$t('common.storageVolume')}</td>
	<td>{parameters.values.storage.volume.value}</td>
	{#if parameters.values.storage.volume.scaling == 'absolute_m3'}
		<td>m<sup>3</sup></td>
		<td />
	{:else if parameters.values.storage.volume.scaling == 'relative_to_demand_m3_per_MWh'}
		<td>m<sup>3</sup>MWh<sup>-1</sup></td>
		<td
			>{(parameters.values.storage.volume.value * yearlyHeatDemandMWh).toFixed(0)} m<sup>3</sup>
		</td>
	{:else if parameters.values.storage.volume.scaling == 'relative_to_collector_area_m3_per_m2'}
		<td>m<sup>3</sup>m<sup>-2</sup></td>
		<td
			>{(parameters.values.storage.volume.value * collectorFieldAreaM2).toFixed(0)} m<sup>3</sup>
		</td>
	{/if}
</tr>
<tr>
	<td>{$t('common.portHeightTop')}</td>
	<td>{parameters.values.storage.ports_relative_heights_1.top}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightMiddle')}</td>
	<td>{parameters.values.storage.ports_relative_heights_1.middle}</td>
	<td>&percnt;</td>
	<td />
</tr>
<tr>
	<td>{$t('common.portHeightBottom')}</td>
	<td>{parameters.values.storage.ports_relative_heights_1.bottom}</td>
	<td>&percnt;</td>
	<td />
</tr>
