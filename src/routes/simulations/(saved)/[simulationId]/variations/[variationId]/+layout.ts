import { tryGetJson } from 'src/authAjax';

import { type Variation } from '$lib/openapi/generated/model/variation.js';

export const load = async ({ params, url: {pathname, search}, fetch, depends }) => {
    const variationId = params.variationId;
    depends(`resultes:variation:${variationId}`);

    const redirectTo = `${pathname}${search}`;

    const variation = await tryGetJson<Variation>(
        {
            endPoint: `/variations/${variationId}`,
            redirectTo,
            httpVerb: 'GET',
            fetchFunction: fetch
        }
    )

    return { variation };
}
