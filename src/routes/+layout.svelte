<script lang="ts">
	import {
		AppBar,
		LightSwitch,
		popup,
		type PopupSettings,
		storePopup,
	} from '@skeletonlabs/skeleton';

	import { arrow, autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';

	import { CircleUserRound } from 'lucide-svelte';

	import { locale, locales, t } from '$lib/i18n/translations';

	import * as auth from 'src/auth';

	import '../app.postcss';
	import { goto } from '$app/navigation';
	
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow, size });

	const userButtonPopupSettings: PopupSettings = {
		event: 'click',
		target: 'user-button-drop-down',
		placement: 'bottom'
	};

	var loggedIn = false;
	auth.isAuthenticated.subscribe((value) => {
		loggedIn = value;
	})

	function onLogout(): void {
		auth.unsetToken();
		goto('/');
	}
</script>

<div data-popup="user-button-drop-down">
	<nav class="list-nav bg-surface-50-900-token pt-2">
		<div class="arrow bg-surface-50-900-token" />
		<ul>
			<li>
				<a href="/change-password">
					<span class="flex-auto">{$t('auth.changePassword')}</span>
				</a>
			</li>
			<li>
				<button class="btn w-full" on:click={onLogout}>
					<span class="flex-auto text-start">{$t('auth.logout')}</span>
				</button>
			</li>
		</ul>
	</nav>
</div>

<div class="flex flex-col">
	<header>
		<AppBar gap="" slotTrail="justify-self-end">
			<a href="/" class="text-2xl">ResulTES</a>
			<svelte:fragment slot="trail">
				<div class="flex flex-row gap-x-2 items-center">
					<select class="select w-auto" bind:value={$locale}>
						{#each $locales as value}
							<option {value}>{$t(`lang.${value}`)}</option>
						{/each}
					</select>
					<LightSwitch />
					{#if loggedIn}
						<button class="btn-icon" use:popup={userButtonPopupSettings}><CircleUserRound /></button
						>
					{:else}
						<button class="btn-icon"><CircleUserRound /></button>
					{/if}
				</div>
			</svelte:fragment>
		</AppBar>
	</header>
	<slot />
</div>
