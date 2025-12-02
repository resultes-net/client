import { downloadResultToObjectUrl } from "./downloadResult";

export type DisplayResult = { id: string, title: string, path: string, url: string | null };

export function createDisplayResults(): DisplayResult[] {
    const displayResults: DisplayResult[] = [
        { id: 'energyBalance', title: 'Monthly energy balance of the system', path: '/balance/balance-monthly-A4.png', url: null },
        { id: 'boiler', title: 'Boiler power', path: '/boiler/boiler-hourly-A4.png', url: null },
        { id: 'hpBalance', title: 'Heat pump energy balance', path: '/hp/balance-monthly-A4.png', url: null },
        { id: 'hpQt', title: 'Heat pump Q vs. T plot', path: '/hp/q_t-A4.png', url: null },
        { id: 'hxEffectiveness', title: 'Heat exchanger effectiveness', path: '/hx/efficiency-hourly-A4.png', url: null },
        { id: 'hxLmtd', title: 'Heat exchanger LMTD', path: '/hx/LMTD-hourly-A4.png', url: null },
        { id: 'ptesBalance', title: 'PTES energy balance', path: '/ptes/balance-monthly-A4.png', url: null },
        { id: 'ptesSoc', title: 'PTES state of charge (SoC)', path: '/ptes/soc-hourly-A4.png', url: null },
        { id: 'ptesT', title: 'PTES temperatures', path: '/ptes/t-ptes-hourly-A4.png', url: null },
        { id: 'sink', title: 'Demand power', path: '/sink/sink-hourly-A4.png', url: null },
        { id: 'solarQt', title: 'Collector Q vs. T plot', path: '/solar/q_t-A4.png', url: null },
        { id: 'solarPHourly', title: 'Collector power hourly', path: '/solar/solar-hourly-A4.png', url: null },
        { id: 'solarPMonthly', title: 'Collector power monthly', path: '/solar/solar-monthly-A4.png', url: null },
        { id: 'source', title: 'Additional source power', path: '/source/source-hourly-A4.png', url: null }
    ];

    return displayResults;
}

export async function loadMoreResults({
    displayResults, variationId, nResultsToLoad
}: {
    displayResults: DisplayResult[], variationId: string, nResultsToLoad: number | null
}) {
    const firstIndexToLoad = displayResults.findIndex((r) => !r.url);

    nResultsToLoad = nResultsToLoad === null ? displayResults.length : nResultsToLoad;

    if (nResultsToLoad < 0) {
        throw new Error("Number of results to load must be >= 0 or null.")
    }

    const displayResultsToLoad = displayResults.slice(firstIndexToLoad, firstIndexToLoad + nResultsToLoad);

    const promises = displayResultsToLoad.map(async (r) => {
        r.url = await downloadResultToObjectUrl({
            resultPath: r.path,
            variationId
        });
    });

    await Promise.all(promises);
}
