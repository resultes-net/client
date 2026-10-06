<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { getModalStore } from '@skeletonlabs/skeleton';

	import { page } from '$app/stores';

	import { t } from '$lib/i18n/translations';
	import type { GetWeatherData } from '$lib/openapi/generated/model/getWeatherData';
	import {
		createWeatherDataNameFromFileName,
		getErrorDetail,
		isValidWeatherDataName,
		uploadWeatherData,
		UploadWeatherDataError
	} from '$lib/weatherData';
	import { FetchError } from 'src/ajax';
	import { UnauthorizedError } from 'src/authAjax';
	import { gotoLoginWithRedirect } from './goto';

	export let file: File;
	export let onUploaded: (weatherData: GetWeatherData) => void;

	const modalStore = getModalStore();

	let name = createWeatherDataNameFromFileName(file.name);
	let isUploading = false;
	let errorMessage: string | null = null;
	let errorDetails: string | null = null;
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
		errorDetails = null;

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
			errorDetails =
				exception instanceof FetchError
					? `HTTP ${exception.errorCode}: ${getErrorDetail(exception.message)}`
					: String(exception);
		} finally {
			isUploading = false;
		}
	}
</script>

<form class="card p-4 w-80 flex flex-col gap-y-2" on:submit|preventDefault={onSubmit}>
	<header>{$t('common.UploadWeatherDataTm2')}</header>

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
		{#if errorDetails !== null}
			<span class="text-xs opacity-60 break-words">{$t('common.Details')}: {errorDetails}</span>
		{/if}
	</div>

	<footer class="flex justify-end gap-x-2 mt-2">
		<button type="button" class="btn btn-sm variant-ghost-surface" disabled={isUploading} on:click={close}
			>{$t('common.Cancel')}</button
		>
		<button type="submit" class="btn btn-sm variant-filled-primary" disabled={!isNameValid || isUploading}
			>{$t('common.Upload')}</button
		>
	</footer>
</form>
