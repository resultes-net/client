<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n/translations';
	import type { BtesKpis } from './tabbedKpisTables/createBtesKpis';
	import type { PtesKpis } from './tabbedKpisTables/createPtesKpis';
	import type { TtesKpis } from './tabbedKpisTables/createTtesKpis';

	export let kpis: TtesKpis | PtesKpis | BtesKpis;

	function getRelativeToDemandAndLossesParam(absolute: number): { value: string } {
		const totalEnergyInput_GWh =
			kpis.boilerPower_GWh +
			kpis.collectorField.outputPower_GWh +
			(kpis.type === 'ptes' || kpis.type === 'btes' ? kpis.heatPump.compressorPower_GWh : 0);
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
								<td>{$t('common.demand')}</td>
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
								<td>GWh</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.AverageReturnTemperature')}</td>
								<td>{demand.averageReturnTemp_degC.toFixed(2)}</td>
								<td>GWh</td>
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
								<td>{$t('kpis.SpecificCollectorPowerOutput')}</td>
								<td>{collectorField.specificOutputPower_MWh_per_m2.toFixed(2)}</td>
								<td>MWh m<sup>-2</sup></td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.AnnualPerformanceFactor')}</td>
								<td>{collectorField.performanceFactor_1.toFixed(2)}</td>
								<td>-</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('common.PowerOutput')}</td>
								<td>{collectorField.outputPower_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(collectorField.outputPower_GWh)
									)}
								</td>
							</tr>
						{:else if activeParametersTab === 'storage'}
							{@const storage = kpis.storage}
							<tr>
								<td>{$t('kpis.GrossCharge')}</td>
								<td>{storage.charged_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.GrossDischarge')}</td>
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
								<td>{$t('kpis.EvaporatorPower')}</td>
								<td>{heatPump.evaporatorPower_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td></td>
							</tr>
							<tr>
								<td>{$t('kpis.CompressorPower')}</td>
								<td>{heatPump.compressorPower_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(heatPump.compressorPower_GWh)
									)}
								</td>
							</tr>
							<tr>
								<td>{$t('kpis.CondenserPower')}</td>
								<td>{heatPump.condenserPower_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(heatPump.condenserPower_GWh)
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
								<td>{$t('common.PowerOutput')}</td>
								<td>{kpis.boilerPower_GWh.toFixed(2)}</td>
								<td>GWh</td>
								<td>
									{$t(
										'kpis.percentageOfEnergyInputs',
										getRelativeToDemandAndLossesParam(kpis.boilerPower_GWh)
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
						{:else}
							ERROR: Unknown tab `{activeParametersTab}`.
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	</svelte:fragment>
</TabGroup>
