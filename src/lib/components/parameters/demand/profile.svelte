<script lang="ts">
	import { t } from '$lib/i18n/translations';
	import type { Demand } from '$lib/openapi/generated/model/demand';
	import Plotly from 'plotly.js-dist-min';

	export let demand: Demand;

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

	function getFirstExtremumAndIndex(
		xs: number[],
		higher: (x1: number, x2: number) => number
	): [number, number] {
		if (xs.length === 0) {
			throw new Error('Array must not be empty.');
		}

		const [first, ...rest] = xs;

		let extremum = first;
		let extremumIndex = 0;

		for (const [i, x] of rest.entries()) {
			const newExtremum = higher(extremum, x);
			if (newExtremum !== extremum) {
				extremum = newExtremum;
				extremumIndex = i;
			}
		}

		return [extremum, extremumIndex];
	}

	let stats: {
		hourlyDemandMW: number[];
		dates: Date[];
		yearlyDemandGWh: number;
		maxPower: number;
		minPower: number;
		maxIndex: number;
		minIndex: number;
		maxDate: Date;
		minDate: Date;
	};
	$: {
		const hourlyDemandMW = demand.hourly_heat_demand_MW.map((p) => demand.scaling_factor * p);

		const dates = hourlyDemandMW.map((_, i) => hourToDate(i));

		const yearlyDemandGWh = Math.round(hourlyDemandMW.reduce((sum, x) => sum + x, 0)) / 1000;

		const [maxPower, maxIndex] = getFirstExtremumAndIndex(hourlyDemandMW, Math.max);
		const [minPower, minIndex] = getFirstExtremumAndIndex(hourlyDemandMW, Math.min);

		const maxDate = dates[maxIndex];
		const minDate = dates[minIndex];

		stats = {
			hourlyDemandMW,
			dates,
			yearlyDemandGWh,
			maxPower,
			minPower,
			maxIndex,
			minIndex,
			maxDate,
			minDate
		};
	}

	let hourlyDemandElement: HTMLElement | null = null;
	$: if (hourlyDemandElement) {
		Plotly.react(
			hourlyDemandElement,
			[
				{
					x: stats.dates,
					y: stats.hourlyDemandMW,
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x}: %{y} MW<extra></extra>',
					xhoverformat: '%x %H h',
					yhoverformat: '.2f'
				}
			],
			{
				xaxis: { title: { text: $t('common.Time') } },
				yaxis: { title: { text: `${$t('common.demand')} [MW]` } }
			}
		);
	}

	let loadDurationCurveElement: HTMLElement | null = null;
	$: if (loadDurationCurveElement) {
		const sortedHourlyDemandMW = stats.hourlyDemandMW.toSorted((x, y) => y - x);
		const hours = sortedHourlyDemandMW.map((_, i) => i + 1);

		Plotly.react(
			loadDurationCurveElement,
			[
				{
					x: hours,
					y: sortedHourlyDemandMW,
					type: 'scatter',
					mode: 'markers',
					hovertemplate: '%{x} h: %{y} MW<extra></extra>',
					yhoverformat: '.2f'
				}
			],
			{
				xaxis: { title: { text: $t('common.Hours') } },
				yaxis: { title: { text: `${$t('common.demand')} [MW]` } }
			}
		);
	}
</script>

<div class="flex flex-col">
	<div class="w-fit">
		<div class="table-container">
			<table class="table table-hover">
				<thead>
					<tr>
						<th>{$t('common.Description')}</th>
						<th>{$t('common.Value')}</th>
						<th>{$t('common.Unit')}</th>
						<th>{$t('common.Notes')}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>{$t('common.yearlyHeatDemand')}</td>
						<td>{stats.yearlyDemandGWh.toFixed(0)}</td>
						<td>MWh</td>
						<td></td>
					</tr>
					<tr>
						<td>{$t('common.(First)TimeOfMaximumEnergyDemand')}</td>
						<td>{stats.maxDate.toLocaleTimeString()} {stats.maxDate.toLocaleDateString()}</td>
						<td>-</td>
						<td>{dateToHourInYear(stats.maxDate)}h: {stats.maxPower.toFixed(2)} MW</td>
					</tr>
					<tr>
						<td>{$t('common.(First)TimeOfMinimumEnergyDemand')}</td>
						<td>{stats.minDate.toLocaleTimeString()} {stats.minDate.toLocaleDateString()}</td>
						<td>-</td>
						<td>{dateToHourInYear(stats.minDate)}h: {stats.minPower.toFixed(2)} MW</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>

	<div class="flex flex-row mt-6">
		<label class="self-center" for="demand-scaling-factor">{$t('common.scalingFactor')}</label>
		<input
			class="input w-[100px] ml-4"
			id="demand-scaling-factor"
			title={$t('common.scalingFactor')}
			type="number"
			min="0"
			bind:value={demand.scaling_factor}
		/>
	</div>

	<h6 class="h6 mt-7">{$t('common.HourlyDemand')}</h6>
	<div class="w-[1000px] mt-1" bind:this={hourlyDemandElement} />
	<h6 class="h6 mt-7">{$t('common.LoadDurationCurve')}</h6>
	<div class="w-[1000px] mt-1" bind:this={loadDurationCurveElement} />
</div>
