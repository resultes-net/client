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

    const energyBalanceEndPoint = `/variations/${variation.id}/results/balance/balance-monthly-A4.png`;

    const energyBalanceBlob = await getBlob({ endPoint: energyBalanceEndPoint, httpVerb: 'GET', accept: 'image/png', bearerToken: bearerToken, fetchFunction: fetch })

    return { variation, energyBalanceBlob }
}