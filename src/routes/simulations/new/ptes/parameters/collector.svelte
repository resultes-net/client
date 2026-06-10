<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { ChevronDown } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue } from '$lib/utils';

	import type { CollectorField } from '$lib/openapi/generated/model/collectorField';

	import type { Phase } from './phase';
	import { AreaScalingEnum, MassFlowScalingEnum } from './units';
	import { popupSizeApplyReferenceWidthIncludingBorder } from './common'
	import type { OnAreParametersValidChanged } from './onAreParametersValidChanged';

	export let projectPhase: Phase;
	export let parameters: CollectorField;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	const areaSizeScalingPopupSettings: PopupSettings = createPopupSettings(
		'area-size-scaling-combobox'
	);

	const nominalMassflowScalingPopupSettings: PopupSettings = createPopupSettings(
		'nominal-massflow-scaling-combobox'
	);

	function createPopupSettings(target: string): PopupSettings {
		return {
			event: 'click',
			target: target,
			placement: 'bottom-start',
			closeQuery: '.listbox-item',
			middleware: {
				size: {
					apply: popupSizeApplyReferenceWidthIncludingBorder
				},
				offset: { mainAxis: 0 }
			}
		};
	}

	function onSetOutputTemperatureSetpoint(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		parameters.output_temperature_setpoint_degC = parseAndClampInputValue(
			inputElement.value,
			20,
			200,
			parameters.output_temperature_setpoint_degC
		);
	}
</script>

<div class="z-50 bg-surface-200-700-token-token" data-popup="area-size-scaling-combobox">
	<ListBox
		class="bg-surface-200-700-token border-[1px] border-primary-200-700-token"
		rounded="rounded-none"
		active="variant-filled-primary pr-[44px]"
		hover="hover:variant-soft-primary pr-[44px]"
	>
		<ListBoxItem
			bind:group={parameters.area.scaling}
			name="scaling"
			value={AreaScalingEnum.AbsoluteM2}>{$t('units.absolute')} [m<sup>2</sup>]</ListBoxItem
		>
		<ListBoxItem
			bind:group={parameters.area.scaling}
			name="scaling"
			value={AreaScalingEnum.RelativeToDemandM2PerGwh}
			>{$t('units.relativeToDemand')} [m<sup>2</sup>GWh<sup>-1</sup>]</ListBoxItem
		>
	</ListBox>
</div>

<div class="z-50 bg-surface-200-700-token-token" data-popup="nominal-massflow-scaling-combobox">
	<ListBox
		class="bg-surface-200-700-token border-[1px] border-primary-200-700-token"
		rounded="rounded-none"
		active="variant-filled-primary pr-[44px]"
		hover="hover:variant-soft-primary pr-[44px]"
	>
		<ListBoxItem
			bind:group={parameters.nominal_massflow.scaling}
			name="scaling"
			value={MassFlowScalingEnum.AbsoluteKgPerH}
		>
			{$t('units.absolute')} [kg h<sup>-1</sup>]
		</ListBoxItem>
		<ListBoxItem
			bind:group={parameters.nominal_massflow.scaling}
			name="scaling"
			value={MassFlowScalingEnum.RelativeToCollectorAreaKgPerHM2}
		>
			{$t('units.relativeToDemand')} [kg h<sup>-1</sup>GWh<sup>-1</sup>]
		</ListBoxItem>
	</ListBox>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="collector-area">{$t('common.collectorArea')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-button-grid-cols]">
		<input
			class="input"
			id="collector-area"
			title={$t('common.collectorArea')}
			type="number"
			bind:value={parameters.area.value}
		/>
		<button
			class="btn justify-between self-end rounded-l-none border-l-[1px] border-surface-400-500-token"
			use:popup={areaSizeScalingPopupSettings}
		>
			<span>
				{#if parameters.area.scaling == 'absolute_m2'}
					{$t('units.absolute')} [m<sup>2</sup>]
				{:else}
					{$t('units.relativeToDemand')} [m<sup>2</sup>GWh<sup>-1</sup>]
				{/if}
			</span>
			<ChevronDown class="text-surface-400-500-token" size="20" />
		</button>
	</div>

	<label for="collector-inclination">{$t('common.inclination')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="collector-inclination"
			title={$t('common.inclination')}
			type="number"
		/>
		<div><span class="flex flex-grow justify-center">°</span></div>
	</div>

	<label for="collector-orientation">{$t('common.orientation')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="collector-orientation"
			title={$t('common.orientation')}
			type="number"
		/>
		<div><span class="flex flex-grow justify-center">°</span></div>
	</div>

	<label for="collector-output-setpoint-temperature"
		>{$t('common.collectorOutputSetpointTemperature')}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="collector-output-setpoint-temperature"
			title={$t('common.collectorOutputSetpointTemperature')}
			type="number"
			value={parameters.output_temperature_setpoint_degC}
			min="20"
			max="200"
			on:change={onSetOutputTemperatureSetpoint}
		/>
		<div><span class="flex flex-grow justify-center">°C</span></div>
	</div>

	<label for="collector-type">{$t('common.collectorType')}</label>
	<select class="select w-auto" id="collector-type" bind:value={parameters.type}>
		<option value="flat-plate">{$t('common.flatPlateCollector')}</option>
		<option value="parabolic-through">{$t('common.parabolicTroughCollector')}</option>
	</select>
</div>

{#if projectPhase === 'design'}
	<hr class="!border-t-2 mt-6 mb-4" />
	
	<h7 class="h7">{$t('common.collectorPerformanceCoefficients')}</h7>
	<div
		class="m-2 border rounded-lg dark:border-surface-600 light:boder-surface-300 p-2 grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]"
	>
		<label for="perf-coeff-a0">{$t('common.perfCoeffA0')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input class="input" id="perf-coeff-a0" title={$t('common.perfCoeffA0')} type="number" />
			<div><span class="flex flex-grow justify-center">-</span></div>
		</div>

		<label for="collector-orientation">{$t('common.perfCoeffA1')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input class="input" id="perf-coeff-a1" title={$t('common.perfCoeffA1')} type="number" />
			<div class="!px-0">
				<span class="flex flex-grow justify-center"
					>kWm<sup class="top-1">-2</sup>K<sup class="top-1">-1</sup></span
				>
			</div>
		</div>

		<label for="collector-orientation">{$t('common.perfCoeffA2')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input class="input" id="perf-coeff-a2" title={$t('common.perfCoeffA2')} type="number" />
			<div class="!px-0">
				<span class="flex flex-grow justify-center"
					>kWm<sup class="top-1">-2</sup>K<sup class="top-1">-2</sup></span
				>
			</div>
		</div>
	</div>

	<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
		<label for="nominal-mass-flow">{$t('common.nominalMassFlowRate')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-button-grid-cols]">
			<input
				class="input"
				id="nominal-mass-flow"
				title={$t('common.nominalMassFlowRate')}
				type="number"
				bind:value={parameters.nominal_massflow.value}
			/>
			<button
				class="btn justify-between self-end rounded-l-none border-l-[1px] border-surface-400-500-token"
				use:popup={nominalMassflowScalingPopupSettings}
			>
				<span>
					{#if parameters.nominal_massflow.scaling == 'absolute_kg_per_h'}
						{$t('units.absolute')} [kg h<sup>-1</sup>]
					{:else}
						{$t('units.relativeToDemand')} [kg h<sup>-1</sup>GWh<sup>-1</sup>]
					{/if}
				</span>
				<ChevronDown class="text-surface-400-500-token" size="20" />
			</button>
		</div>
	</div>
{/if}
