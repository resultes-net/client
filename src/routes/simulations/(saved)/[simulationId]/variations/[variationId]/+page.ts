import * as auth from 'src/auth';

import type { PageLoad } from './$types';

import { getBlob, getJson } from 'src/ajax';

import type { Variation } from 'src/lib/openapi/generated/model/variation';

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

    async function getBlobAt(resultPath: string): Promise<Blob> {
        const endPoint = `${variationEndPoint}/results/${resultPath}`
        return await getBlob({ endPoint, httpVerb: 'GET', accept: 'image/png', bearerToken: bearerToken, fetchFunction: fetch });
    }

    const blobs = {
        energyBalance: await getBlobAt('/balance/balance-monthly-A4.png'),
        boiler: await getBlobAt('/boiler/boiler-hourly-A4.png'),
        hpBalance: await getBlobAt('/hp/balance-monthly-A4.png'),
        hpQt: await getBlobAt('/hp/q_t-A4.png'),
        hxEfficiency: await getBlobAt('/hx/efficiency-hourly-A4.png'),
        hxLmtd: await getBlobAt('/hx/LMTD-hourly-A4.png'),
        ptesBalance: await getBlobAt('/ptes/balance-monthly-A4.png'),
        ptesSoc: await getBlobAt('/ptes/soc-hourly-A4.png'),
        ptesT: await getBlobAt('/ptes/t-ptes-hourly-A4.png'),
        sink: await getBlobAt('/sink/sink-hourly-A4.png'),
        solarQt: await getBlobAt('/solar/q_t-A4.png'),
        solarPHourly: await getBlobAt('/solar/solar-hourly-A4.png'),
        solarPMonthly: await getBlobAt('/solar/solar-monthly-A4.png'),
        source: await getBlobAt('/source/source-hourly-A4.png')

    };

    return { variation, blobs }
}