<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { ChevronDown } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import {
		ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2 as Size,
		type ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2 as SizeType
	} from '$lib/openapi/generated/model/scaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWhRelativeToCollectorAreaM3PerM2';

	import { popupSizeApplyReferenceWidthIncludingBorder } from '$lib/components/parameters/common';
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';

	export let parameters: SizeType = { scaling: 'relative_to_collector_area_m3_per_m2', value: 2 };

	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	let newScaling = parameters.scaling;
	$: {
		const oldScaling = parameters.scaling;

		const yearlyHeatDemandMWh = yearlyHeatDemandGWh * 1000;

		// new -> old
		const scalingFactors: Record<Size.ScalingEnum, Record<Size.ScalingEnum, number>> = {
			absolute_m3: {
				absolute_m3: 1.0,
				relative_to_collector_area_m3_per_m2: collectorFieldAreaM2,
				relative_to_demand_m3_per_MWh: yearlyHeatDemandMWh
			},
			relative_to_collector_area_m3_per_m2: {
				absolute_m3: 1.0 / collectorFieldAreaM2,
				relative_to_collector_area_m3_per_m2: 1.0,
				relative_to_demand_m3_per_MWh: yearlyHeatDemandMWh / collectorFieldAreaM2
			},
			relative_to_demand_m3_per_MWh: {
				absolute_m3: 1.0 / yearlyHeatDemandMWh,
				relative_to_collector_area_m3_per_m2: collectorFieldAreaM2 / yearlyHeatDemandMWh,
				relative_to_demand_m3_per_MWh: 1.0
			}
		};

		const scalingFactor = scalingFactors[newScaling][oldScaling];

		parameters.value = Math.round(parameters.value * scalingFactor * 100) / 100;
		parameters.scaling = newScaling;
	}

	function throwUnknownSizeTypeError(scaling: Size.ScalingEnum): never {
		throw new Error(`Unknown scaling: ${scaling}.`);
	}

	const sizePopupSettings: PopupSettings = {
		event: 'click',
		target: 'size-combobox',
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

<div class="z-50 bg-surface-200-700-token-token" data-popup="size-combobox">
	<ListBox
		class="bg-surface-200-700-token border-[1px] border-primary-200-700-token"
		rounded="rounded-none"
		active="variant-filled-primary pr-[44px]"
		hover="hover:variant-soft-primary pr-[44px]"
	>
		<ListBoxItem bind:group={newScaling} name="absolute" value={Size.ScalingEnum.AbsoluteM3}>
			{$t('units.absolute')} [m<sup>3</sup>]
		</ListBoxItem>
		<ListBoxItem
			bind:group={newScaling}
			name="relative"
			value={Size.ScalingEnum.RelativeToDemandM3PerMwh}
		>
			{$t('units.relativeToDemand')} [m<sup>3</sup>MWh<sup>-1</sup>]
		</ListBoxItem>
		<ListBoxItem
			bind:group={newScaling}
			name="relative"
			value={Size.ScalingEnum.RelativeToCollectorAreaM3PerM2}
		>
			{$t('units.relativeToCollectorArea')} [m<sup>3</sup>m<sup>-2</sup>]
		</ListBoxItem>
	</ListBox>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="storage-volume">{$t('common.storageVolume')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-button-grid-cols]">
		<input
			class="input"
			id="volume"
			title={$t('common.volume')}
			type="number"
			min="0"
			bind:value={parameters.value}
		/>
		<button
			class="btn justify-between self-end rounded-l-none border-l-[1px] border-surface-400-500-token"
			use:popup={sizePopupSettings}
		>
			<span>
				{#if parameters.scaling === 'absolute_m3'}
					{$t('units.absolute')} [m<sup>3</sup>]
				{:else if parameters.scaling === 'relative_to_demand_m3_per_MWh'}
					{$t('units.relativeToDemand')} [m<sup>3</sup>MWh<sup>-1</sup>]
				{:else if parameters.scaling === 'relative_to_collector_area_m3_per_m2'}
					{$t('units.relativeToCollectorArea')} [m<sup>3</sup>m<sup>-2</sup>]
				{:else}
					ERROR: Uknown scalilng
				{/if}
			</span>
			<ChevronDown class="text-surface-400-500-token" size="20" />
		</button>
	</div>
</div>
