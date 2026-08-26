import type { CreateDisplayResults, DisplayResult } from '$lib/outputs/displayResults';


export const createDisplayResults: CreateDisplayResults = () => {
    const displayResults: DisplayResult[] = [
        { id: 'energyBalance', title: 'Monthly energy balance of the system', path: '/balance/balance-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'boiler', title: 'Boiler power', path: '/boiler/boiler-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'hpBalance', title: 'Heat pump energy balance', path: '/hp/balance-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'hpQt', title: 'Heat pump Q vs. T plot', path: '/hp/q_t-A4.png', data: { status: 'not-downloaded' } },
        { id: 'hxEffectiveness', title: 'Heat exchanger effectiveness', path: '/hx/effectiveness-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'hxLmtd', title: 'Heat exchanger LMTD', path: '/hx/LMTD-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'hxPHourly', title: 'Heat exchanger power', path: '/hx/q-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'btesPower', title: 'BTES power', path: '/btes/q-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'btesTField', title: 'BTES', path: '/btes/t-avg-field-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'btesT', title: 'BTES temperatures', path: '/btes/t-avg-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'sink', title: 'Demand power', path: '/sink/sink-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarQt', title: 'Collector Q vs. T plot', path: '/solar/q_t-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarPHourly', title: 'Collector power hourly', path: '/solar/solar-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarPMonthly', title: 'Collector power monthly', path: '/solar/solar-monthly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarStagnation', title: 'Collector stagnation', path: '/solar/stagnation-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'solarT', title: 'Collector temperatures', path: '/solar/temp-hourly-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesQt', title: 'Buffer tank Q vs. T plot', path: '/tes/q_t-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ttesT', title: 'Buffer tank temperatures', path: '/tes/tes-temps-A4.png', data: { status: 'not-downloaded' } },
        { id: 'ctrlBtesModes', title: 'BTES control dis-/charge', path: '/control/mode-hourly-A4.png', data: { status: 'not-downloaded' } }
    ];

    return displayResults;
}
