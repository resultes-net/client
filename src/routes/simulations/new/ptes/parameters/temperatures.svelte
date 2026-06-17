<script lang="ts">
	import { type PopupSettings, popup } from '@skeletonlabs/skeleton';

	import { Info } from 'lucide-svelte';

	import { t } from '$lib/i18n/translations';
	import { parseAndClampInputValue, clampValue, assert } from '$lib/utils';

	import { type Temperatures } from '$lib/openapi/generated/model/temperatures';

	export let temperatures: Temperatures;

	const MIN_TEMPERATURE_DEGC = 20;
	const MAX_TEMPERATURE_DEGC = 200;

	let mode: 'absolute' | 'relative' = 'relative';

	const presetsInfoHoverPopupSettings: PopupSettings = {
		event: 'hover',
		target: 'presetsInfoHoverPopup',
		placement: 'top'
	};

	function clampTemperature(value: number): number {
		return clampValue(value, MIN_TEMPERATURE_DEGC, MAX_TEMPERATURE_DEGC);
	}

	function parseTemperature(input: string, fallbackValue: number): number {
		return parseAndClampInputValue(
			input,
			MIN_TEMPERATURE_DEGC,
			MAX_TEMPERATURE_DEGC,
			fallbackValue
		);
	}

	const temperatureSequence = [
		'demand_setpoint_degC',
		'boiler_output_setpoint_degC',
		'heat_pump_output_setpoint_degC',
		'storage_maximum_degC',
		'output_temperature_setpoint_degC'
	] as const satisfies readonly (keyof Temperatures)[];

	type TemperatureKey = (typeof temperatureSequence)[number];

	function targetOf(baseProperty: TemperatureKey): TemperatureKey {
		const targetProperty = temperatureSequence.at(temperatureSequence.indexOf(baseProperty) + 1);
		assert(targetProperty !== undefined, `No temperature follows ${baseProperty} in the sequence.`);
		return targetProperty;
	}

	function getDelta(baseProperty: TemperatureKey): number {
		return temperatures[targetOf(baseProperty)] - temperatures[baseProperty];
	}

	function onDemandSetpointChanged(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const temperature = parseTemperature(inputElement.value, temperatures.demand_setpoint_degC);

		if (mode === 'relative') {
			const dtBoilerDemand = getDelta('demand_setpoint_degC');
			const dtHeatPumpBoiler = getDelta('boiler_output_setpoint_degC');
			const dtStorageMaxHeatPump = getDelta('heat_pump_output_setpoint_degC');
			const dtCollectorStorageMax = getDelta('storage_maximum_degC');

			temperatures.demand_setpoint_degC = temperature;
			temperatures.boiler_output_setpoint_degC = clampTemperature(temperature + dtBoilerDemand);
			temperatures.heat_pump_output_setpoint_degC = clampTemperature(
				temperatures.boiler_output_setpoint_degC + dtHeatPumpBoiler
			);
			temperatures.storage_maximum_degC = clampTemperature(
				temperatures.heat_pump_output_setpoint_degC + dtStorageMaxHeatPump
			);
			temperatures.output_temperature_setpoint_degC = clampTemperature(
				temperatures.storage_maximum_degC + dtCollectorStorageMax
			);
		} else {
			temperatures.demand_setpoint_degC = temperature;
		}

		inputElement.value = temperature.toString();
	}

	function onTemperatureChanged(event: Event, property: keyof Temperatures): void {
		const inputElement = event.target as HTMLInputElement;
		const temperature = parseTemperature(inputElement.value, temperatures[property]);
		temperatures[property] = temperature;
		inputElement.value = temperature.toString();
	}

	function onDeltaChanged(event: Event, baseProperty: TemperatureKey): void {
		const targetProperty = targetOf(baseProperty);

		const inputElement = event.target as HTMLInputElement;
		const delta = parseFloat(inputElement.value);

		if (!isNaN(delta)) {
			temperatures[targetProperty] = clampTemperature(temperatures[baseProperty] + delta);
		}

		inputElement.value = getDelta(baseProperty).toString();
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
				on:change={(e) => onTemperatureChanged(e, 'boiler_output_setpoint_degC')}
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
				on:change={(e) => onTemperatureChanged(e, 'heat_pump_output_setpoint_degC')}
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
				on:change={(e) => onTemperatureChanged(e, 'storage_maximum_degC')}
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
				on:change={(e) => onTemperatureChanged(e, 'output_temperature_setpoint_degC')}
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
				value={getDelta('demand_setpoint_degC')}
				on:change={(e) => onDeltaChanged(e, 'demand_setpoint_degC')}
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
				value={getDelta('boiler_output_setpoint_degC')}
				on:change={(e) => onDeltaChanged(e, 'boiler_output_setpoint_degC')}
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
				value={getDelta('heat_pump_output_setpoint_degC')}
				on:change={(e) => onDeltaChanged(e, 'heat_pump_output_setpoint_degC')}
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
				value={getDelta('storage_maximum_degC')}
				on:change={(e) => onDeltaChanged(e, 'storage_maximum_degC')}
			/>
			<div><span class="flex flex-grow justify-center">K</span></div>
		</div>
	{:else}
		<div class="text-red-500">Unknown mode: {mode}</div>
	{/if}
</div>
