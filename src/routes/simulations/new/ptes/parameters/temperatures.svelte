<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue } from '$lib/utils';

	import { type Temperatures } from '$lib/openapi/generated/model/temperatures';

	export let temperatures: Temperatures;

	function getNumberOrReset(event: Event, fallbackValue: number): number {
		const inputElement = event.target as HTMLInputElement;
		const value = parseFloat(inputElement.value);
		const result = !isNaN(value) ? value : fallbackValue;
		inputElement.value = result.toString();
		return result;
	}

	const MIN_TEMPERATURE_DEGC = 20;
	const MAX_TEMPERATURE_DEGC = 200;

	let mode: 'absolute' | 'relative' = 'relative';

	// Helper functions to calculate deltas on-the-fly for display
	function getDtBoilerDemand(): number {
		return temperatures.boiler_output_setpoint_degC - temperatures.demand_setpoint_degC;
	}

	function getDtHeatPumpBoiler(): number {
		return temperatures.heat_pump_output_setpoint_degC - temperatures.boiler_output_setpoint_degC;
	}

	function getDtStorageMaxHeatPump(): number {
		return temperatures.storage_maximum_degC - temperatures.heat_pump_output_setpoint_degC;
	}

	function getDtCollectorStorageMax(): number {
		return temperatures.output_temperature_setpoint_degC - temperatures.storage_maximum_degC;
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
			// When demand setpoint changes in relative mode, adjust other temperatures
			// to maintain the same deltas relative to the new demand setpoint
			const dtBoilerDemand = getDtBoilerDemand();
			const dtHeatPumpBoiler = getDtHeatPumpBoiler();
			const dtStorageMaxHeatPump = getDtStorageMaxHeatPump();
			const dtCollectorStorageMax = getDtCollectorStorageMax();

			temperatures.boiler_output_setpoint_degC = temperature + dtBoilerDemand;
			temperatures.heat_pump_output_setpoint_degC = temperatures.boiler_output_setpoint_degC + dtHeatPumpBoiler;
			temperatures.storage_maximum_degC = temperatures.heat_pump_output_setpoint_degC + dtStorageMaxHeatPump;
			temperatures.output_temperature_setpoint_degC = temperatures.storage_maximum_degC + dtCollectorStorageMax;
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
		const delta = getNumberOrReset(event, getDtBoilerDemand());
		// Keep demand_setpoint_degC fixed, adjust boiler_output_setpoint_degC
		temperatures.boiler_output_setpoint_degC = temperatures.demand_setpoint_degC + delta;
	}

	function onDtHeatPumpBoilerChanged(event: Event): void {
		const delta = getNumberOrReset(event, getDtHeatPumpBoiler());
		// Keep boiler_output_setpoint_degC fixed, adjust heat_pump_output_setpoint_degC
		temperatures.heat_pump_output_setpoint_degC = temperatures.boiler_output_setpoint_degC + delta;
	}

	function onDtStorageMaxHeatPumpChanged(event: Event): void {
		const delta = getNumberOrReset(event, getDtStorageMaxHeatPump());
		// Keep heat_pump_output_setpoint_degC fixed, adjust storage_maximum_degC
		temperatures.storage_maximum_degC = temperatures.heat_pump_output_setpoint_degC + delta;
	}

	function onDtCollectorStorageMaxChanged(event: Event): void {
		const delta = getNumberOrReset(event, getDtCollectorStorageMax());
		// Keep storage_maximum_degC fixed, adjust output_temperature_setpoint_degC
		temperatures.output_temperature_setpoint_degC = temperatures.storage_maximum_degC + delta;
	}
</script>

<div data-popup="presetsInfoHoverPopup">
	<div class="card p-4 variant-filled-secondary z-50">
		<p>{$t('common.temperaturesArePresetFromDemandSetpoint')}</p>
		<div class="arrow variant-filled-secondary" />
	</div>
</div>

<div class="flex flex-col gap-4 mb-4">
	<label for="temperature-mode" class="font-bold">{$t('common.temperatureInputMode')}</label>
	<select id="temperature-mode" class="select w-full" bind:value={mode}>
		<option value="absolute">{$t('common.temperatureModeAbsolute')}</option>
		<option value="relative">{$t('common.temperatureModeRelative')}</option>
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

	{#if mode === 'absolute'}
		<label for="boiler-output-setpoint-temperature"
		>{$t('common.boilerOutputSetpointTemperature')}</label
		>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="boiler-output-setpoint-temperature"
			title={$t('common.boilerOutputSetpointTemperature')}
				type="number"
			value={temperatures.boiler_output_setpoint_degC}
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
			value={temperatures.heat_pump_output_setpoint_degC}
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
			value={temperatures.storage_maximum_degC}
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
			value={temperatures.output_temperature_setpoint_degC}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onSetCollectorOutputTemperature}
			/>
			<div><span class="flex flex-grow justify-center">°C</span></div>
		</div>
	{:else if mode === 'relative'}
		<label for="boiler-output-setpoint-temperature">{$t('common.dtBoilerDemand')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="boiler-output-setpoint-temperature"
			title={$t('common.dtBoilerDemand')}
				type="number"
			value={getDtBoilerDemand()}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onDtBoilerDemandChanged}
			/>
			<div><span class="flex flex-grow justify-center">K</span></div>
		</div>

		<label for="heat-pump-output-setpoint-temperature">{$t('common.dtHeatPumpBoiler')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="heat-pump-output-setpoint-temperature"
			title={$t('common.dtHeatPumpBoiler')}
				type="number"
			value={getDtHeatPumpBoiler()}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onDtHeatPumpBoilerChanged}
			/>
			<div><span class="flex flex-grow justify-center">K</span></div>
		</div>

		<label for="maximum-storage-temperature">{$t('common.dtStorageMaxHeatPump')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="maximum-storage-temperature"
			title={$t('common.dtStorageMaxHeatPump')}
				type="number"
			value={getDtStorageMaxHeatPump()}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onDtStorageMaxHeatPumpChanged}
			/>
			<div><span class="flex flex-grow justify-center">K</span></div>
		</div>

		<label for="collector-output-setpoint-temperature">{$t('common.dtCollectorStorageMax')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="collector-output-setpoint-temperature"
			title={$t('common.dtCollectorStorageMax')}
				type="number"
			value={getDtCollectorStorageMax()}
			min={MIN_TEMPERATURE_DEGC}
			max={MAX_TEMPERATURE_DEGC}
			on:change={onDtCollectorStorageMaxChanged}
			/>
			<div><span class="flex flex-grow justify-center">K</span></div>
		</div>
		{:else}
		<div class="text-red-500">Unknown mode: {mode}</div>
		{/if}
</div>
