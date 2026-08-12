import type { CreateDisplayResults, DisplayResult } from '$lib/outputs/displayResults';


export const createDisplayResults: CreateDisplayResults = () => {
    const displayResults: DisplayResult[] = [
        { id: 'energyBalance', title: 'Monthly energy balance of the system', path: '/balance/balance-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'systemQt', title: 'System Q vs. T plot', path: '/q_vs_t/q_t-A4.png', data: { status: 'not-downloaded' } },
        { id: 'boiler', title: 'Boiler power', path: '/boiler/boiler-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesBalance', title: 'TTES energy balance', path: '/ttes/balance-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesSoc', title: 'TTES state of charge', path: '/ttes/soc-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesTemps', title: 'TTES temperatures', path: '/ttes/t-ptes-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesLosses', title: 'TTES losses (through top)', path: '/ttes/top-losses-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'sink', title: 'Demand power', path: '/sink/sink-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarQt', title: 'Collector Q vs. T plot', path: '/solar/q_t-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarPHourly', title: 'Collector power hourly', path: '/solar/solar-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarPMonthly', title: 'Collector power monthly', path: '/solar/solar-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarStagnation', title: 'Collector stagnation', path: '/solar/stagnation-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'source', title: 'Additional source power', path: '/source/source-hourly-A4.png', data: { status: 'not-downloaded' } },
    ];

    return displayResults;
}
