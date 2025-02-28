<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { TriangleAlert } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';

	import { type TtesPortRelativeHeights } from '$lib/openapi/generated/model/ttesPortRelativeHeights';

	export let parameters: TtesPortRelativeHeights;

	let errorMessage: string | null = null;

	const validationErrorMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'validationeErrorMessagePopup',
		placement: 'top'
	};

	function validate(): void {
		const isValid = parameters.top > parameters.middle && parameters.middle > parameters.bottom;
		errorMessage = isValid ? null : $t('ttes.portsMustBeInOrder');
	}

	function setRelativeHeight(event: Event, position: keyof TtesPortRelativeHeights): void {
		const inputElement = event.target as HTMLInputElement;

		const string = inputElement.value;
		const isEmpty = string.trim() === '';

		const number = Number(string);

		if (isEmpty || isNaN(number)) {
			inputElement.value = (parameters[position] * 100).toString();
			return;
		}

		let percent = Math.round(number);

		if (percent < 0) {
			percent = 0;
		}
		if (percent > 100) {
			percent = 100;
		}

		parameters[position] = percent / 100;

		validate();
	}
</script>

<div class="flex flex-col my-4">
	<!-- Header -->
	<div class="flex flex-row gap-1">
		<h7 class="h7">{$t('ttes.portHeights')}</h7>
		{#if errorMessage !== null}
			<div class="text-warning-300-600-token [&>*]:pointer-events-none" use:popup={validationErrorMessagePopupSettings}>
				<TriangleAlert/>
			</div>
		{/if}
	</div>
	<!-- Form -->
	<div
		class={`grid grid-cols-[--input-grid-cols] border rounded-lg
			${errorMessage !== null ? 'border-warning-300-600-token' : 'border-surface-300-600-token'}
			items-center gap-y-[--input-gap-y] m-2 p-2`}
	>
		<label for="height">{$t('ttes.top')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="height"
				title={$t('ttes.top')}
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

		<label for="floor-area">{$t('ttes.middle')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="floor-area"
				title={$t('ttes.middle')}
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

		<label for="floor-area">{$t('ttes.bottom')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="floor-area"
				title={$t('ttes.bottom')}
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
	<div class="card p-4 variant-filled-secondary z-50">
		<p>{errorMessage}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>
