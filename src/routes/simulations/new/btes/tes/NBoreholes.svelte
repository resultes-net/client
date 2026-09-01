<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { ChevronDown } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { ScaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2 as NBoreholes } from '$lib/openapi/generated/model/scaledValueLiteralAbsolute1RelativeToDemand1PerMWhRelativeToCollectorArea1PerM2';

	import { popupSizeApplyReferenceWidthIncludingBorder } from '$lib/components/parameters/common';
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';

	export let parameters: NBoreholes;

	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	let newScaling = parameters.scaling;
	$: {
		const oldScaling = parameters.scaling;

		const yearlyHeatDemandMWh = yearlyHeatDemandGWh * 1000;

		// new -> old
		const scalingFactors: Record<NBoreholes.ScalingEnum, Record<NBoreholes.ScalingEnum, number>> = {
			absolute_1: {
				absolute_1: 1.0,
				relative_to_collector_area_1_per_m2: collectorFieldAreaM2,
				relative_to_demand_1_per_MWh: yearlyHeatDemandMWh
			},
			relative_to_collector_area_1_per_m2: {
				absolute_1: 1.0 / collectorFieldAreaM2,
				relative_to_collector_area_1_per_m2: 1.0,
				relative_to_demand_1_per_MWh: yearlyHeatDemandMWh / collectorFieldAreaM2
			},
			relative_to_demand_1_per_MWh: {
				absolute_1: 1.0 / yearlyHeatDemandMWh,
				relative_to_collector_area_1_per_m2: collectorFieldAreaM2 / yearlyHeatDemandMWh,
				relative_to_demand_1_per_MWh: 1.0
			}
		};

		const scalingFactor = scalingFactors[newScaling][oldScaling];

		const scaleValue = parameters.value * scalingFactor;
		if (newScaling === 'absolute_1') {
			parameters.value = Math.ceil(scaleValue);
		} else {
			parameters.value = Math.round(parameters.value * scalingFactor * 1e4) / 1e4;
		}

		parameters.scaling = newScaling;
	}

	const nBoreholesPopupSettings: PopupSettings = {
		event: 'click',
		target: 'n-boreholes-combobox',
		placement: 'bottom-start',
		closeQuery: '.listbox-item',
		middleware: {
			size: {
				apply: popupSizeApplyReferenceWidthIncludingBorder
			},
			offset: { mainAxis: 0 }
		}
	};
</script>

<div class="z-50 bg-surface-200-700-token-token" data-popup="n-boreholes-combobox">
	<ListBox
		class="bg-surface-200-700-token border-[1px] border-primary-200-700-token"
		rounded="rounded-none"
		active="variant-filled-primary pr-[44px]"
		hover="hover:variant-soft-primary pr-[44px]"
	>
		<ListBoxItem bind:group={newScaling} name="absolute" value={NBoreholes.ScalingEnum.Absolute1}>
			{$t('units.absolute')} [-]
		</ListBoxItem>
		<ListBoxItem
			bind:group={newScaling}
			name="relativeToDemand"
			value={NBoreholes.ScalingEnum.RelativeToDemand1PerMwh}
		>
			{$t('units.relativeToDemand')} [MWh<sup>-1</sup>]
		</ListBoxItem>
		<ListBoxItem
			bind:group={newScaling}
			name="relativeToCollectorArea"
			value={NBoreholes.ScalingEnum.RelativeToCollectorArea1PerM2}
		>
			{$t('units.relativeToCollectorArea')} [m<sup>-2</sup>]
		</ListBoxItem>
	</ListBox>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="storage-volume">{$t('btes.NumberOfBoreholes')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-button-grid-cols]">
		<input
			class="input"
			id="volume"
			title={$t('btes.NumberOfBoreholes')}
			type="number"
			min="0"
			bind:value={parameters.value}
		/>
		<button
			class="btn justify-between self-end rounded-l-none border-l-[1px] border-surface-400-500-token"
			use:popup={nBoreholesPopupSettings}
		>
			<span>
				{#if parameters.scaling === 'absolute_1'}
					{$t('units.absolute')} [-]
				{:else if parameters.scaling === 'relative_to_demand_1_per_MWh'}
					{$t('units.relativeToDemand')} [MWh<sup>-1</sup>]
				{:else if parameters.scaling === 'relative_to_collector_area_1_per_m2'}
					{$t('units.relativeToCollectorArea')} [m<sup>-2</sup>]
				{:else}
					ERROR: Unknown scaling `{parameters.scaling}`.
				{/if}
			</span>
			<ChevronDown class="text-surface-400-500-token" size="20" />
		</button>
	</div>
</div>
