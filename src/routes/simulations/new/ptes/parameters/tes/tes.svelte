<script lang="ts">
	import { type PtesStorage } from '$lib/openapi/generated/model/ptesStorage';

	import Size from './size.svelte';
	import Ports from './ports.svelte';
	import type { Phase } from '../phase';
	import type { OnAreParametersValidChanged } from '../onAreParametersValidChanged';

	export let projectPhase: Phase;
	export let parameters: PtesStorage;
	export let onAreParametersValidChanged: OnAreParametersValidChanged;
</script>

<Size parameters={parameters.volume} {onAreParametersValidChanged}/>
