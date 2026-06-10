<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { TriangleAlert } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue } from '$lib/utils';

	import { type TtesPortRelativeHeights } from '$lib/openapi/generated/model/ttesPortRelativeHeights';

	import type { OnAreParametersValidChanged } from '../onAreParametersValidChanged';
	import { afterUpdate } from 'svelte';

	export let parameters: TtesPortRelativeHeights;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	let errorMessage: string | null = null;

	const validationErrorMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'validationeErrorMessagePopup',
		placement: 'top'
	};

	function validate(): void {
		const isValid = parameters.top > parameters.middle && parameters.middle > parameters.bottom;
		onAreParametersValidChanged(isValid);
		errorMessage = isValid ? null : $t('common.portsMustBeInOrder');
	}

	function setRelativeHeight(event: Event, position: keyof TtesPortRelativeHeights): void {
		const inputElement = event.target as HTMLInputElement;

		const percent = parseAndClampInputValue(inputElement, parameters[position] * 100, 0, 100);

		if (percent === null) {
			return;
		}

		parameters[position] = Math.round(percent) / 100;

		validate();
	}

	afterUpdate(validate)
</script>

<div class="flex flex-col my-4">
	<!-- Header -->
	<div class="flex flex-row gap-x-1">
		<h7 class="h7">{$t('common.portHeights')}</h7>
		{#if errorMessage !== null}
			<div
				class="text-warning-300-600-token [&>*]:pointer-events-none"
				use:popup={validationErrorMessagePopupSettings}
			>
				<TriangleAlert />
			</div>
		{/if}
	</div>
	<!-- Form -->
	<div
		class={`grid grid-cols-[--input-grid-cols] border rounded-lg
			${errorMessage !== null ? 'border-warning-300-600-token' : 'border-surface-300-600-token'}
			items-center gap-y-[--input-gap-y] m-2 p-2`}
	>
		<label for="height">{$t('common.top')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="height"
				title={$t('common.top')}
				type="number"
				value={parameters.top * 100}
				min="0"
				max="100"
				step="1"
				on:change={(e) => setRelativeHeight(e, 'top')}
			/>
			<div>
				<span class="flex flex-grow justify-center">%</span>
			</div>
		</div>

		<label for="floor-area">{$t('common.middle')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="floor-area"
				title={$t('common.middle')}
				type="number"
				value={parameters.middle * 100}
				min="0"
				max="100"
				step="1"
				on:change={(e) => setRelativeHeight(e, 'middle')}
			/>
			<div class="!px-0">
				<span class="flex flex-grow justify-center">%</span>
			</div>
		</div>

		<label for="floor-area">{$t('common.bottom')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="floor-area"
				title={$t('common.bottom')}
				type="number"
				value={parameters.bottom * 100}
				min="0"
				max="100"
				step="1"
				on:change={(e) => setRelativeHeight(e, 'bottom')}
			/>
			<div class="!px-0">
				<span class="flex flex-grow justify-center">%</span>
			</div>
		</div>
	</div>
</div>

<div data-popup="validationeErrorMessagePopup">
	<div class="card p-4 variant-filled-warning z-50">
		<p>{errorMessage}</p>
		<div class="arrow variant-filled-warning" />
	</div>
</div>
