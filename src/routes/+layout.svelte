<script lang="ts">
	import { storePopup } from '@skeletonlabs/skeleton';
	import { AppBar } from '@skeletonlabs/skeleton';
	import { LightSwitch } from '@skeletonlabs/skeleton';

	import { computePosition, autoUpdate, offset, shift, flip, arrow, size } from '@floating-ui/dom';

	import { CircleUserRound } from 'lucide-svelte';

	import { t, locales, locale } from '$lib/i18n/translations';

	import '../app.postcss';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow, size });
</script>

<div class="flex flex-col">
	<header>
		<AppBar slotTrail="justify-self-end">
			<span class="text-2xl">ResulTES</span>
			<svelte:fragment slot="trail">
				<div class="flex flex-row gap-x-2">
					<select class="select w-auto" bind:value={$locale}>
						{#each $locales as value}
							<option {value}>{$t(`lang.${value}`)}</option>
						{/each}
					</select>
					<LightSwitch />
					<CircleUserRound />
				</div>
			</svelte:fragment>
		</AppBar>
	</header>
	<slot />
</div>
