<script lang="ts">
	import { onMount } from 'svelte';
	import * as Plotly from 'plotly.js-dist-min';
	import * as res from 'ts-results';

	import { container, type ProfileSummary } from '../profile_summary';

	let profileSummaryOption: res.Option<ProfileSummary> = res.None;

	onMount(() => {
		profileSummaryOption = container.profileSummary;

		if (profileSummaryOption.none) {
			return;
		}

		const profileSummary = profileSummaryOption.expect('Monthly data is set.');

		const x = [...profileSummary.monthly_data.months, 'Total'].map((x) => x.toString());
		const y = [...profileSummary.monthly_data.energy, profileSummary.yearly_data.total];

		const data = [
			{
				x: x,
				y: y,
				type: 'bar'
			}
		];

		const layout = {
			xaxis: {
				title: 'Month',
				dtick: 1,
				type: 'category'
			},
			yaxis: {
				title: 'Energy [MWh]'
			}
		};

		Plotly.newPlot('plot', data, layout);
	});
</script>

<div>
	<div class="container">
		<h1 class="h1">ResulTES</h1>
		<p>Monthly data</p>
		<div id="plot" />
	</div>
</div>
