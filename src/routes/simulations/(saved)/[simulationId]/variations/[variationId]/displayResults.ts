import { getBlob } from 'src/ajax';
import * as auth from 'src/auth';

export type DisplayResult = {
    id: string,
    title: string,
    path: string,
    data: { blob: Blob, url: string | null } | null;
};

export function createDisplayResults(): DisplayResult[] {
    const displayResults: DisplayResult[] = [
        { id: 'energyBalance', title: 'Monthly energy balance of the system', path: '/balance/balance-monthly-A4.png', data: null },
        { id: 'boiler', title: 'Boiler power', path: '/boiler/boiler-hourly-A4.png', data: null },
        { id: 'hpBalance', title: 'Heat pump energy balance', path: '/hp/balance-monthly-A4.png', data: null },
        { id: 'hpQt', title: 'Heat pump Q vs. T plot', path: '/hp/q_t-A4.png', data: null },
        { id: 'hxEffectiveness', title: 'Heat exchanger effectiveness', path: '/hx/effectiveness-hourly-A4.png', data: null },
        { id: 'hxLmtd', title: 'Heat exchanger LMTD', path: '/hx/LMTD-hourly-A4.png', data: null },
        { id: 'ptesBalance', title: 'PTES energy balance', path: '/ptes/balance-monthly-A4.png', data: null },
        { id: 'ptesSoc', title: 'PTES state of charge (SoC)', path: '/ptes/soc-hourly-A4.png', data: null },
        { id: 'ptesT', title: 'PTES temperatures', path: '/ptes/t-ptes-hourly-A4.png', data: null },
        { id: 'sink', title: 'Demand power', path: '/sink/sink-hourly-A4.png', data: null },
        { id: 'solarQt', title: 'Collector Q vs. T plot', path: '/solar/q_t-A4.png', data: null },
        { id: 'solarPHourly', title: 'Collector power hourly', path: '/solar/solar-hourly-A4.png', data: null },
        { id: 'solarPMonthly', title: 'Collector power monthly', path: '/solar/solar-monthly-A4.png', data: null },
        { id: 'source', title: 'Additional source power', path: '/source/source-hourly-A4.png', data: null }
    ];

    return displayResults;
}
export async function loadMoreResults({
    displayResults, variationId, nResultsToLoad
}: {
    displayResults: DisplayResult[], variationId: string, nResultsToLoad: number | null
}) {
    const firstIndexToLoad = displayResults.findIndex((r) => !r.data);

    nResultsToLoad = nResultsToLoad === null ? displayResults.length : nResultsToLoad;

    if (nResultsToLoad < 0) {
        throw new Error("Number of results to load must be >= 0 or null.")
    }

    const displayResultsToLoad = displayResults.slice(firstIndexToLoad, firstIndexToLoad + nResultsToLoad);

    const promises = displayResultsToLoad.map(async (r) => {
        const blob = await downloadResultBlob({
            resultPath: r.path,
            variationId,
            accept: 'image/png'
        });

        r.data = { blob, url: null };
    });

    await Promise.all(promises);
}


async function downloadResultBlob({ resultPath, variationId, accept, fetchFunction = fetch }: {
    resultPath: string, variationId: string, accept: string, fetchFunction?: (...args: any[]) => Promise<Response>
}): Promise<Blob> {
    const variationEndPoint = `/variations/${variationId}`

    const endPoint = `${variationEndPoint}/results/${resultPath}`;
    const bearerToken = auth.getAccessToken();

    const blob = await getBlob({
        endPoint,
        bearerToken,
        accept,
        fetchFunction
    });

    return blob;
}
