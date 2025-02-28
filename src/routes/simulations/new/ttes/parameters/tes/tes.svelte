<script lang="ts">
	import { TtesStorage } from '$lib/openapi/generated/model/ttesStorage';

	import Size from './size.svelte';
	import Ports from './ports.svelte';
	import type { Phase } from '../phase';

	export let parameters: TtesStorage;

	export let projectPhase: Phase;
</script>

<Size parameters={parameters.size} />
{#if projectPhase == 'design'}
	<Ports parameters={parameters.inlet_relative_heights_1} />
{/if}
