<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue } from '$lib/utils';

	import { type Temperatures } from '$lib/openapi/generated/model/temperatures';

	import {
		BOILER_OUTPUT_SETPOINT_OFFSET_K,
		HEAT_PUMP_OUTPUT_SETPOINT_OFFSET_K,
		STORAGE_MAXIMUM_OFFSET_K
	} from './temperaturePresets';

	export let temperatures: Temperatures;

	const MIN_TEMPERATURE_DEGC = 20;
	const MAX_TEMPERATURE_DEGC = 200;

	let mode: 'absolute' | 'relative' = 'relative';

	// Relative offsets (DTs)
	let dtBoilerDemand = 0;
	let dtHeatPumpBoiler = 0;
	let dtStorageMaxHeatPump = 5;
	let dtCollectorStorageMax = 15;

	// Initialize DTs from absolute values when switching to relative mode or on load
	$: {
		if (mode === 'relative') {
			dtBoilerDemand = temperatures.boiler_output_setpoint_degC - temperatures.demand_setpoint_degC;
			dtHeatPumpBoiler =
				temperatures.heat_pump_output_setpoint_degC - temperatures.boiler_output_setpoint_degC;
			dtStorageMaxHeatPump =
				temperatures.storage_maximum_degC - temperatures.heat_pump_output_setpoint_degC;
			dtCollectorStorageMax =
				temperatures.output_temperature_setpoint_degC - temperatures.storage_maximum_degC;
		}
	}

	// Sync Absolute values when DTs change in relative mode
	function syncAbsoluteFromRelative(): void {
		temperatures.boiler_output_setpoint_degC = temperatures.demand_setpoint_degC + dtBoilerDemand;
		temperatures.heat_pump_output_setpoint_degC =
			temperatures.boiler_output_setpoint_degC + dtHeatPumpBoiler;
		temperatures.storage_maximum_degC =
			temperatures.heat_pump_output_setpoint_degC + dtStorageMaxHeatPump;
		temperatures.output_temperature_setpoint_degC =
			temperatures.storage_maximum_degC + dtCollectorStorageMax;
	}

	const presetsInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'presetsInfoHoverPopup',
		placement: 'top'
	};

	function parseTemperature(input: string, fallbackValue: number): number {
		return parseAndClampInputValue(
			input,
			MIN_TEMPERATURE_DEGC,
			MAX_TEMPERATURE_DEGC,
			fallbackValue
		);
	}

	function onDemandSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(inputElement.value, temperatures.demand_setpoint_degC);

		temperatures.demand_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

		if (mode === 'relative') {
			syncAbsoluteFromRelative();
		}
	}

	function onBoilerOutputSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(
			inputElement.value,
			temperatures.boiler_output_setpoint_degC
		);

		temperatures.boiler_output_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

	}

	function onHeatPumpOutputSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(
			inputElement.value,
			temperatures.heat_pump_output_setpoint_degC
		);

		temperatures.heat_pump_output_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

	}

	function onStorageMaximumChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(inputElement.value, temperatures.storage_maximum_degC);

		temperatures.storage_maximum_degC = temperature;
		inputElement.value = temperature.toString();

	}

	function onSetCollectorOutputTemperature(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(
			inputElement.value,
			temperatures.output_temperature_setpoint_degC
		);

		temperatures.output_temperature_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

	}

	function onDtBoilerDemandChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		dtBoilerDemand = parseFloat(inputElement.value) || 0;
		syncAbsoluteFromRelative();
	}

	function onDtHeatPumpBoilerChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		dtHeatPumpBoiler = parseFloat(inputElement.value) || 0;
		syncAbsoluteFromRelative();
	}

	function onDtStorageMaxHeatPumpChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		dtStorageMaxHeatPump = parseFloat(inputElement.value) || 0;
		syncAbsoluteFromRelative();
	}

	function onDtCollectorStorageMaxChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		dtCollectorStorageMax = parseFloat(inputElement.value) || 0;
		syncAbsoluteFromRelative();
	}
</script>

<div data-popup="presetsInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>{$t('common.temperaturesArePresetFromDemandSetpoint')}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="flex flex-col gap-4 mb-4">
	<label for="temperature-mode" class="font-bold">{$t('common.temperatureMode')}</label>
	<select id="temperature-mode" class="select w-full" bind:value={mode}>
		<option value="absolute">Absolute</option>
		<option value="relative">Relative (DT)</option>
	</select>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="demand-setpoint-temperature">{$t('common.demandSetpointTemperature')}</label>
	<div class="input-group input-group-divider grid grid-cols-[1fr_auto_auto] items-center">
		<input
			class="input"
			id="demand-setpoint-temperature"
			title={$t('common.demandSetpointTemperature')}
			type="number"
			value={temperatures.demand_setpoint_degC}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onDemandSetpointChanged}
		/>
		<div><span class="flex flex-grow justify-center">°C</span></div>
		<button
			class="btn variant-filled-primary [&>*]:pointer-events-none"
			use:popup={presetsInfoHoverPopupSettings}
		>
			<Info />
		</button>
	</div>

	<label for="boiler-output-setpoint-temperature"
		>{mode === 'absolute'
			? $t('common.boilerOutputSetpointTemperature')
			: 'DT boiler-demand'}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="boiler-output-setpoint-temperature"
			title={mode === 'absolute'
				? $t('common.boilerOutputSetpointTemperature')
				: 'DT boiler-demand'}
			type="number"
			value={mode === 'absolute' ? temperatures.boiler_output_setpoint_degC : dtBoilerDemand}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={mode === 'absolute' ? onBoilerOutputSetpointChanged : onDtBoilerDemandChanged}
		/>
		<div><span class="flex flex-grow justify-center">{mode === 'absolute' ? '°C' : 'K'}</span></div>
	</div>

	<label for="heat-pump-output-setpoint-temperature"
		>{mode === 'absolute'
			? $t('common.heatPumpOutputSetpointTemperature')
			: 'DT heat pump-boiler'}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="heat-pump-output-setpoint-temperature"
			title={mode === 'absolute'
				? $t('common.heatPumpOutputSetpointTemperature')
				: 'DT heat pump-boiler'}
			type="number"
			value={mode === 'absolute' ? temperatures.heat_pump_output_setpoint_degC : dtHeatPumpBoiler}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={mode === 'absolute' ? onHeatPumpOutputSetpointChanged : onDtHeatPumpBoilerChanged}
		/>
		<div><span class="flex flex-grow justify-center">{mode === 'absolute' ? '°C' : 'K'}</span></div>
	</div>

	<label for="maximum-storage-temperature"
		>{mode === 'absolute'
			? $t('common.maximumStorageTemperature')
			: 'DT maximum storage temperature-heat pump'}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="maximum-storage-temperature"
			title={mode === 'absolute'
				? $t('common.maximumStorageTemperature')
				: 'DT maximum storage temperature-heat pump'}
			type="number"
			value={mode === 'absolute' ? temperatures.storage_maximum_degC : dtStorageMaxHeatPump}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={mode === 'absolute' ? onStorageMaximumChanged : onDtStorageMaxHeatPumpChanged}
		/>
		<div><span class="flex flex-grow justify-center">{mode === 'absolute' ? '°C' : 'K'}</span></div>
	</div>

	<label for="collector-output-setpoint-temperature"
		>{mode === 'absolute'
			? $t('common.collectorOutputSetpointTemperature')
			: 'DT collector-maximum storage temperature'}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="collector-output-setpoint-temperature"
			title={mode === 'absolute'
				? $t('common.collectorOutputSetpointTemperature')
				: 'DT collector-maximum storage temperature'}
			type="number"
			value={mode === 'absolute'
				? temperatures.output_temperature_setpoint_degC
				: dtCollectorStorageMax}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={mode === 'absolute'
				? onSetCollectorOutputTemperature
				: onDtCollectorStorageMaxChanged}
		/>
		<div><span class="flex flex-grow justify-center">{mode === 'absolute' ? '°C' : 'K'}</span></div>
	</div>
</div>
