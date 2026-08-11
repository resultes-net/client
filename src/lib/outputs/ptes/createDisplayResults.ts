import type { CreateDisplayResults, DisplayResult } from '$lib/outputs/displayResults';


export const createDisplayResults: CreateDisplayResults = () => {
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
