<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import type { Financial } from '$lib/openapi/generated/model/financial';
	import type { Type } from '$lib/openapi/generated/model/type';
	import {
		COST_REGIONS,
		switchCostRegion,
		type CostRegion,
		type CostRegionSwitch
	} from '$lib/parameters/financial';
	import NumberRow from './financial/numberRow.svelte';
	import type { Phase } from './phase';

	export let parameters: Financial;
	export let projectPhase: Phase;
	export let systemType: Type;
	// Bound by the parent, as switching parameters tabs destroys this component.
	export let lastCostRegionSwitch: CostRegionSwitch | null;

	// Only the systems with a heat pump use the electricity price.
	$: hasHeatPump = systemType !== 'ttes';

	$: currency = COST_REGIONS[parameters.cost_region].currencySymbol;

	let isShowEnergyPricesResetNotice = false;

	function onCostRegionChanged(event: Event): void {
		const newCostRegion = (event.target as HTMLSelectElement).value as CostRegion;

		const { lastSwitch, wereEditedEnergyPricesReset } = switchCostRegion(
			parameters,
			newCostRegion,
			lastCostRegionSwitch
		);
		lastCostRegionSwitch = lastSwitch;

		isShowEnergyPricesResetNotice = wereEditedEnergyPricesReset;

		parameters = parameters;
	}

	const realDiscountRateInfoPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'realDiscountRateInfoPopup',
		placement: 'top'
	};
</script>

<div data-popup="realDiscountRateInfoPopup">
	<div class="card p-4 variant-filled-secondary z-50 max-w-md">
		<p>{$t('common.RealDiscountRateInfo')}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="m-2 p-2">
	<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
		<label for="cost-region">{$t('common.CostRegion')}</label>
		<select
			class="select"
			id="cost-region"
			value={parameters.cost_region}
			on:change={onCostRegionChanged}
		>
			<option value="eu">{$t('common.CostRegionEu')}</option>
			<option value="ch">{$t('common.CostRegionCh')}</option>
		</select>

		{#if isShowEnergyPricesResetNotice}
			<p class="col-span-2 text-sm variant-soft-warning p-2 rounded">
				{$t('common.EnergyPricesWereReset')}
			</p>
		{/if}

		<NumberRow
			id="real-discount-rate"
			label={$t('common.RealDiscountRate')}
			bind:value={parameters.real_discount_rate_1}
			min={-0.1}
			max={0.3}
		>
			<button
				slot="info"
				type="button"
				class="btn-icon btn-icon-sm [&>*]:pointer-events-none"
				aria-label={$t('common.RealDiscountRateInfo')}
				use:popup={realDiscountRateInfoPopupSettings}
			>
				<Info size="16" />
			</button>
			<svelte:fragment slot="unit">a<sup>-1</sup></svelte:fragment>
		</NumberRow>

		<NumberRow
			id="fuel-price"
			label={$t('common.FuelPrice')}
			bind:value={parameters.fuel_price_per_kWh}
			min={0}
			max={10}
		>
			<svelte:fragment slot="unit">{currency} kWh<sup>-1</sup></svelte:fragment>
		</NumberRow>

		{#if hasHeatPump}
			<NumberRow
				id="electricity-price"
				label={$t('common.ElectricityPrice')}
				bind:value={parameters.electricity_price_per_kWh}
				min={0}
				max={10}
			>
				<svelte:fragment slot="unit">{currency} kWh<sup>-1</sup></svelte:fragment>
			</NumberRow>
		{/if}

		{#if projectPhase === 'design'}
			<NumberRow
				id="lifetime"
				label={$t('common.Lifetime')}
				bind:value={parameters.lifetime_a}
				min={1}
				max={100}
				isInteger
			>
				<svelte:fragment slot="unit">a</svelte:fragment>
			</NumberRow>

			<NumberRow
				id="maintenance-rate"
				label={$t('common.MaintenanceRate')}
				bind:value={parameters.maintenance_rate_1}
				min={0}
				max={0.5}
			>
				<svelte:fragment slot="unit">a<sup>-1</sup></svelte:fragment>
			</NumberRow>

			<NumberRow
				id="boiler-efficiency"
				label={$t('common.BoilerEfficiency')}
				bind:value={parameters.boiler_efficiency_1}
				min={0.1}
				max={1.2}
			>
				<svelte:fragment slot="unit">-</svelte:fragment>
			</NumberRow>
		{/if}
	</div>

	{#if projectPhase === 'design'}
		<h7 class="h7">{$t('common.InvestmentCosts')}</h7>
		<div
			class="grid grid-cols-[--input-grid-cols] border rounded-lg border-surface-300-600-token items-center gap-y-[--input-gap-y] m-2 p-2"
		>
			<p class="col-span-2 text-sm">{$t('common.StorageCostCurve')}</p>
			<NumberRow
				id="storage-cost-a"
				label={$t('common.CoefficientA')}
				bind:value={parameters.storage_cost.a}
				min={0}
				max={1e7}
				displayDecimals={2}
			>
				<svelte:fragment slot="unit">{currency} m<sup>-3</sup></svelte:fragment>
			</NumberRow>
			<NumberRow
				id="storage-cost-b"
				label={$t('common.ExponentB')}
				bind:value={parameters.storage_cost.b}
				min={-2}
				max={1}
			>
				<svelte:fragment slot="unit">-</svelte:fragment>
			</NumberRow>

			<p class="col-span-2 text-sm pt-2">{$t('common.CollectorFieldCostCurve')}</p>
			<NumberRow
				id="collector-field-cost-a"
				label={$t('common.CoefficientA')}
				bind:value={parameters.collector_field_cost.a}
				min={0}
				max={1e5}
				displayDecimals={2}
			>
				<svelte:fragment slot="unit">{currency} m<sup>-2</sup></svelte:fragment>
			</NumberRow>
			<NumberRow
				id="collector-field-cost-b"
				label={$t('common.ExponentB')}
				bind:value={parameters.collector_field_cost.b}
				min={-2}
				max={1}
			>
				<svelte:fragment slot="unit">-</svelte:fragment>
			</NumberRow>

			<div class="col-span-2 pt-2" />
			{#if hasHeatPump}
				<NumberRow
					id="heat-pump-cost"
					label={$t('common.HeatPumpCost')}
					bind:value={parameters.heat_pump_cost_per_kW}
					min={0}
					max={1e5}
					displayDecimals={2}
				>
					<svelte:fragment slot="unit">{currency} kW<sub>th</sub><sup>-1</sup></svelte:fragment>
				</NumberRow>
			{/if}
			<NumberRow
				id="boiler-cost"
				label={$t('common.BoilerCost')}
				bind:value={parameters.boiler_cost_per_kW}
				min={0}
				max={1e5}
				displayDecimals={2}
			>
				<svelte:fragment slot="unit">{currency} kW<sub>th</sub><sup>-1</sup></svelte:fragment>
			</NumberRow>
		</div>
	{/if}
</div>
