<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { ChevronDown } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh } from '$lib/openapi/generated/model/scaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh';

	import { popupSizeApplyReferenceWidthIncludingBorder } from '../common';
	import type { OnAreParametersValidChanged } from '../onAreParametersValidChanged';

	export let parameters: ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	function throwUnknownSizeTypeError(
		scaling: ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh.ScalingEnum
	): never {
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
		<ListBoxItem
			bind:group={parameters.scaling}
			name="absolute"
			value={ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh.ScalingEnum.AbsoluteM3}
		>
			{$t('units.absolute')} [m<sup>3</sup>]
		</ListBoxItem>
		<ListBoxItem
			bind:group={parameters.scaling}
			name="relative"
			value={ScaledValueLiteralAbsoluteM3RelativeToDemandM3PerMWh.ScalingEnum
				.RelativeToDemandM3PerMwh}
		>
			{$t('units.relativeToDemand')} [m<sup>3</sup>MWh<sup>-1</sup>]
		</ListBoxItem>
	</ListBox>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="collector-area">{$t('common.collectorArea')}</label>
	<div class="input-group input-group-divider grid grid-cols-[--input-button-grid-cols]">
		<input
			class="input"
			id="volume"
			title={$t('common.volume')}
			type="number"
			bind:value={parameters.value}
		/>
		<button
			class="btn justify-between self-end rounded-l-none border-l-[1px] border-surface-400-500-token"
			use:popup={sizePopupSettings}
		>
			<span>
				{#if parameters.scaling === 'absolute_m3'}
					{$t('units.absolute')} [m<sup>3</sup>]
				{:else}
					{$t('units.relativeToDemand')} [m<sup>3</sup>MWh<sup>-1</sup>]
				{/if}
			</span>
			<ChevronDown class="text-surface-400-500-token" size="20" />
		</button>
	</div>
</div>
