<script lang="ts">
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';

	import { t } from '$lib/i18n/translations';
	import type { ParametersOutput } from 'src/lib/openapi/generated/model/parametersOutput';
	import BtesTableRows from './tabbedParametersTables/tes/BtesTableRows.svelte';
	import PtesTableRows from './tabbedParametersTables/tes/PtesTableRows.svelte';
	import TtesTableRows from './tabbedParametersTables/tes/TtesTableRows.svelte';

	export let parameters: ParametersOutput;

	const demand = parameters.values.demand;

	const yearlyHeatDemandMWh = demand.hourly_heat_demand_MW.reduce(
		(s, p) => s + demand.scaling_factor * p,
		0
	);

	const yearlyHeatDemandGWh = yearlyHeatDemandMWh / 1000;

	const collectorFieldArea = parameters.values.collector_field.area;
	const collectorFieldAreaScalingFactor =
		collectorFieldArea.scaling === 'relative_to_demand_m2_per_MWh' ? yearlyHeatDemandMWh : 1.0;
	const collectorFieldAreaM2 = collectorFieldArea.value * collectorFieldAreaScalingFactor;

	type ActiveParamtersTab = 'demand' | 'collector' | 'storage' | 'control';
	let activeParametersTab: ActiveParamtersTab = 'demand';
</script>

<TabGroup>
	<Tab bind:group={activeParametersTab} name="demand" value="demand">{$t('common.demand')}</Tab>
	<Tab bind:group={activeParametersTab} name="collector" value="collector"
		>{$t('common.CollectorField')}</Tab
	>
	<Tab bind:group={activeParametersTab} name="demand" value="storage">{$t('common.storage')}</Tab>
	<Tab bind:group={activeParametersTab} name="demand" value="control">{$t('common.Control')}</Tab>

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
							<tr>
								<td>{$t('common.yearlyHeatDemand')}</td>
								<td>{yearlyHeatDemandGWh.toFixed(1)}</td>
								<td> GWh </td>
								<td />
							</tr>
						{:else if activeParametersTab === 'collector'}
							{@const collector = parameters.values.collector_field}
							<tr>
								<td>{$t('common.collectorArea')}</td>
								<td>{collector.area.value}</td>
								{#if collector.area.scaling == 'absolute_m2'}
									<td>
										m<sup>2</sup>
									</td>
									<td />
								{:else if collector.area.scaling == 'relative_to_demand_m2_per_MWh'}
									<td>
										m<sup>2</sup> MWh<sup>-1</sup>
									</td>
									<td
										>{collectorFieldAreaM2.toFixed(0)}
										m<sup>2</sup>
									</td>
								{:else}
									ERROR: Unknown area scaling: `{collector.area.scaling}`.
								{/if}
							</tr>
							<tr>
								<td>{$t('common.inclination')}</td>
								<td>{collector.inclination_deg}</td>
								<td>°</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.orientation')}</td>
								<td>{collector.orientation_east_west_deg}</td>
								<td>°</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA0')}</td>
								<td>{collector.performance_coefficients.a0_1}</td>
								<td>-</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA1')}</td>
								<td>{collector.performance_coefficients.a1_kW_per_m2_per_K}</td>
								<td><span>kW m<sup>-2</sup>K<sup>-1</sup></span></td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA2')}</td>
								<td>{collector.performance_coefficients.a2_kW_per_m2_per_K2}</td>
								<td><span>kW m<sup>-2</sup>K<sup>-2</sup></span></td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA3')}</td>
								<td>{collector.performance_coefficients.a3_kJ_per_m3_per_K}</td>
								<td><span>kJ m<sup>-3</sup>K<sup>-1</sup></span></td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA4')}</td>
								<td>{collector.performance_coefficients.a4_1}</td>
								<td>-</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.perfCoeffA5')}</td>
								<td>{collector.performance_coefficients.a5_kJ_per_m2_per_K}</td>
								<td><span>kJ m<sup>-2</sup>K<sup>-1</sup></span></td>
								<td />
							</tr>
						{:else if activeParametersTab === 'storage'}
							{@const systemType = parameters.values.type}
							{#if systemType === 'ttes'}
								<TtesTableRows
									parameters={parameters.values.storage}
									{yearlyHeatDemandMWh}
									{collectorFieldAreaM2}
								/>
							{:else if systemType === 'ptes'}
								<PtesTableRows
									parameters={parameters.values.storage}
									{yearlyHeatDemandMWh}
									{collectorFieldAreaM2}
								/>
							{:else if systemType === 'btes'}
								<BtesTableRows
									parameters={parameters.values.storage}
									{yearlyHeatDemandMWh}
									{collectorFieldAreaM2}
								/>
							{:else}
								ERROR: Unknonw system type `{systemType}`.
							{/if}
						{:else if activeParametersTab === 'control'}
							<tr>
								<td>{$t('common.demandSetpointTemperature')}</td>
								<td>{parameters.values.control.demand_temperature_setpoint_degC}</td>
								<td>°C</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.DemandDeltaT')}</td>
								<td>{parameters.values.control.demand_delta_T_degC}</td>
								<td>°C</td>
								<td />
							</tr>
							<tr>
								<td>{$t('common.maximumStorageTemperature')}</td>
								<td>{parameters.values.control.storage_temperature_maximum_degC}</td>
								<td>°C</td>
								<td />
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
