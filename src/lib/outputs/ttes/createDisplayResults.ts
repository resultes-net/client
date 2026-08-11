import type { CreateDisplayResults, DisplayResult } from '$lib/outputs/displayResults';


export const createDisplayResults: CreateDisplayResults = () => {
    const displayResults: DisplayResult[] = [
        { id: 'energyBalance', title: 'Monthly energy balance of the system', path: '/balance/balance-monthly-A4.png', data: null },
        { id: 'boiler', title: 'Boiler power', path: '/boiler/boiler-hourly-A4.png', data: null },
        { id: 'sink', title: 'Demand power', path: '/sink/sink-hourly-A4.png', data: null },
        { id: 'solarQt', title: 'Collector Q vs. T plot', path: '/solar/q_t-A4.png', data: null },
        { id: 'solarPHourly', title: 'Collector power hourly', path: '/solar/solar-hourly-A4.png', data: null },
        { id: 'solarPMonthly', title: 'Collector power monthly', path: '/solar/solar-monthly-A4.png', data: null },
        { id: 'source', title: 'Additional source power', path: '/source/source-hourly-A4.png', data: null }
    ];

    return displayResults;
}
