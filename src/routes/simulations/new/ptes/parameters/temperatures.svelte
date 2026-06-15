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

	export let parameters: Temperatures;

	export let collectorField: any;

	const MIN_TEMPERATURE_DEGC = 20;
	const MAX_TEMPERATURE_DEGC = 200;

	// Fields the user has edited directly are no longer preset from the
	// demand setpoint temperature
	const haveBeenEditedDirectly = {
		boiler: false,
		heatPump: false,
		storageMaximum: false
	};

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

		const temperature = parseTemperature(inputElement.value, parameters.demand_setpoint_degC);

		parameters.demand_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

		if (!haveBeenEditedDirectly.boiler) {
			parameters.boiler_output_setpoint_degC = temperature + BOILER_OUTPUT_SETPOINT_OFFSET_K;
		}
		if (!haveBeenEditedDirectly.heatPump) {
			parameters.heat_pump_output_setpoint_degC = temperature + HEAT_PUMP_OUTPUT_SETPOINT_OFFSET_K;
		}
		if (!haveBeenEditedDirectly.storageMaximum) {
			parameters.storage_maximum_degC = temperature + STORAGE_MAXIMUM_OFFSET_K;
		}
	}

	function onBoilerOutputSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(
			inputElement.value,
			parameters.boiler_output_setpoint_degC
		);

		parameters.boiler_output_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

		haveBeenEditedDirectly.boiler = true;
	}

	function onHeatPumpOutputSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(
			inputElement.value,
			parameters.heat_pump_output_setpoint_degC
		);

		parameters.heat_pump_output_setpoint_degC = temperature;
		inputElement.value = temperature.toString();

		haveBeenEditedDirectly.heatPump = true;
	}

	function onStorageMaximumChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(inputElement.value, parameters.storage_maximum_degC);

		parameters.storage_maximum_degC = temperature;
		inputElement.value = temperature.toString();

		haveBeenEditedDirectly.storageMaximum = true;

	function onSetOutputTemperatureSetpoint(event: Event): void {
		const inputElement = event.target as HTMLInputElement;

		const temperature = parseTemperature(inputElement.value, collectorField.output_temperature_setpoint_degC);

		collectorField.output_temperature_setpoint_degC = temperature;
		inputElement.value = temperature.toString();
	}
</script>

<div data-popup="presetsInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>{$t('common.temperaturesArePresetFromDemandSetpoint')}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y] m-2 p-2">
	<label for="demand-setpoint-temperature">{$t('common.demandSetpointTemperature')}</label>
	<div class="input-group input-group-divider grid grid-cols-[1fr_auto_auto] items-center">
		<input
			class="input"
			id="demand-setpoint-temperature"
			title={$t('common.demandSetpointTemperature')}
			type="number"
			value={parameters.demand_setpoint_degC}
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
		>{$t('common.boilerOutputSetpointTemperature')}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="boiler-output-setpoint-temperature"
			title={$t('common.boilerOutputSetpointTemperature')}
			type="number"
			value={parameters.boiler_output_setpoint_degC}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onBoilerOutputSetpointChanged}
		/>
		<div><span class="flex flex-grow justify-center">°C</span></div>
	</div>

	<label for="heat-pump-output-setpoint-temperature"
		>{$t('common.heatPumpOutputSetpointTemperature')}</label
	>
	<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
		<input
			class="input"
			id="heat-pump-output-setpoint-temperature"
			title={$t('common.heatPumpOutputSetpointTemperature')}
			type="number"
			value={parameters.heat_pump_output_setpoint_degC}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onHeatPumpOutputSetpointChanged}
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
			value={parameters.storage_maximum_degC}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onStorageMaximumChanged}
		/>
		<div><span class="flex flex-grow justify-center">°C</span></div>
	</div>

		<label for="collector-output-setpoint-temperature"
			>{$t('common.collectorOutputSetpointTemperature')}</label
		>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="collector-output-setpoint-temperature"
				title={$t('common.collectorOutputSetpointTemperature')}
				type="number"
				value={collectorField.output_temperature_setpoint_degC}
				min={MIN_TEMPERATURE_DEGC}
				max={MAX_TEMPERATURE_DEGC}
				on:change={onSetOutputTemperatureSetpoint}
			/>
			<div><span class="flex flex-grow justify-center">°C</span></div>
		</div>
</div>