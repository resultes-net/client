<script lang="ts">
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';
	import type { Phase } from '$lib/components/parameters/phase';
	import { t } from '$lib/i18n/translations';
	import type { BtesStorage } from '$lib/openapi/generated/model/btesStorage';
	import {
		createDefault,
		isCoaxialDefault,
		isDoubleUDefault,
		isSingleUDefault,
		type HeatExchangerType
	} from '$lib/parameters/btes/heatExchangers';
	import NBoreholes from './tes/NBoreholes.svelte';

	export let projectPhase: Phase;
	export let parameters: BtesStorage;
	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;

	let heatExchangerType: HeatExchangerType = 'double-U';

	$: heatExchanger = parameters.heat_exchanger;

	$: if (projectPhase === 'pre-design') {
		setHeatExchangerTypeAfterChangingToPreDesign();
		onHeatExchangerTypeChanged();
	}

	function setHeatExchangerTypeAfterChangingToPreDesign() {
		if (isSingleUDefault(heatExchanger)) {
			heatExchangerType = 'single-U';
		} else if (isDoubleUDefault(heatExchanger)) {
			heatExchangerType = 'double-U';
		} else if (isCoaxialDefault(heatExchanger)) {
			heatExchangerType = 'coaxial';
		} else {
			heatExchangerType = 'double-U';
		}
	}

	function onHeatExchangerTypeChanged() {
		parameters.heat_exchanger = createDefault(heatExchangerType);
	}
</script>

<NBoreholes
	parameters={parameters.n_boreholes}
	{yearlyHeatDemandGWh}
	{collectorFieldAreaM2}
	{onAreParametersValidChanged}
/>
<div class="m-2 p-2">
	<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
		<label for="borehole-spacing">{$t('btes.BoreholeSpacing')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="borehole-spacing"
				title={$t('btes.BoreholeSpacing')}
				type="number"
				bind:value={parameters.borehole_spacing_m}
				min="0"
			/>
			<div><span class="flex flex-grow justify-center">m</span></div>
		</div>

		<label for="borehole-depth">{$t('btes.BoreholeDepth')}</label>
		<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
			<input
				class="input"
				id="borehole-depth"
				title={$t('btes.BoreholeDepth')}
				type="number"
				bind:value={parameters.borehole_depth_m}
				min="0"
			/>
			<div><span class="flex flex-grow justify-center">m</span></div>
		</div>
		{#if projectPhase == 'pre-design'}
			<label for="hx-type">{$t('btes.HeatExchangerType')}</label>
			<select
				class="select"
				id="hx-type"
				bind:value={heatExchangerType}
				on:change={onHeatExchangerTypeChanged}
			>
				<option value="single-U">{$t('btes.single-U')}</option>
				<option value="double-U">{$t('btes.double-U')}</option>
				<option value="coaxial">{$t('btes.coaxial')}</option>
			</select>
		{:else}
			<label for="fluid-to-ground-resistance">{$t('btes.FluidToGroundResistance')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="fluid-to-ground-resistance"
					title={$t('btes.FluidToGroundResistance')}
					type="number"
					bind:value={parameters.heat_exchanger.fluid_to_ground_resistance_m_K_per_W}
					min="0"
				/>
				<div>
					<span class="flex flex-grow justify-center">m KW<sup class="top-1">-1</sup></span>
				</div>
			</div>

			<label for="pipe-to-pipe-resistance">{$t('btes.PipeToPipeResistance')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="pipe-to-pipe-resistance"
					title={$t('btes.PipeToPipeResistance')}
					type="number"
					bind:value={parameters.heat_exchanger.pipe_to_pipe_resistance_m_K_per_W}
					min="0"
				/>
				<div>
					<span class="flex flex-grow justify-center">m KW<sup class="top-1">-1</sup></span>
				</div>
			</div>
		{/if}
	</div>
</div>
