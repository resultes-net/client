<script lang="ts" context="module">
	export interface Exports {
		projectPhase: Phase;
		yearlyHeatDemandGWh: number;
		collectorFieldAreaM2: number;
		collectorIsShowIam: boolean;
		onAreParametersValidChanged(areValid: boolean, activeParametersTab: ActiveParamtersTab): void;
	}

	export type ActiveParamtersTab =
		| 'demand'
		| 'collector'
		| 'wasteHeatRecovery'
		| 'storage'
		| 'control';
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	import { popup, type PopupSettings, Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { Folder } from 'lucide-svelte';

	import TextWithWarning from '$lib/components/textWithWarning.svelte';
	import { t } from '$lib/i18n/translations';

	import { type Phase } from '$lib/components/parameters/phase';

	import Collector from '$lib/components/parameters/collector.svelte';
	import Demand from '$lib/components/parameters/demand.svelte';
	import { default as CollectorProfile } from '$lib/components/parameters/demand/profile.svelte';
	import WasteHeatRecoverySource from '$lib/components/parameters/wasteHeatRecoverySource.svelte';
	import { default as WhrSourceProfile } from '$lib/components/parameters/wasteHeatRecoverySource/profile.svelte';
	import type { CreateSimulation } from '$lib/openapi/generated/model/createSimulation';
	import type { GetWeatherData } from '$lib/openapi/generated/model/getWeatherData';
	import {
		createWeatherDataNameFromFileName,
		DEFAULT_WEATHER_DATA_ID,
		getAllWeatherData,
		getWeatherDataDisplayName,
		isShared,
		isValidWeatherDataName,
		uploadWeatherData,
		UploadWeatherDataError
	} from '$lib/weatherData';
	import { tryGetJson, UnauthorizedError } from 'src/authAjax';
	import type { Type } from '../openapi/generated/model/type';
	import { gotoLoginWithRedirect } from './goto';

	export let systemType: Type;

	export let parameters;
	const simulation: CreateSimulation = {
		name: '',
		weather_data_id: DEFAULT_WEATHER_DATA_ID,
		type: systemType,
		parameters: { values: parameters }
	};

	let activeParametersTab: ActiveParamtersTab = 'demand';
	let projectPhase: Phase = 'pre-design';

	let yearlyHeatDemandGWh: number;

	const areParametersValid = {
		demand: true,
		collector: true,
		wasteHeatRecovery: true,
		storage: true,
		control: true,

		all(): boolean {
			return (
				this.demand && this.collector && this.wasteHeatRecovery && this.storage && this.control
			);
		}
	};
	let areAllParametersValid: boolean;
	$: areAllParametersValid = areParametersValid.all() && isWeatherDataSelected;

	let allWeatherData: GetWeatherData[] | null = null;
	$: sharedWeatherData = (allWeatherData ?? []).filter(isShared);
	$: userWeatherData = (allWeatherData ?? []).filter((w) => !isShared(w));
	$: isWeatherDataSelected =
		allWeatherData?.some((w) => w.id === simulation.weather_data_id) ?? false;

	onMount(async () => {
		allWeatherData = await getAllWeatherData({ redirectTo: $page.url.pathname });
	});

	let weatherDataFile: File | null = null;
	let weatherDataName = '';
	let isUploadingWeatherData = false;
	let uploadWeatherDataErrorMessage: string | null = null;
	$: isWeatherDataNameValid = isValidWeatherDataName(weatherDataName);

	function onWeatherDataFileChanged(e: Event): void {
		const inputElement = e.target as HTMLInputElement;
		const file = inputElement.files?.[0] ?? null;

		// Allow choosing the same file again (e.g. after fixing it).
		inputElement.value = '';

		if (file === null) {
			return;
		}

		weatherDataFile = file;
		weatherDataName = createWeatherDataNameFromFileName(file.name);
		uploadWeatherDataErrorMessage = null;
	}

	function onCancelWeatherDataUpload(): void {
		weatherDataFile = null;
		weatherDataName = '';
		uploadWeatherDataErrorMessage = null;
	}

	async function onUploadWeatherData(): Promise<void> {
		if (weatherDataFile === null) {
			return;
		}

		isUploadingWeatherData = true;
		uploadWeatherDataErrorMessage = null;

		try {
			const weatherData = await uploadWeatherData(weatherDataName, weatherDataFile);

			allWeatherData = [...(allWeatherData ?? []), weatherData].sort((a, b) =>
				a.name.localeCompare(b.name)
			);
			simulation.weather_data_id = weatherData.id;

			onCancelWeatherDataUpload();
		} catch (exception) {
			if (exception instanceof UnauthorizedError) {
				gotoLoginWithRedirect($page.url);
				return;
			}

			if (exception instanceof UploadWeatherDataError) {
				uploadWeatherDataErrorMessage = exception.message;
				return;
			}

			throw exception;
		} finally {
			isUploadingWeatherData = false;
		}
	}

	let collectorIsShowIam = false;

	let collectorFieldAreaM2: number;
	$: {
		const area = parameters.collector_field.area;
		if (area.scaling === 'absolute_m2') {
			collectorFieldAreaM2 = area.value;
		} else if (area.scaling === 'relative_to_demand_m2_per_MWh') {
			const yearlyHeatDemandMWh = yearlyHeatDemandGWh * 1000;
			collectorFieldAreaM2 = area.value * yearlyHeatDemandMWh;
		} else {
			throw new Error(`Unknown area scaling: '${area.scaling}'.`);
		}
	}

	function onAreParametersValidChanged(
		areValid: boolean,
		activeParametersTab: ActiveParamtersTab
	): void {
		areParametersValid[activeParametersTab] = areValid;
	}

	export let exports: Exports;
	$: {
		exports = {
			projectPhase,
			yearlyHeatDemandGWh,
			collectorFieldAreaM2,
			collectorIsShowIam,
			onAreParametersValidChanged
		};
	}

	const submitButtonDisabledMessagePopupSettings: PopupSettings = {
		event: 'hover',
		target: 'submitButtonDisabledMessagePopup',
		placement: 'top'
	};

	async function onSubmitButtonClicked() {
		try {
			await tryGetJson({
				endPoint: '/simulations',
				body: JSON.stringify(simulation)
			});
		} catch (exception) {
			if (exception instanceof UnauthorizedError) {
				gotoLoginWithRedirect($page.url);
				return;
			}

			throw exception;
		}

		goto(`/simulations`);
	}

	let isShowCollectorProfileDetails = false;

	function onShowCollectorProfileDetails() {
		isShowCollectorProfileDetails = true;
	}

	function onHideCollectorProfileDetails() {
		isShowCollectorProfileDetails = false;
	}

	let isShowWhrSourceProfileDetails = false;

	function onShowWhrSourceProfileDetails() {
		isShowWhrSourceProfileDetails = true;
	}

	function onHideWhrSourceProfileDetails() {
		isShowWhrSourceProfileDetails = false;
	}
</script>

{#if isShowCollectorProfileDetails}
	<div class="flex flex-col gap-4">
		<button on:click={onHideCollectorProfileDetails} class="anchor mr-auto text-sm"
			>← {$t('common.GoBack')}</button
		>
		<h5 class="h5">{$t('common.DemandProfileProperties')}</h5>
		<CollectorProfile bind:demand={parameters.demand} />
	</div>
{:else if isShowWhrSourceProfileDetails}
	<div class="flex flex-col gap-4">
		<button on:click={onHideWhrSourceProfileDetails} class="anchor mr-auto text-sm"
			>← {$t('common.GoBack')}</button
		>
		<h5 class="h5">{$t('common.SupplyProfileProperties')}</h5>
		<WhrSourceProfile bind:whrSource={parameters.waste_heat_recovery_source} />
	</div>
{:else}
	<div class="flex flex-row gap-[2%] ltr:mr-[2%] rtl:ml-[2%]">
		<!-- Parameters input section -->
		<div class="basis-1/2">
			<div class="flex flex-col gap-y-4">
				<h5 class="h5">{$t('common.newSimulation')}</h5>

				<hr class="!border-t-2" />

				<div class="grid grid-cols-[--input-grid-cols] items-center gap-y-[--input-gap-y]">
					<label for="project-name">{$t('common.projectName')}</label>
					<input
						class="input"
						id="project-name"
						title={$t('common.projectName')}
						type="text"
						bind:value={simulation.name}
					/>

					<label for="weather-data">{$t('common.WeatherData')}</label>
					<div class="input-group input-group-divider grid grid-cols-[1fr_auto] items-center">
						<select
							class="select"
							id="weather-data"
							disabled={allWeatherData === null}
							bind:value={simulation.weather_data_id}
						>
							{#if allWeatherData === null}
								<option value={simulation.weather_data_id}>{$t('common.Loading')}</option>
							{:else}
								<optgroup label={$t('common.SharedWeatherData')}>
									{#each sharedWeatherData as weatherData (weatherData.id)}
										<option value={weatherData.id}
											>{getWeatherDataDisplayName(weatherData, $t)}</option
										>
									{/each}
								</optgroup>
								{#if userWeatherData.length > 0}
									<optgroup label={$t('common.MyWeatherData')}>
										{#each userWeatherData as weatherData (weatherData.id)}
											<option value={weatherData.id}
												>{getWeatherDataDisplayName(weatherData, $t)}</option
											>
										{/each}
									</optgroup>
								{/if}
							{/if}
						</select>
						<label class="label" title={$t('common.UploadWeatherDataTm2')}>
							<span class="btn variant-filled-primary"><Folder /></span>
							<input
								id="weather-data-file"
								type="file"
								accept=".tm2"
								hidden
								aria-label={$t('common.UploadWeatherDataTm2')}
								on:change={onWeatherDataFileChanged}
							/>
						</label>
					</div>

					{#if weatherDataFile !== null}
						<label for="weather-data-name">{$t('common.WeatherDataName')}</label>
						<div class="flex flex-col gap-y-1">
							<div class="input-group input-group-divider grid grid-cols-[1fr_auto_auto]">
								<input
									class="input"
									class:input-error={!isWeatherDataNameValid}
									id="weather-data-name"
									type="text"
									maxlength="128"
									bind:value={weatherDataName}
								/>
								<button
									type="button"
									class="variant-filled-primary"
									disabled={!isWeatherDataNameValid || isUploadingWeatherData}
									on:click={onUploadWeatherData}>{$t('common.Upload')}</button
								>
								<button
									type="button"
									disabled={isUploadingWeatherData}
									on:click={onCancelWeatherDataUpload}>{$t('common.Cancel')}</button
								>
							</div>
							<span class="text-xs">{weatherDataFile.name}</span>
							{#if !isWeatherDataNameValid}
								<span class="text-xs text-error-500">{$t('common.InvalidWeatherDataName')}</span>
							{/if}
							{#if uploadWeatherDataErrorMessage !== null}
								<span class="text-xs text-error-500">{uploadWeatherDataErrorMessage}</span>
							{/if}
						</div>
					{/if}
				</div>

				<div class="flex pt-8">
					<h5 class="h5 self-center">{$t('common.parameters')}</h5>
					<select class="select w-auto ml-auto" bind:value={projectPhase}>
						<option value="pre-design">{$t('common.preDesignPhase')}</option>
						<option value="design">{$t('common.designPhase')}</option>
					</select>
				</div>

				<hr class="!border-t-2" />

				<div class="flex flex-col">
					<TabGroup>
						<Tab bind:group={activeParametersTab} name="demand" value="demand">
							<TextWithWarning
								text={$t('common.demand')}
								config={{ shallWarn: !areParametersValid.demand, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="collector" value="collector">
							<TextWithWarning
								text={$t('common.collector')}
								config={{ shallWarn: !areParametersValid.collector, errorMessage: null }}
							/>
						</Tab>
						<Tab
							bind:group={activeParametersTab}
							name="wasteHeatRecovery"
							value="wasteHeatRecovery"
						>
							<TextWithWarning
								text={$t('common.WasteHeatRecoverySource')}
								config={{ shallWarn: !areParametersValid.collector, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="storage" value="storage">
							<TextWithWarning
								text={$t('common.storage')}
								config={{ shallWarn: !areParametersValid.demand, errorMessage: null }}
							/>
						</Tab>
						<Tab bind:group={activeParametersTab} name="control" value="control">
							<TextWithWarning
								text={$t('common.Control')}
								config={{ shallWarn: !areParametersValid.control, errorMessage: null }}
							/>
						</Tab>

						<svelte:fragment slot="panel">
							<div class="ltr:ml-[1%] rtl:mr-[1%]">
								{#if activeParametersTab === 'demand'}
									<Demand
										bind:parameters={parameters.demand}
										onShowProfileDetails={onShowCollectorProfileDetails}
										bind:yearlyHeatDemandGWh
										onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'demand')}
									/>
								{:else if activeParametersTab === 'collector'}
									<Collector
										{projectPhase}
										bind:parameters={parameters.collector_field}
										{yearlyHeatDemandGWh}
										onAreParametersValidChanged={(v) => onAreParametersValidChanged(v, 'collector')}
										bind:isShowIam={collectorIsShowIam}
									/>
								{:else if activeParametersTab === 'wasteHeatRecovery'}
									<WasteHeatRecoverySource
										bind:parameters={parameters.waste_heat_recovery_source}
										onAreParametersValidChanged={(v) =>
											onAreParametersValidChanged(v, 'wasteHeatRecovery')}
										onShowProfileDetails={onShowWhrSourceProfileDetails}
									/>
								{:else if activeParametersTab === 'storage'}
									<slot name="storage">ERROR: no storage slot provided.</slot>
								{:else if activeParametersTab === 'control'}
									<slot name="control">ERROR: no control slot provided.</slot>
								{:else}
									ERROR: Unknown tab `{activeParametersTab}`.
								{/if}
							</div>
						</svelte:fragment>
					</TabGroup>
				</div>
				<div class="flex flex-col mt-2 gap-y-1 ml-auto">
					<button
						type="button"
						class="btn variant-filled-primary [&>*]:pointer-events-none"
						use:popup={submitButtonDisabledMessagePopupSettings}
						disabled={!areAllParametersValid}
						on:click={onSubmitButtonClicked}
						>{$t('common.runSimulation')}
					</button>
				</div>
			</div>
		</div>
		<slot name="systemDescription">ERROR: No system description slot specified.</slot>
	</div>
{/if}

<div data-popup="submitButtonDisabledMessagePopup">
	<div hidden={areAllParametersValid} class="card p-4 variant-filled-warning z-50">
		<p>{$t('common.correctErrorsInParameters')}</p>
		<div class="arrow variant-filled-warning" />
	</div>
</div>

<style>
	* {
		--input-grid-cols: 30% 70%;
		--input-unit-grid-cols: 82% 18%;
		--input-button-grid-cols: 45% 55%;
		--input-gap-y: 0.25rem;
	}
</style>
