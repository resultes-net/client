<script lang="ts">
	import { formatNumber } from '$lib/formatNumber';
	import { locale } from '$lib/i18n/translations';
	import { t } from '$lib/i18n/translations';
	import type { BtesStorage } from '$lib/openapi/generated/model/btesStorage';
	import { getNBoreholes, getVolumeM3 } from '$lib/parameters/btes/toAbsolute';
	import {
		isCoaxialDefault,
		isDoubleUDefault,
		isSingleUDefault
	} from 'src/lib/parameters/btes/heatExchangers';

	export let parameters: BtesStorage;
	export let yearlyHeatDemandMWh: number;
	export let collectorFieldAreaM2: number;

	const { value: scaledNBoreholes, scaling: nBorholesScale } = parameters.n_boreholes;

	const nBoreholes = getNBoreholes(
		parameters.n_boreholes,
		yearlyHeatDemandMWh,
		collectorFieldAreaM2
	);
	const volume = getVolumeM3(parameters, yearlyHeatDemandMWh, collectorFieldAreaM2);

	const heatExchanger = parameters.heat_exchanger;
</script>

<tr>
	<td>{$t('btes.NumberOfBoreholes')}</td>
	<td>
		{#if nBorholesScale === 'absolute_1'}
			{formatNumber(scaledNBoreholes, $locale)}
		{:else if nBorholesScale === 'relative_to_collector_area_1_per_m2'}
			{formatNumber(scaledNBoreholes, $locale)} m<sup>-2</sup>
		{:else if nBorholesScale === 'relative_to_demand_1_per_MWh'}
			{formatNumber(scaledNBoreholes, $locale)} MWh<sup>-1</sup>
		{:else}
			ERROR: Unknown number of boreholes scale: `{nBorholesScale}`.
		{/if}
	</td>
	<td>-</td>
	<td>
		{#if nBorholesScale !== 'absolute_1'}
			{formatNumber(nBoreholes, $locale, 0)} {$t('btes.Boreholes')} |
		{/if}
		{formatNumber(volume, $locale, 0)} m<sup>3</sup>
	</td>
</tr>
<tr>
	<td>{$t('btes.BoreholeSpacing')}</td>
	<td>{formatNumber(parameters.borehole_spacing_m, $locale)}</td>
	<td>m</td>
	<td />
</tr>
<tr>
	<td>{$t('btes.BoreholeDepth')}</td>
	<td>{formatNumber(parameters.borehole_depth_m, $locale)}</td>
	<td>m</td>
	<td />
</tr>
{#if isSingleUDefault(heatExchanger)}
	<tr>
		<td>{$t('btes.HeatExchangerType')}</td>
		<td>{$t('btes.single-U')}</td>
		<td>-</td>
		<td />
	</tr>
{:else if isDoubleUDefault(heatExchanger)}
	<tr>
		<td>{$t('btes.HeatExchangerType')}</td>
		<td>{$t('btes.double-U')}</td>
		<td>-</td>
		<td />
	</tr>
{:else if isCoaxialDefault(heatExchanger)}
	<tr>
		<td>{$t('btes.HeatExchangerType')}</td>
		<td>{$t('btes.coaxial')}</td>
		<td>-</td>
		<td />
	</tr>
{/if}
<tr>
	<td>{$t('btes.FluidToGroundResistance')}</td>
	<td>{formatNumber(heatExchanger.fluid_to_ground_resistance_m_K_per_W, $locale)}</td>
	<td>m KW<sup>-1</sup></td>
	<td />
</tr>
<tr>
	<td>{$t('btes.PipeToPipeResistance')}</td>
	<td>{formatNumber(heatExchanger.pipe_to_pipe_resistance_m_K_per_W, $locale)}</td>
	<td>m KW<sup>-1</sup></td>
	<td />
</tr>
