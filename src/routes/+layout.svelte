<script lang="ts">
	import { storePopup } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';

	import { CircleUserRound } from 'lucide-svelte';

	import '../app.postcss';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
</script>

<div class="flex flex-col">
	<header>
		<AppBar slotTrail="justify-self-end">
			<span class="text-2xl">ResulTES</span>
			<svelte:fragment slot="trail"><CircleUserRound /></svelte:fragment>
		</AppBar>
	</header>
	<slot/>
</div>
