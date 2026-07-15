import { tryGetJson } from 'src/authAjax';

import { type Variation } from 'src/lib/openapi/generated/model/variation.js';

export const load = async ({ params, fetch, depends }) => {
    const variationId = params.variationId;
    depends(`resultes:variation:${variationId}`);

    const variation = await tryGetJson<Variation>(
        {
            endPoint: `/variations/${variationId}`,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { variation };
}
