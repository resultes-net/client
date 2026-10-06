import type { CreateWeatherData } from '$lib/openapi/generated/model/createWeatherData';
import type { GetWeatherData } from '$lib/openapi/generated/model/getWeatherData';
import { FetchError } from 'src/ajax';
import { tryGetJson, type FetchFunction } from 'src/authAjax';

type Translate = (key: string) => string;

// Alpine.
export const DEFAULT_WEATHER_DATA_ID = 'c8a15e846e';

// Must agree with `WeatherDataName` in `pydantic-models`.
const WEATHER_DATA_NAME_MAX_LENGTH = 128;

// The shared weather data have translated display names. Their IDs are hard-coded in the server's
// migrations.
const SHARED_WEATHER_DATA_TRANSLATION_KEYS: Record<string, string> = {
	bc75a61bfd: 'common.Zurich',
	c8a15e846e: 'common.Alpine|Davos',
	'7634132ef1': 'common.Cold|EdmontonAirport',
	'0875a01ccb': 'common.Dry|Cairo',
	'9c92f5554e': 'common.Hot|AbuDhabiAirport',
	'48a257e131': 'common.Mediterranean|RomeAirportCiampino',
	'6c78e63690': 'common.Subtropic|ChennaiAirport',
	'37b95b4de7': 'common.Temperate|LondonCityCenter',
	'4541d24b4b': 'common.Tropical|NewOrleansAirport',
	d05b0a7a3a: 'common.Wet|ManausCityCenter'
};

export function isShared(weatherData: GetWeatherData): boolean {
	return weatherData.user_id === null;
}

export function getWeatherDataDisplayName(weatherData: GetWeatherData, trans: Translate): string {
	const translationKey = isShared(weatherData)
		? SHARED_WEATHER_DATA_TRANSLATION_KEYS[weatherData.id]
		: undefined;

	return translationKey ? trans(translationKey) : weatherData.name;
}

export async function getAllWeatherData(args: {
	redirectTo?: string;
	fetchFunction?: FetchFunction;
}): Promise<GetWeatherData[]> {
	return await tryGetJson<GetWeatherData[]>({
		endPoint: '/weather-data',
		httpVerb: 'GET',
		...args
	});
}

export async function getWeatherData(args: {
	weatherDataId: string;
	redirectTo?: string;
	fetchFunction?: FetchFunction;
}): Promise<GetWeatherData> {
	const { weatherDataId, ...otherArgs } = args;

	return await tryGetJson<GetWeatherData>({
		endPoint: `/weather-data/${encodeURIComponent(weatherDataId)}`,
		httpVerb: 'GET',
		...otherArgs
	});
}

export function isValidWeatherDataName(name: string): boolean {
	const trimmedName = name.trim();

	return trimmedName.length > 0 && trimmedName.length <= WEATHER_DATA_NAME_MAX_LENGTH;
}

export function createWeatherDataNameFromFileName(fileName: string): string {
	return fileName.slice(0, WEATHER_DATA_NAME_MAX_LENGTH);
}

export class UploadWeatherDataError extends Error {
	constructor(message: string) {
		super(message);

		this.name = 'UploadWeatherDataError';
	}
}

/**
 * Uploads `file` as TM2 weather data.
 *
 * Throws an `UploadWeatherDataError` with the server's explanation if the server rejects the
 * upload (e.g. because the name is taken or the contents aren't valid TMY2).
 */
export async function uploadWeatherData(name: string, file: File): Promise<GetWeatherData> {
	const createWeatherData: CreateWeatherData = {
		name,
		file_name: file.name,
		format: 'TM2',
		contents: await readAsBase64(file)
	};

	try {
		return await tryGetJson<GetWeatherData>({
			endPoint: '/weather-data',
			body: JSON.stringify(createWeatherData)
		});
	} catch (exception) {
		if (
			exception instanceof FetchError &&
			(exception.errorCode === 409 || exception.errorCode === 422)
		) {
			throw new UploadWeatherDataError(getErrorDetail(exception.message));
		}

		throw exception;
	}
}

function getErrorDetail(responseText: string): string {
	try {
		const detail = JSON.parse(responseText).detail;

		if (typeof detail === 'string') {
			return detail;
		}

		// Validation errors of FastAPI come as a list of objects with a `msg`.
		if (Array.isArray(detail)) {
			return detail.map((d) => d.msg).join(' ');
		}
	} catch {
		// Fall through.
	}

	return responseText;
}

function readAsBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			const dataUrl = reader.result as string;
			resolve(dataUrl.slice(dataUrl.indexOf(',') + 1));
		};
		reader.onerror = () => reject(reader.error);

		reader.readAsDataURL(file);
	});
}
