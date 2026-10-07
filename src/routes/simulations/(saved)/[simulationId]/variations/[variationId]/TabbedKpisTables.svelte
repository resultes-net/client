<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n/translations';
	import { COST_REGIONS } from '$lib/parameters/financial';
	import type { BtesKpis } from './tabbedKpisTables/createBtesKpis';
	import type { PtesKpis } from './tabbedKpisTables/createPtesKpis';
	import type { TtesKpis } from './tabbedKpisTables/createTtesKpis';

	export let kpis: TtesKpis | PtesKpis | BtesKpis;

	function getRelativeToDemandAndLossesParam(absolute: number): { value: string } {
		const totalEnergyInput_GWh =
			kpis.boilerEnergy_GWh +
			kpis.collectorField.outputEnergy_GWh +
			(kpis.type === 'ptes' || kpis.type === 'btes' ? kpis.heatPump.compressorEnergy_GWh : 0);
		const relative_percent = (absolute / totalEnergyInput_GWh) * 100;
		const value = relative_percent.toFixed(2);
		return { value };
	}

	type ActiveParamtersTab = 'demand' | 'collector' | 'storage' | 'heatPump' | 'boiler' | 'district';
	let activeParametersTab: ActiveParamtersTab = 'demand';
</script>

<TabGroup>
	<Tab bind:group={activeParametersTab} name="demand" value="demand">{$t('common.demand')}</Tab>
	<Tab bind:group={activeParametersTab} name="collector" value="collector"
		>{$t('common.CollectorField')}</Tab
	>
	<Tab bind:group={activeParametersTab} name="storage" value="storage">{$t('common.storage')}</Tab>
	{#if kpis.type === 'ptes' || kpis.type === 'btes'}
		<Tab bind:group={activeParametersTab} name="heatPump" value="heatPump"
			>{$t('common.HeatPump')}</Tab
		>
	{/if}
	<Tab bind:group={activeParametersTab} name="boiler" value="boiler">{$t('common.Boiler')}</Tab>
	<Tab bind:group={activeParametersTab} name="district" value="district"
		>{$t('common.DistrictHeatingNetwork')}</Tab
	>
	<Tab bind:group={activeParametersTab} name="financial" value="financial"
		>{$t('common.Financials')}</Tab
	>

	<svelte:fragment slot="panel">
		<div class="ltr:ml-[1%] rtl:mr-[1%]">
			<div class="table-container">
				<table class="table table-hover [&_th]:text-nowrap [&_td]:text-nowrap">
					<thead>
						<tr>
							<th>{$t('common.Description')}</th>
							<th>{$t('common.Value')}</th>
							<th>{$t('common.Unit')}</th>
							<th>{$t('common.Notes')}</th>
						</tr>
					</thead>
					<tbody>
						{#if activeParametersTab === 'demand'}
							{@const demand = kpis.demand}
							<tr>
								<td>{$t('kpis.HeatDemandIncludingNetworkLosses')}</td>
								<td>{demand.demand_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(demand.demand_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.AverageSupplyTemperature')}</td>
								<td>{demand.averageSupplyTemp_degC.toFixed(2)}</td>
								<td>°C</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.AverageReturnTemperature')}</td>
								<td>{demand.averageReturnTemp_degC.toFixed(2)}</td>
								<td>°C</td>
								<td></td>
							</tr>
						{:else if activeParametersTab === 'collector'}
							{@const collectorField = kpis.collectorField}
							<tr>
								<td>{$t('kpis.TotalSolarIrradiationOnCollector')}</td>
								<td>{collectorField.specificTotalIrradiation_MWh_per_m2.toFixed(2)}</td>
								<td>MWh m<sup>-2</sup></td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.SpecificCollectorEnergyOutput')}</td>
								<td>{collectorField.specificOutputEnergy_MWh_per_m2.toFixed(2)}</td>
								<td>MWh m<sup>-2</sup></td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.Efficiency')}</td>
								<td>{collectorField.efficiency_1.toFixed(2)}</td>
								<td>-</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('common.EnergyOutput')}</td>
								<td>{collectorField.outputEnergy_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(collectorField.outputEnergy_GWh)
									)}
								</td>
							</tr>
						{:else if activeParametersTab === 'storage'}
							{@const storage = kpis.storage}
							<tr>
								<td>{$t('kpis.ChargedEnergy')}</td>
								<td>{storage.charged_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.DischargedEnergy')}</td>
								<td>{storage.discharged_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(storage.discharged_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('common.Losses')}</td>
								<td>{storage.losses_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(storage.losses_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.NetHeatGain')}</td>
								<td>{storage.netHeatGain_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(storage.netHeatGain_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.RoundTripEfficiency')}</td>
								<td>{storage.roundTripEfficiency_1.toFixed(2)}</td>
								<td>-</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.NumberOfChargingDischargingCycles')}</td>
								<td>{storage.nChargingCycles_1.toFixed(2)}</td>
								<td>-</td>
								<td></td>
							</tr>
						{:else if activeParametersTab === 'heatPump'}
							{@const heatPump = kpis.heatPump}
							<tr>
								<td>{$t('kpis.EvaporatorEnergy')}</td>
								<td>{heatPump.evaporatorEnergy_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.CompressorEnergy')}</td>
								<td>{heatPump.compressorEnergy_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(heatPump.compressorEnergy_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.CondenserEnergy')}</td>
								<td>{heatPump.condenserEnergy_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(heatPump.condenserEnergy_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.AnnualPerformanceFactor')}</td>
								<td>{heatPump.performanceFactor_1.toFixed(2)}</td>
								<td>-</td>
								<td></td>
							</tr>
						{:else if activeParametersTab === 'boiler'}
							<tr>
								<td>{$t('common.EnergyOutput')}</td>
								<td>{kpis.boilerEnergy_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(kpis.boilerEnergy_GWh)
									)}
								</td>
							</tr>
						{:else if activeParametersTab === 'district'}
							<tr>
								<td>{$t('common.Losses')}</td>
								<td>{kpis.districtHeatingLosses_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(kpis.districtHeatingLosses_GWh)
									)}
								</td>
							</tr>
						{:else if activeParametersTab === 'financial'}
							{#if kpis.financial === null}
								<tr>
									<td colspan="4" class="!whitespace-normal">
										{$t('kpis.FinancialKPIsNotAvailable')}
									</td>
								</tr>
							{:else}
								{@const financial = kpis.financial}
								{@const investmentCost = financial.investmentCost}
								{@const currency = COST_REGIONS[financial.costRegion].currencySymbol}
								<tr>
									<td>{$t('kpis.LevelizedCostOfHeat')}</td>
									<td>{(financial.levelizedCostOfHeat_per_kWh * 1000).toFixed(2)}</td>
									<td>{currency} MWh<sup>-1</sup></td>
									<td></td>
								</tr>
								<tr>
									<td>{$t('kpis.Annuity')}</td>
									<td>{(financial.annuity_per_a / 1000).toFixed(0)}</td>
									<td>{$t('common.Thousand')} {currency} a<sup>-1</sup></td>
									<td></td>
								</tr>
								<tr>
									<td>{$t('kpis.CollectorFieldInvestmentCost')}</td>
									<td>{(investmentCost.collectorField / 1000).toFixed(0)}</td>
									<td>{$t('common.Thousand')} {currency}</td>
									<td></td>
								</tr>
								<tr>
									<td>{$t('kpis.StorageAbsoluteInvestmentCost')}</td>
									<td>{(investmentCost.storage / 1000).toFixed(0)}</td>
									<td>{$t('common.Thousand')} {currency}</td>
									<td></td>
								</tr>
								<tr>
									<td>{$t('kpis.StorageSpecificInvestmentCost')}</td>
									<td>{investmentCost.storagePerDischarged_per_MWh.toFixed(0)}</td>
									<td>{currency} MWh<sup>-1</sup></td>
									<td>{$t('kpis.PerMWhDischarged')}</td>
								</tr>
								{#if investmentCost.heatPump !== null}
									<tr>
										<td>{$t('kpis.HeatPumpInvestmentCost')}</td>
										<td>{(investmentCost.heatPump / 1000).toFixed(0)}</td>
										<td>{$t('common.Thousand')} {currency}</td>
										<td></td>
									</tr>
								{/if}
								<tr>
									<td>{$t('kpis.BoilerInvestmentCost')}</td>
									<td>{(investmentCost.boiler / 1000).toFixed(0)}</td>
									<td>{$t('common.Thousand')} {currency}</td>
									<td></td>
								</tr>
								<tr>
									<td>{$t('kpis.TotalInvestmentCost')}</td>
									<td>{(investmentCost.total / 1000).toFixed(0)}</td>
									<td>{$t('common.Thousand')} {currency}</td>
									<td></td>
								</tr>
							{/if}
						{:else}
							ERROR: Unknown tab `{activeParametersTab}`.
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</svelte:fragment>
</TabGroup>
