<!-- The "Financials" rows: totals, then their parts, indented. -->
<script lang="ts">
	import { formatEnergy, formatMoney, formatNumber } from '$lib/formatNumber';
	import { locale, t } from '$lib/i18n/translations';
	import { COST_REGIONS } from '$lib/parameters/financial';
	import type { FinancialKpis } from './kpis';

	export let financial: FinancialKpis;

	$: annuity = financial.annuity;
	$: investmentCost = financial.investmentCost;
	$: currency = COST_REGIONS[financial.costRegion].currencySymbol;
	$: money = (amount: number) => formatMoney(amount, currency, $locale);
	$: energy = (energy_MWh: number) => formatEnergy(energy_MWh, $locale);
	$: maxHourlyAveragePowerNote = (capacity_MW: number) =>
		`${$t('kpis.MaxHourlyAveragePower')}: ${formatNumber(capacity_MW, $locale, 2)} MW`;
</script>

<!-- The parts' first cells are indented. Skeleton's `.table` sets the cells' padding, so the padding needs `!`. -->
<tr>
	<td>{$t('kpis.LevelizedCostOfHeat')}</td>
	<td>{formatNumber(financial.levelizedCostOfHeat_per_kWh * 1000, $locale, 2)}</td>
	<td>{currency} MWh<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td>{$t('kpis.Annuity')}</td>
	<td>{money(annuity.total_per_a).value}</td>
	<td>{money(annuity.total_per_a).unit} a<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.CapitalCost')}</td>
	<td>{money(annuity.capitalCost_per_a).value}</td>
	<td>{money(annuity.capitalCost_per_a).unit} a<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.MaintenanceCost')}</td>
	<td>{money(annuity.maintenanceCost_per_a).value}</td>
	<td>{money(annuity.maintenanceCost_per_a).unit} a<sup>-1</sup></td>
	<td></td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.FuelCost')}</td>
	<td>{money(annuity.fuel.cost_per_a).value}</td>
	<td>{money(annuity.fuel.cost_per_a).unit} a<sup>-1</sup></td>
	<td>
		{$t('kpis.FuelConsumption')}: {energy(annuity.fuel.consumption_MWh).value}
		{energy(annuity.fuel.consumption_MWh).unit} a<sup>-1</sup>
	</td>
</tr>
{#if annuity.electricity !== null}
	<tr>
		<td class="!ps-8">{$t('kpis.ElectricityCost')}</td>
		<td>{money(annuity.electricity.cost_per_a).value}</td>
		<td>{money(annuity.electricity.cost_per_a).unit} a<sup>-1</sup></td>
		<td>
			{$t('kpis.ElectricityConsumption')}: {energy(annuity.electricity.consumption_MWh).value}
			{energy(annuity.electricity.consumption_MWh).unit} a<sup>-1</sup>
		</td>
	</tr>
{/if}
<tr>
	<td>{$t('kpis.TotalInvestmentCost')}</td>
	<td>{money(investmentCost.total).value}</td>
	<td>{money(investmentCost.total).unit}</td>
	<td></td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.CollectorFieldInvestmentCost')}</td>
	<td>{money(investmentCost.collectorField.cost).value}</td>
	<td>{money(investmentCost.collectorField.cost).unit}</td>
	<td>
		{$t('kpis.ApertureArea')}: {formatNumber(
			investmentCost.collectorField.apertureArea_m2,
			$locale,
			0
		)} m²
	</td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.CollectorFieldSpecificInvestmentCost')}</td>
	<td>{formatNumber(investmentCost.collectorField.specificCost_per_m2, $locale, 0)}</td>
	<td>{currency} m<sup>-2</sup></td>
	<td></td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.StorageAbsoluteInvestmentCost')}</td>
	<td>{money(investmentCost.storage.cost).value}</td>
	<td>{money(investmentCost.storage.cost).unit}</td>
	<td>
		{$t('kpis.WaterEquivalentVolume')}: {formatNumber(
			investmentCost.storage.volumeWaterEquivalent_m3,
			$locale,
			0
		)} m³
	</td>
</tr>
<tr>
	<td class="!ps-8">{$t('kpis.StorageSpecificInvestmentCost')}</td>
	<td>{formatNumber(investmentCost.storage.specificCost_per_m3, $locale, 0)}</td>
	<td>{currency} m<sup>-3</sup></td>
	<td>{$t('kpis.PerM3WaterEquivalent')}</td>
</tr>
{#if investmentCost.heatPump !== null}
	<tr>
		<td class="!ps-8">{$t('kpis.HeatPumpInvestmentCost')}</td>
		<td>{money(investmentCost.heatPump.cost).value}</td>
		<td>{money(investmentCost.heatPump.cost).unit}</td>
		<td>{maxHourlyAveragePowerNote(investmentCost.heatPump.capacity_MW)}</td>
	</tr>
{/if}
<tr>
	<td class="!ps-8">{$t('kpis.BoilerInvestmentCost')}</td>
	<td>{money(investmentCost.boiler.cost).value}</td>
	<td>{money(investmentCost.boiler.cost).unit}</td>
	<td>{maxHourlyAveragePowerNote(investmentCost.boiler.capacity_MW)}</td>
</tr>
<tr>
	<td>{$t('kpis.BoilerOnlyFuelCost')}</td>
	<td>{money(financial.boilerOnlyFuelCost_per_a).value}</td>
	<td>{money(financial.boilerOnlyFuelCost_per_a).unit} a<sup>-1</sup></td>
	<td>{$t('kpis.SameDemandAndBoilerEfficiency')}</td>
</tr>
<tr>
	<td>{$t('kpis.StorageInvestmentPerMWhDischarged')}</td>
	<td>{formatNumber(financial.storageInvestmentPerDischarged_per_MWh, $locale, 0)}</td>
	<td>{currency} MWh<sup>-1</sup></td>
	<td>{$t('kpis.PerYear')}</td>
</tr>
