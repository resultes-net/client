<script lang="ts">
	import { ListBox, ListBoxItem, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { ChevronDown } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { type Size } from '$lib/openapi/generated/model/size';
	import { TtesSizeAbsolute } from '$lib/openapi/generated/model/ttesSizeAbsolute';
	import { TtesSizeScaledHeight } from '$lib/openapi/generated/model/ttesSizeScaledHeight';
	import { TtesSizeScaledFloorArea } from '$lib/openapi/generated/model/ttesSizeScaledFloorArea';

	import { popupSizeApplyReferenceWidthIncludingBorder } from '../common';

	export let parameters: Size;

	function throwUnknownSizeTypeError(size_type: string): never {
		throw new Error(`Unknown size type: ${size_type}.`);
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
			bind:group={parameters.size_type}
			name="absolute"
			value={TtesSizeAbsolute.SizeTypeEnum.Absolute}
		>
			{$t('units.absolute')}
		</ListBoxItem>
		<ListBoxItem
			bind:group={parameters.size_type}
			name="relative-height"
			value={TtesSizeScaledHeight.SizeTypeEnum.ScaledHeight}
			>{$t('units.heightRelativeToDemand')}
		</ListBoxItem>
		<ListBoxItem
			bind:group={parameters.size_type}
			name="relative-floor-area"
			value={TtesSizeScaledFloorArea.SizeTypeEnum.ScaledFloorArea}
			>{$t('units.floorAreaRelativeToDemand')}
		</ListBoxItem>
	</ListBox>
</div>

<div class="flex flex-col">
	<!-- Header -->
	<div class="flex flex-row w-full">
		<h7 class="h7 self-end">{$t('common.storageVolume')}</h7>
		<button
			class="btn border-[1px] bg-surface-200-700-token border-surface-400-500-token w-[35%] ml-auto"
			use:popup={sizePopupSettings}
		>
			<span class="mr-auto">
				{#if parameters.size_type == 'absolute'}
					{$t('units.absolute')}
				{:else if parameters.size_type == 'scaled_height'}
					{$t('units.heightRelativeToDemand')}
				{:else if parameters.size_type == 'scaled-floor-area'}
					{$t('units.floorAreaRelativeToDemand')}
				{:else}
					{throwUnknownSizeTypeError(parameters.size_type)}
				{/if}
			</span>
			<ChevronDown class="text-surface-400-500-token" size="20" />
		</button>
	</div>

	<!-- Form -->
	<div
		class="m-2 border rounded-lg dark:border-surface-600 light:boder-surface-300 p-2 grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]"
	>
		{#if parameters.size_type == 'absolute'}
			<label for="volume">{$t('common.volume')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="volume"
					title={$t('common.volume')}
					type="number"
					bind:value={parameters.volume_m3}
				/>
				<div><span class="flex flex-grow justify-center">m<sup class="top-1">3</sup></span></div>
			</div>
		{:else if parameters.size_type == 'scaled_height'}
			<label for="height">{$t('common.height')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="height"
					title={$t('common.height')}
					type="number"
					bind:value={parameters.height_relative_to_demand_m_per_GWh}
				/>
				<div>
					<span class="flex flex-grow justify-center">m GWh<sup class="top-1">-1</sup></span>
				</div>
			</div>

			<label for="floor-area">{$t('common.floorArea')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="floor-area"
					title={$t('common.floorArea')}
					type="number"
					bind:value={parameters.floor_area_m2}
				/>
				<div class="!px-0">
					<span class="flex flex-grow justify-center">m<sup class="top-1">2</sup></span>
				</div>
			</div>
		{:else if parameters.size_type == 'scaled-floor-area'}
			<label for="height">{$t('common.height')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="height"
					title={$t('common.height')}
					type="number"
					bind:value={parameters.height_m}
				/>
				<div>
					<span class="flex flex-grow justify-center">m</span>
				</div>
			</div>

			<label for="floor-area">{$t('common.floorArea')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="floor-area"
					title={$t('common.floorArea')}
					type="number"
					bind:value={parameters.floor_area_relative_to_demand_m2_per_GWh}
				/>
				<div class="!px-0">
					<span class="flex flex-grow justify-center">m<sup class="top-1">2</sup> GWh<sup class="top-1">-1</sup></span>
				</div>
			</div>
		{:else}
			{throwUnknownSizeTypeError(parameters.size_type)}
		{/if}
	</div>
</div>
