<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';
	import type { GetWeatherData } from '$lib/openapi/generated/model/getWeatherData';
	import {
		createWeatherDataNameFromFileName,
		isValidWeatherDataName,
		uploadWeatherData,
		UploadWeatherDataError
	} from '$lib/weatherData';
	import { UnauthorizedError } from 'src/authAjax';
	import { gotoLoginWithRedirect } from './goto';

	export let file: File;
	export let onUploaded: (weatherData: GetWeatherData) => void;

	const modalStore = getModalStore();

	let name = createWeatherDataNameFromFileName(file.name);
	let isUploading = false;
	let errorMessage: string | null = null;
	let isDestroyed = false;
	let nameInput: HTMLInputElement;

	$: isNameValid = isValidWeatherDataName(name);

	onMount(() => {
		nameInput.select();
	});

	// The modal can be closed (backdrop, Escape) while uploading.
	onDestroy(() => {
		isDestroyed = true;
	});

	function close(): void {
		if (!isDestroyed) {
			modalStore.close();
		}
	}

	async function onSubmit(): Promise<void> {
		if (!isNameValid || isUploading) {
			return;
		}

		isUploading = true;
		errorMessage = null;

		try {
			const weatherData = await uploadWeatherData(name, file);

			onUploaded(weatherData);
			close();
		} catch (exception) {
			if (exception instanceof UnauthorizedError) {
				close();
				gotoLoginWithRedirect($page.url);
				return;
			}

			if (exception instanceof UploadWeatherDataError) {
				errorMessage = exception.message;
				return;
			}

			console.error(exception);
			errorMessage = $t('common.UploadWeatherDataFailed');
		} finally {
			isUploading = false;
		}
	}
</script>

<form class="card p-4 w-modal shadow-xl flex flex-col gap-y-4" on:submit|preventDefault={onSubmit}>
	<header class="text-2xl font-bold">{$t('common.UploadWeatherDataTm2')}</header>

	<label class="label">
		<span>{$t('common.WeatherDataName')}</span>
		<input
			class="input"
			class:input-error={!isNameValid}
			type="text"
			maxlength="128"
			disabled={isUploading}
			bind:this={nameInput}
			bind:value={name}
		/>
	</label>

	<div class="flex flex-col gap-y-1">
		<span class="text-xs">{file.name}</span>
		{#if !isNameValid}
			<span class="text-xs text-error-500">{$t('common.InvalidWeatherDataName')}</span>
		{/if}
		{#if errorMessage !== null}
			<span class="text-xs text-error-500">{errorMessage}</span>
		{/if}
	</div>

	<footer class="flex justify-end gap-x-2">
		<button type="button" class="btn variant-ghost-surface" disabled={isUploading} on:click={close}
			>{$t('common.Cancel')}</button
		>
		<button type="submit" class="btn variant-filled-primary" disabled={!isNameValid || isUploading}
			>{$t('common.Upload')}</button
		>
	</footer>
</form>
