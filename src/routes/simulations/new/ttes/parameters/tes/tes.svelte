<script lang="ts">
	import { TtesStorage } from '$lib/openapi/generated/model/ttesStorage';

	import Size from './size.svelte';
	import Ports from './ports.svelte';
	import type { Phase } from '../phase';
	import type { OnAreParametersValidChanged } from '../onAreParametersValidChanged';

	export let projectPhase: Phase;
	export let parameters: TtesStorage;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<Size parameters={parameters.size} {onAreParametersValidChanged}/>
{#if projectPhase == 'design'}
	<Ports parameters={parameters.ports_relative_heights_1} {onAreParametersValidChanged}/>
{/if}
