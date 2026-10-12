<!--
	Skeleton's `TabGroup` with arrow buttons on either side of the tab row, shown while the row can scroll further in
	their direction. Skeleton hides the row's scrollbar, so without them, nothing shows that there are more tabs. Takes
	the same props and slots as `TabGroup`.
-->
<script lang="ts">
	import { TabGroup } from '@skeletonlabs/skeleton';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';

	import { t } from '$lib/i18n/translations';

	export let regionList = '';

	let container: HTMLDivElement;
	let tabList: HTMLElement | null = null;
	let canScrollLeft = false;
	let canScrollRight = false;
	let tabListHeight = 0;

	let resizeObserver: ResizeObserver | null = null;
	let mutationObserver: MutationObserver | null = null;

	function update() {
		if (!tabList) return;
		const { scrollLeft, scrollWidth, clientWidth, offsetHeight } = tabList;
		// Tolerate subpixel rounding.
		canScrollLeft = scrollLeft > 1;
		canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;
		tabListHeight = offsetHeight;
	}

	function observeTabs() {
		if (!tabList || !resizeObserver) return;
		resizeObserver.disconnect();
		resizeObserver.observe(tabList);
		// The tabs change width without the row changing size, e.g. on a language switch.
		for (const tab of tabList.children) resizeObserver.observe(tab);
	}

	function scrollByHalf(direction: -1 | 1) {
		tabList?.scrollBy({ left: (direction * tabList.clientWidth) / 2, behavior: 'smooth' });
	}

	onMount(() => {
		tabList = container.querySelector<HTMLElement>('.tab-list');
		if (!tabList) return;
		tabList.addEventListener('scroll', update, { passive: true });
		resizeObserver = new ResizeObserver(update);
		mutationObserver = new MutationObserver(() => {
			observeTabs();
			update();
		});
		mutationObserver.observe(tabList, { childList: true });
		observeTabs();
		update();
	});

	onDestroy(() => {
		tabList?.removeEventListener('scroll', update);
		resizeObserver?.disconnect();
		mutationObserver?.disconnect();
	});
</script>

<div class="relative" bind:this={container}>
	<!-- The arrows sit in the row's margin, which is always there, so the row's width doesn't depend on them. -->
	<TabGroup {...$$restProps} regionList="{regionList} mx-5">
		<slot />
		<svelte:fragment slot="panel"><slot name="panel" /></svelte:fragment>
	</TabGroup>
	{#if canScrollLeft}
		<button
			type="button"
			class="absolute left-0 top-0 flex w-5 items-center justify-center hover:variant-soft rounded-container-token"
			style="height: {tabListHeight}px"
			aria-label={$t('common.ScrollTabsLeft')}
			on:click={() => scrollByHalf(-1)}
		>
			<ChevronLeft size={16} />
		</button>
	{/if}
	{#if canScrollRight}
		<button
			type="button"
			class="absolute right-0 top-0 flex w-5 items-center justify-center hover:variant-soft rounded-container-token"
			style="height: {tabListHeight}px"
			aria-label={$t('common.ScrollTabsRight')}
			on:click={() => scrollByHalf(1)}
		>
			<ChevronRight size={16} />
		</button>
	{/if}
</div>
