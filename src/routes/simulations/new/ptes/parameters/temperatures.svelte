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
export let temperatureMode: 'absolute' | 'relative';

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

function parseOffset(input: string, fallbackValue: number): number {
return parseAndClampInputValue(
input,
-100,
100,
fallbackValue
);
}

function onDemandSetpointChanged(event: Event): void {
const inputElement = event.target as HTMLInputElement;

const temperature = parseTemperature(inputElement.value, parameters.demand_setpoint_degC);

parameters.demand_setpoint_degC = temperature;
inputElement.value = temperature.toString();

if (temperatureMode === 'absolute') {
if (!haveBeenEditedDirectly.boiler) {
parameters.boiler_output_setpoint_degC = temperature + BOILER_OUTPUT_SETPOINT_OFFSET_K;
}
if (!haveBeenEditedDirectly.heatPump) {
parameters.heat_pump_output_setpoint_degC = temperature + HEAT_PUMP_OUTPUT_SETPOINT_OFFSET_K;
}
if (!haveBeenEditedDirectly.storageMaximum) {
parameters.storage_maximum_degC = temperature + STORAGE_MAXIMUM_OFFSET_K;
}
} else {
const dtBoilerDemand = parameters.boiler_output_setpoint_degC - parameters.demand_setpoint_degC;
const dtHpBoiler = parameters.heat_pump_output_setpoint_degC - parameters.boiler_output_setpoint_degC;
const dtStorageMaxHp = parameters.storage_maximum_degC - parameters.heat_pump_output_setpoint_degC;

parameters.boiler_output_setpoint_degC = temperature + dtBoilerDemand;
parameters.heat_pump_output_setpoint_degC = parameters.boiler_output_setpoint_degC + dtHpBoiler;
parameters.storage_maximum_degC = parameters.heat_pump_output_setpoint_degC + dtStorageMaxHp;
}
}

function onBoilerOutputSetpointChanged(event: Event): void {
const inputElement = event.target as HTMLInputElement;

if (temperatureMode === 'absolute') {
const temperature = parseTemperature(
inputElement.value,
parameters.boiler_output_setpoint_degC
);

parameters.boiler_output_setpoint_degC = temperature;
inputElement.value = temperature.toString();
haveBeenEditedDirectly.boiler = true;
} else {
const offset = parseOffset(inputElement.value, parameters.boiler_output_setpoint_degC - parameters.demand_setpoint_degC);
parameters.boiler_output_setpoint_degC = parameters.demand_setpoint_degC + offset;
inputElement.value = offset.toString();

const dtHpBoiler = parameters.heat_pump_output_setpoint_degC - (parameters.boiler_output_setpoint_degC - offset);
parameters.heat_pump_output_setpoint_degC = parameters.boiler_output_setpoint_degC + dtHpBoiler;
const dtStorageMaxHp = parameters.storage_maximum_degC - parameters.heat_pump_output_setpoint_degC;
parameters.storage_maximum_degC = parameters.heat_pump_output_setpoint_degC + dtStorageMaxHp;
}
}

function onHeatPumpOutputSetpointChanged(event: Event): void {
const inputElement = event.target as HTMLInputElement;

if (temperatureMode === 'absolute') {
const temperature = parseTemperature(
inputElement.value,
parameters.heat_pump_output_setpoint_degC
);

parameters.heat_pump_output_setpoint_degC = temperature;
inputElement.value = temperature.toString();
haveBeenEditedDirectly.heatPump = true;
} else {
const offset = parseOffset(inputElement.value, parameters.heat_pump_output_setpoint_degC - parameters.boiler_output_setpoint_degC);
parameters.heat_pump_output_setpoint_degC = parameters.boiler_output_setpoint_degC + offset;
inputElement.value = offset.toString();

const dtStorageMaxHp = parameters.storage_maximum_degC - parameters.heat_pump_output_setpoint_degC;
parameters.storage_maximum_degC = parameters.heat_pump_output_setpoint_degC + dtStorageMaxHp;
}
}

function onStorageMaximumChanged(event: Event): void {
const inputElement = event.target as HTMLInputElement;

if (temperatureMode === 'absolute') {
const temperature = parseTemperature(inputElement.value, parameters.storage_maximum_degC);

parameters.storage_maximum_degC = temperature;
inputElement.value = temperature.toString();
haveBeenEditedDirectly.storageMaximum = true;
} else {
const offset = parseOffset(inputElement.value, parameters.storage_maximum_degC - parameters.heat_pump_output_setpoint_degC);
parameters.storage_maximum_degC = parameters.heat_pump_output_setpoint_degC + offset;
inputElement.value = offset.toString();
}
}
</script>

<div class="flex flex-col gap-4 m-2 p-2">
<div class="flex items-center gap-2">
<label for="temperature-mode">{$t('common.temperatureMode')}</label>
<select class="select w-auto" id="temperature-mode" bind:value={temperatureMode}>
<option value="absolute">{$t('common.absolute')}</option>
<option value="relative">{$t('common.relative')}</option>
</select>
</div>

{#if temperatureMode === 'absolute'}
<div data-popup="presetsInfoHoverPopup">
<div class="card p-4 variant-filled-secondary z-50">
<p>{('common.temperaturesArePresetFromDemandSetpoint')}</p>
<div class="arrow variant-filled-secondary" />
</div>
</div>
{/if}

<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
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

<label for="boiler-output-setpoint-temperature">
{#if temperatureMode === 'absolute'}
{$t('common.boilerOutputSetpointTemperature')}
{:else}
{$t('common.dtBoilerDemand')}
{/if}
</label>
<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
<input
class="input"
id="boiler-output-setpoint-temperature"
title={temperatureMode === 'absolute' ? $t('common.boilerOutputSetpointTemperature') : $t('common.dtBoilerDemand')}
type="number"
value={temperatureMode === 'absolute' ? parameters.boiler_output_setpoint_degC : parameters.boiler_output_setpoint_degC - parameters.demand_setpoint_degC}
min={temperatureMode === 'absolute' ? MIN_TEMPERATURE_DEGC : -100}
max={temperatureMode === 'absolute' ? MAX_TEMPERATURE_DEGC : 100}
on:change={onBoilerOutputSetpointChanged}
/>
<div><span class="flex flex-grow justify-center">{temperatureMode === 'absolute' ? '°C' : 'K'}</span></div>
</div>

<label for="heat-pump-output-setpoint-temperature">
{#if temperatureMode === 'absolute'}
{$t('common.heatPumpOutputSetpointTemperature')}
{:else}
{$t('common.dtHeatPumpBoiler')}
{/if}
</label>
<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
<input
class="input"
id="heat-pump-output-setpoint-temperature"
title={temperatureMode === 'absolute' ? $t('common.heatPumpOutputSetpointTemperature') : $t('common.dtHeatPumpBoiler')}
type="number"
value={temperatureMode === 'absolute' ? parameters.heat_pump_output_setpoint_degC : parameters.heat_pump_output_setpoint_degC - parameters.boiler_output_setpoint_degC}
min={temperatureMode === 'absolute' ? MIN_TEMPERATURE_DEGC : -100}
max={temperatureMode === 'absolute' ? MAX_TEMPERATURE_DEGC : 100}
on:change={onHeatPumpOutputSetpointChanged}
/>
<div><span class="flex flex-grow justify-center">{temperatureMode === 'absolute' ? '°C' : 'K'}</span></div>
</div>

<label for="maximum-storage-temperature">
{#if temperatureMode === 'absolute'}
{$t('common.maximumStorageTemperature')}
{:else}
{$t('common.dtStorageMaxHeatPump')}
{/if}
</label>
<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
<input
class="input"
id="maximum-storage-temperature"
title={temperatureMode === 'absolute' ? $t('common.maximumStorageTemperature') : $t('common.dtStorageMaxHeatPump')}
type="number"
value={temperatureMode === 'absolute' ? parameters.storage_maximum_degC : parameters.storage_maximum_degC - parameters.heat_pump_output_setpoint_degC}
min={temperatureMode === 'absolute' ? MIN_TEMPERATURE_DEGC : -100}
max={temperatureMode === 'absolute' ? MAX_TEMPERATURE_DEGC : 100}
on:change={onStorageMaximumChanged}
/>
<div><span class="flex flex-grow justify-center">{temperatureMode === 'absolute' ? '°C' : 'K'}</span></div>
</div>
</div>
</div>
