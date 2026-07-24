<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import Plotly from 'plotly.js-dist-min';
	import type { WasteHeatRecoverySource } from 'src/lib/openapi/generated/model/wasteHeatRecoverySource';

	export let whrSource: WasteHeatRecoverySource;

	const currentYearMs = new Date(new Date().getUTCFullYear(), 0).getTime();

	function hourToDate(hour: number): Date {
		const hoursMs = hour * 3600 * 1000;
		const ms = currentYearMs + hoursMs;
		return new Date(ms);
	}

	const dates = Array.from({ length: whrSource.mass_flow_rates_kg_per_h.length }, (_, i) =>
		hourToDate(i)
	);

	let hourlyValuesElement: HTMLElement | null = null;
	$: if (hourlyValuesElement) {
		Plotly.react(
			hourlyValuesElement,
			[
				{
					x: dates,
					y: whrSource.mass_flow_rates_kg_per_h,
					name: 'Mass flow rate',
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} kg/h<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f'
				},
				{
					x: dates,
					y: whrSource.temperatures_deg_C,
					name: 'Temperature',
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} °C<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f',
					yaxis: 'y2'
				}
			],
			{
				xaxis: { title: { text: 'Time' } },
				yaxis: { title: { text: 'Mass flow rate [kg/h]' } },
				yaxis2: { title: { text: 'Temperature [°C]' }, side: 'right', overlaying: 'y' }
			}
		);
	}
</script>

<div class="flex flex-col">
	<h6 class="h6 mt-7">{$t('common.WasteHeatSupplyProfile')}</h6>
	<div class="w-[1000px] mt-1" bind:this={hourlyValuesElement} />
</div>
