<script lang="ts">
	import { createDefaultParameters } from './create';

	import Control from '$lib/components/parameters/control.svelte';
	import System, { type Exports } from '$lib/components/system.svelte';
	import SystemDescription from './systemDescription.svelte';
	import Tes from './tes.svelte';

	let exports: Exports;

	const parameters = createDefaultParameters();
</script>

<System systemType="ptes" {parameters} bind:exports>
	<Tes
		slot="storage"
		{...exports}
		parameters={parameters.storage}
		onAreParametersValidChanged={(v) => exports.onAreParametersValidChanged(v, 'storage')}
	/>
	<Control
		slot="control"
		control={parameters.control}
		onAreParametersValidChanged={(v) => exports.onAreParametersValidChanged(v, 'control')}
	/>
	<SystemDescription slot="systemDescription" />
</System>
