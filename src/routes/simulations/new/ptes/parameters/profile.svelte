<script lang="ts">
	import Plotly from 'plotly.js-dist-min';
	import { onMount } from 'svelte';

	export let hourlyDemandKW: number[];

	const currentYearMs = new Date(new Date().getUTCFullYear(), 0).getTime();

	function hourToDate(hour: number): Date {
		const hoursMs = hour * 3600 * 1000;
		const ms = currentYearMs + hoursMs;
		return new Date(ms);
	}

	function dateToHourInYear(date: Date) {
		const msSinceStartOfYear = date.getTime() - currentYearMs;
		const hSinceStartOfYear = msSinceStartOfYear / 1000 / 3600;
		return hSinceStartOfYear;
	}

	const dates = hourlyDemandKW.map((_, i) => hourToDate(i));

	const yearlyDemandKWh = Math.round(hourlyDemandKW.reduce((sum, x) => sum + x, 0));
	const maxPower = Math.max(...hourlyDemandKW);
	const minPower = Math.min(...hourlyDemandKW);

	const maxIndex = hourlyDemandKW.findIndex((v) => v === maxPower)!;
	const minIndex = hourlyDemandKW.findIndex((v) => v === minPower)!;

	const maxDate = dates[maxIndex];
	const minDate = dates[minIndex];

	onMount(() => {
		Plotly.newPlot(
			'plot',
			[
				{
					x: dates,
					y: hourlyDemandKW,
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} kW<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f'
				}
			],
			{ xaxis: { title: { text: 'Time ' } }, yaxis: { title: { text: 'Demand [kW]' } } }
		);
	});
</script>

<div class="flex flex-col gap-4">
	<div class="w-fit">
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>Description</th>
						<th>Value</th>
						<th>Unit</th>
						<th>Remark</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Yearly energy demand</td>
						<td>{yearlyDemandKWh.toFixed(0)}</td>
						<td>kWh</td>
						<td></td>
					</tr>
					<tr>
						<td>(First) time of maximum energy demand</td>
						<td>{maxDate.toLocaleTimeString()} {maxDate.toLocaleDateString()}</td>
						<td>kWh</td>
						<td>{dateToHourInYear(maxDate)}h</td>
					</tr>
					<tr>
						<td>(First) time of minimum energy demand</td>
						<td>{minDate.toLocaleTimeString()} {minDate.toLocaleDateString()}</td>
						<td>kWh</td>
						<td>{dateToHourInYear(minDate)}h</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="w-[1000px]" id="plot" />
</div>
