import type { Variation } from 'src/lib/openapi/generated/model/variation';

import { getJson } from 'src/ajax';
import * as auth from 'src/auth';

import type { Results } from './results';

import { downloadResultToObjectUrl } from './downloadResult';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    const bearerToken = auth.getAccessToken();

    const variationEndPoint = `/variations/${params.variationId}`

    const variation: Variation = await getJson(
        {
            endPoint: variationEndPoint,
            httpVerb: 'GET',
            bearerToken: bearerToken,
            fetchFunction: fetch
        }
    )

    const resultPaths: { [K in Results]: string } = {
        energyBalance: '/balance/balance-monthly-A4.png',
        boiler: '/boiler/boiler-hourly-A4.png',
        hpBalance: '/hp/balance-monthly-A4.png',
        hpQt: '/hp/q_t-A4.png',
        hxEffectiveness: '/hx/efficiency-hourly-A4.png',
        hxLmtd: '/hx/LMTD-hourly-A4.png',
        ptesBalance: '/ptes/balance-monthly-A4.png',
        ptesSoc: '/ptes/soc-hourly-A4.png',
        ptesT: '/ptes/t-ptes-hourly-A4.png',
        sink: '/sink/sink-hourly-A4.png',
        solarQt: '/solar/q_t-A4.png',
        solarPHourly: '/solar/solar-hourly-A4.png',
        solarPMonthly: '/solar/solar-monthly-A4.png',
        source: '/source/source-hourly-A4.png'
    };

    const promises = Object.fromEntries(Object.entries(resultPaths).slice(0).map(([k, p]) => {
        const promise = downloadResultToObjectUrl({
            resultPath: p, variationId: variation.id, fetchFunction: fetch
        })
        return [k, promise]
    }))

    const objectUrls: { [K in Results]: string } = Object.fromEntries(
        await Promise.all(
            Object.entries(promises).map(async ([k, p]) => [k, await p])
        )
    )

    return { variation, objectUrls }
}