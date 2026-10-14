<!-- Backwards compatibility: remove after 2027-04. The "Financials" rows for results processed before `OutputsVersion` was introduced (version 0). -->
<script lang="ts">
	import { formatMoney, formatNumber } from '$lib/formatNumber';
	import { locale, t } from '$lib/i18n/translations';
	import { COST_REGIONS } from '$lib/parameters/financial';
	import type { LegacyFinancialKpis, Sizes } from './kpis';

	export let financial: LegacyFinancialKpis;
	export let sizes: Sizes | null;

	// The quantities the investment costs are based on, for the "Notes" column. Built here rather than in the cells: the
	// notes are in separate rows, so this way one check of `sizes` covers them all.
	$: investmentCostNotes =
		// Backwards compatibility: remove after 2027-04. Empty notes for results processed before the sizes were introduced.
		sizes === null
			? { collectorField: '', storage: '', boiler: '', heatPump: '' }
			: {
					collectorField: `${$t('kpis.ApertureArea')}: ${formatNumber(sizes.collectorApertureArea_m2, $locale, 0)} m²`,
					storage: `${$t('kpis.WaterEquivalentVolume')}: ${formatNumber(sizes.storageVolumeWaterEquivalent_m3, $locale, 0)} m³`,
					boiler: `${$t('kpis.MaxHourlyAveragePower')}: ${formatNumber(sizes.boilerCapacity_MW, $locale, 2)} MW`,
					heatPump:
						sizes.heatPumpCapacity_MW === null
							? ''
							: `${$t('kpis.MaxHourlyAveragePower')}: ${formatNumber(sizes.heatPumpCapacity_MW, $locale, 2)} MW`
				};

	$: investmentCost = financial.investmentCost;
	$: currency = COST_REGIONS[financial.costRegion].currencySymbol;
</script>

<tr>
	<td>{$t('kpis.LevelizedCostOfHeat')}</td>
	<td>{formatNumber(financial.levelizedCostOfHeat_per_kWh * 1000, $locale, 2)}</td>
	<td>{currency} MWh<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td>{$t('kpis.Annuity')}</td>
	<td>{formatMoney(financial.annuity_per_a, currency, $locale).value}</td>
	<td>{formatMoney(financial.annuity_per_a, currency, $locale).unit} a<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td>{$t('kpis.CollectorFieldInvestmentCost')}</td>
	<td>{formatMoney(investmentCost.collectorField, currency, $locale).value}</td>
	<td>{formatMoney(investmentCost.collectorField, currency, $locale).unit}</td>
	<td>{investmentCostNotes.collectorField}</td>
</tr>
<tr>
	<td>{$t('kpis.StorageAbsoluteInvestmentCost')}</td>
	<td>{formatMoney(investmentCost.storage, currency, $locale).value}</td>
	<td>{formatMoney(investmentCost.storage, currency, $locale).unit}</td>
	<td>{investmentCostNotes.storage}</td>
</tr>
<tr>
	<td>{$t('kpis.StorageSpecificInvestmentCost')}</td>
	<td>{formatNumber(investmentCost.storagePerDischarged_per_MWh, $locale, 0)}</td>
	<td>{currency} MWh<sup>-1</sup></td>
	<td>{$t('kpis.PerMWhDischargedPerYear')}</td>
</tr>
{#if investmentCost.heatPump !== null}
	<tr>
		<td>{$t('kpis.HeatPumpInvestmentCost')}</td>
		<td>{formatMoney(investmentCost.heatPump, currency, $locale).value}</td>
		<td>{formatMoney(investmentCost.heatPump, currency, $locale).unit}</td>
		<td>{investmentCostNotes.heatPump}</td>
	</tr>
{/if}
<tr>
	<td>{$t('kpis.BoilerInvestmentCost')}</td>
	<td>{formatMoney(investmentCost.boiler, currency, $locale).value}</td>
	<td>{formatMoney(investmentCost.boiler, currency, $locale).unit}</td>
	<td>{investmentCostNotes.boiler}</td>
</tr>
<tr>
	<td>{$t('kpis.TotalInvestmentCost')}</td>
	<td>{formatMoney(investmentCost.total, currency, $locale).value}</td>
	<td>{formatMoney(investmentCost.total, currency, $locale).unit}</td>
	<td></td>
</tr>
