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

	let plotData: {
		dates: Date[];
		massFlowRates: number[];
		temperatures: number[];
	};
	$: {
		const hourlyValues = whrSource.hourly_values;
		const dates = hourlyValues.map((_, i) => hourToDate(i));
		const massFlowRates = hourlyValues.map((v) => v.mass_flow_rate_kg_per_h);
		const temperatures = hourlyValues.map((v) => v.temperature_deg_C);

		plotData = {
			dates,
			massFlowRates,
			temperatures
		};
	}

	let hourlyValuesElement: HTMLElement | null = null;
	$: if (hourlyValuesElement) {
		Plotly.react(
			hourlyValuesElement,
			[
				{
					x: plotData.dates,
					y: plotData.massFlowRates,
					name: 'Mass flow rate',
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} kg/h<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f',
				},
				{
					x: plotData.dates,
					y: plotData.temperatures,
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
