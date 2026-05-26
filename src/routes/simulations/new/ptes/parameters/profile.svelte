<script lang="ts">
	import Plotly from 'plotly.js-dist-min';
	import { onMount } from 'svelte';

	export let hourlyDemandMW: number[];

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

	const dates = hourlyDemandMW.map((_, i) => hourToDate(i));

	const yearlyDemandMWh = Math.round(hourlyDemandMW.reduce((sum, x) => sum + x, 0));
	const maxPower = Math.max(...hourlyDemandMW);
	const minPower = Math.min(...hourlyDemandMW);

	const maxIndex = hourlyDemandMW.findIndex((v) => v === maxPower)!;
	const minIndex = hourlyDemandMW.findIndex((v) => v === minPower)!;

	const maxDate = dates[maxIndex];
	const minDate = dates[minIndex];

	onMount(() => {
		Plotly.newPlot(
			'plot',
			[
				{
					x: dates,
					y: hourlyDemandMW,
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} MW<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f'
				}
			],
			{ xaxis: { title: { text: 'Time ' } }, yaxis: { title: { text: 'Demand [MW]' } } }
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
						<td>{yearlyDemandMWh.toFixed(0)}</td>
						<td>MWh</td>
						<td></td>
					</tr>
					<tr>
						<td>(First) time of maximum energy demand</td>
						<td>{maxDate.toLocaleTimeString()} {maxDate.toLocaleDateString()}</td>
						<td>-</td>
						<td>{dateToHourInYear(maxDate)}h: {maxPower.toFixed(2)} MW</td>
					</tr>
					<tr>
						<td>(First) time of minimum energy demand</td>
						<td>{minDate.toLocaleTimeString()} {minDate.toLocaleDateString()}</td>
						<td>-</td>
						<td>{dateToHourInYear(minDate)}h: {minPower.toFixed(2)} MW</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
	<div class="w-[1000px]" id="plot" />
</div>
