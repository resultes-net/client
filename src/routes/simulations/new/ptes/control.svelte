<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue } from '$lib/utils';

	import { type Control } from 'src/lib/openapi/generated/model/control';

	import { type OnAreParametersValidChanged } from 'src/lib/components/parameters/onAreParametersValidChanged';

	export let control: Control;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	const MIN_TEMPERATURE_DEGC = 20;
	const MAX_TEMPERATURE_DEGC = 200;

	function parseTemperature(input: string, fallbackValue: number): number {
		return parseAndClampInputValue(
			input,
			MIN_TEMPERATURE_DEGC,
			MAX_TEMPERATURE_DEGC,
			fallbackValue
		);
	}

	function onTemperatureChanged(event: Event, property: keyof Control): void {
		const inputElement = event.target as HTMLInputElement;
		const temperature = parseTemperature(inputElement.value, control[property]);
		control[property] = temperature;
		inputElement.value = temperature.toString();
	}
</script>

<div class="m-2 p-2">
	<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
		<label for="demand-setpoint-temperature">{$t('common.demandSetpointTemperature')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="demand-setpoint-temperature"
				title={$t('common.demandSetpointTemperature')}
				type="number"
				bind:value={control.demand_temperature_setpoint_degC}
				min={MIN_TEMPERATURE_DEGC}
				max={MAX_TEMPERATURE_DEGC}
			/>
			<div><span class="flex flex-grow justify-center">°C</span></div>
		</div>

		<label for="demand-delta-t">{$t('common.DemandDeltaT')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="demand-delta-t"
				title={$t('common.demandDeltaT')}
				type="number"
				bind:value={control.demand_delta_T_degC}
				min={MIN_TEMPERATURE_DEGC}
				max={MAX_TEMPERATURE_DEGC}
			/>
			<div><span class="flex flex-grow justify-center">°C</span></div>
		</div>

		<label for="maximum-storage-temperature">{$t('common.maximumStorageTemperature')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="maximum-storage-temperature"
				title={$t('common.maximumStorageTemperature')}
				type="number"
				value={control.storage_temperature_maximum_degC}
				min={MIN_TEMPERATURE_DEGC}
				max={MAX_TEMPERATURE_DEGC}
				on:change={(e) => onTemperatureChanged(e, 'storage_temperature_maximum_degC')}
			/>
			<div><span class="flex flex-grow justify-center">°C</span></div>
		</div>
	</div>
</div>

<style>
	* {
		--input-grid-cols: 66% 33%;
		--input-unit-grid-cols: 66% 33%;
	}
</style>
