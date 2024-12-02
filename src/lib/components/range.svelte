<script lang="ts">
	import { RangeSlider } from '@skeletonlabs/skeleton';

	export let value: number;
	export let suffix: string;
	export let min: number;
	export let max: number;

	export let name: string;
	export let step: number = 1;
	export let ticked: boolean = false;

	export let conversionFactor: number = 1;

	let unconvertedValue: number = value / conversionFactor;

	let clazz: string = ""

	export {clazz as class};

	function onInputChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const newValue = inputElement.value;

		const valueToSet = computeValueToSet(newValue);

		// Force update to DOM (to reset what the user has typed) even if valueToSet === value
		// @ts-ignore: Type 'null' is not assignable to type 'number'
		unconvertedValue = null; 

		unconvertedValue = valueToSet;
	}

	function computeValueToSet(newValue: string): number {
		if (newValue === "") {
			return unconvertedValue;
		}

		const newInt = parseInt(newValue, 10);

		const isInRange = min <= newInt && newInt <= max;
		if (!isInRange) {
			return unconvertedValue;
		}

		return newInt;
	}

	$: value = unconvertedValue * conversionFactor;
</script>

<div class="flex flex-row gap-4 {clazz}" {...$$restProps}>
	<RangeSlider class="basis-[70%]" name={name} bind:value={unconvertedValue} {min} {max} {step} ticked={ticked}>
		<span class="flex justify-between">
			<span class="text-xs">{min}{suffix}</span>
			<span class="text-xs">{max}{suffix}</span>
		</span>
	</RangeSlider>
	<span class="input-group input-group-divider grid-cols-[60%_40%] basis-[30%]">
		<input
			class="text-sm input text-center"
			type="text"
			value={unconvertedValue}
			on:input={onInputChanged}
			{min}
			{max}
			{step}
		/>
		<div class="input-group-shim text-center">{suffix}</div>
	</span>
</div>
