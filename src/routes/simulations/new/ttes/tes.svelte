<script lang="ts">
	import type { OnAreParametersValidChanged } from '$lib/components/parameters/onAreParametersValidChanged';
	import type { Phase } from '$lib/components/parameters/phase';
	import Ports from '$lib/components/parameters/tes/ports.svelte';
	import Size from '$lib/components/parameters/tes/size.svelte';
	import { t } from '$lib/i18n/translations';
	import type { TtesStorage } from '$lib/openapi/generated/model/ttesStorage';

	export let projectPhase: Phase;
	export let parameters: TtesStorage;
	export let yearlyHeatDemandGWh: number;
	export let collectorFieldAreaM2: number;

	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<Size
	parameters={parameters.volume}
	{yearlyHeatDemandGWh}
	{collectorFieldAreaM2}
	{onAreParametersValidChanged}
/>
{#if projectPhase == 'design'}
	<Ports parameters={parameters.ports_relative_heights_1} {onAreParametersValidChanged} />

	<div class="m-2 p-2">
		<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
			<label for="height-to-diameter-ratio">{$t('ttes.HeightToDiameterRatio')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="height-to-diameter-ratio"
					title={$t('ttes.HeightToDiameterRatio')}
					type="number"
					bind:value={parameters.height_to_diameter_ratio_1}
					min="0.001"
				/>
				<div><span class="flex flex-grow justify-center">-</span></div>
			</div>

			<label for="demand-delta-t">{$t('ttes.InsulationThickness')}</label>
			<div class="input-group input-group-divider grid grid-cols-[--input-unit-grid-cols]">
				<input
					class="input"
					id="demand-delta-t"
					title={$t('ttes.InsulationThickness')}
					type="number"
					value={parameters.insulation_thickness_cm}
					min="0"
				/>
				<div><span class="flex flex-grow justify-center">cm</span></div>
			</div>
		</div>
	</div>
{/if}
