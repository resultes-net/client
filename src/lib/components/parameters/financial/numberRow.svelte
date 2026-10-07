<script lang="ts">
	import { parseAndClampInputValue } from '$lib/utils';

	export let id: string;
	export let label: string;
	export let value: number;
	export let min: number;
	export let max: number;
	export let isInteger = false;
	// Only the display is rounded: the value is kept unrounded unless the user changes it.
	export let displayDecimals: number | null = null;

	function round(value: number): number {
		return displayDecimals === null ? value : Number(value.toFixed(displayDecimals));
	}

	$: displayedValue = round(value);

	function onChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		let newValue = parseAndClampInputValue(inputElement.value, min, max, displayedValue);
		if (isInteger) {
			newValue = Math.round(newValue);
		}

		if (newValue !== displayedValue) {
			value = newValue;
		}

		inputElement.value = round(value).toString();
	}
</script>

<div class="flex items-center gap-1">
	<label for={id}>{label}</label>
	<slot name="info" />
</div>
<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
	<input
		class="input"
		{id}
		title={label}
		type="number"
		step="any"
		value={displayedValue}
		{min}
		{max}
		on:change={onChanged}
	/>
	<div class="!px-0">
		<span class="flex flex-grow justify-center text-sm"><slot name="unit" /></span>
	</div>
</div>
