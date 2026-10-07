import { describe, expect, it } from 'vitest';

import { createDefaultFinancial, switchCostRegion, type CostRegionSwitch } from './financial';

describe('default financial parameters', () => {
    it('Uses the system specific storage cost curve', () => {
        expect(createDefaultFinancial('ttes').storage_cost).toEqual({ a: 27102, b: -0.527 });
        expect(createDefaultFinancial('ptes').storage_cost).toEqual({ a: 19142, b: -0.539 });
        expect(createDefaultFinancial('btes').storage_cost).toEqual({ a: 472.54, b: -0.225 });
    });

    it('Localises the investment costs but not the energy prices', () => {
        const eu = createDefaultFinancial('ttes', 'eu');
        const ch = createDefaultFinancial('ttes', 'ch');

        expect(eu.collector_field_cost.a).toBeCloseTo(1072.68, 2);
        expect(ch.collector_field_cost.a).toBeCloseTo(1330.12, 10);
        expect(ch.storage_cost.a).toBe(27102 * 1.24);
        expect(ch.heat_pump_cost_per_kW).toBeCloseTo(1183.084, 10);
        expect(ch.boiler_cost_per_kW).toBeCloseTo(310, 10);
        expect(ch.storage_cost.b).toBe(eu.storage_cost.b);

        expect(eu.fuel_price_per_kWh).toBe(0.08);
        expect(ch.fuel_price_per_kWh).toBe(0.075);
        expect(eu.electricity_price_per_kWh).toBe(0.2);
        expect(ch.electricity_price_per_kWh).toBe(0.19);
    });
});

describe('switching cost regions', () => {
    it("Gives the new region's defaults when nothing was edited", () => {
        const financial = createDefaultFinancial('ptes', 'eu');

        const { wereEditedEnergyPricesReset } = switchCostRegion(financial, 'ch', null);

        const expected = createDefaultFinancial('ptes', 'ch');
        expect(financial.cost_region).toBe('ch');
        expect(financial.storage_cost.a).toBeCloseTo(expected.storage_cost.a, 8);
        expect(financial.collector_field_cost.a).toBeCloseTo(expected.collector_field_cost.a, 8);
        expect(financial.heat_pump_cost_per_kW).toBeCloseTo(expected.heat_pump_cost_per_kW, 8);
        expect(financial.boiler_cost_per_kW).toBeCloseTo(expected.boiler_cost_per_kW, 8);
        expect(financial.fuel_price_per_kWh).toBe(expected.fuel_price_per_kWh);
        expect(financial.electricity_price_per_kWh).toBe(expected.electricity_price_per_kWh);
        expect(wereEditedEnergyPricesReset).toBe(false);
    });

    it('Localises edited investment costs and keeps region-independent parameters', () => {
        const financial = createDefaultFinancial('btes', 'eu');
        financial.storage_cost = { a: 500, b: -0.3 };
        financial.boiler_cost_per_kW = 300;
        financial.real_discount_rate_1 = 0.05;
        financial.lifetime_a = 25;
        financial.maintenance_rate_1 = 0.02;
        financial.boiler_efficiency_1 = 0.95;
        financial.collector_field_cost.b = -0.1;

        switchCostRegion(financial, 'ch', null);

        expect(financial.storage_cost.a).toBeCloseTo(620, 10);
        expect(financial.boiler_cost_per_kW).toBeCloseTo(372, 10);
        expect(financial.storage_cost.b).toBe(-0.3);
        expect(financial.collector_field_cost.b).toBe(-0.1);
        expect(financial.real_discount_rate_1).toBe(0.05);
        expect(financial.lifetime_a).toBe(25);
        expect(financial.maintenance_rate_1).toBe(0.02);
        expect(financial.boiler_efficiency_1).toBe(0.95);
    });

    it('Resets edited energy prices and reports it', () => {
        const financial = createDefaultFinancial('ttes', 'eu');
        financial.fuel_price_per_kWh = 0.1;

        const { wereEditedEnergyPricesReset } = switchCostRegion(financial, 'ch', null);

        expect(financial.fuel_price_per_kWh).toBe(0.075);
        expect(wereEditedEnergyPricesReset).toBe(true);
    });

    it('Is exact when switching back and forth', () => {
        // E.g. 27102 * 1.24 / 1.24 isn't 27102 in floating point.
        const financial = createDefaultFinancial('ttes', 'eu');
        financial.boiler_cost_per_kW = 123.45;
        const original = structuredClone(financial);

        let lastSwitch: CostRegionSwitch | null = null;
        for (let i = 0; i < 3; i++) {
            ({ lastSwitch } = switchCostRegion(financial, 'ch', lastSwitch));
            ({ lastSwitch } = switchCostRegion(financial, 'eu', lastSwitch));
        }

        expect(financial).toEqual({
            ...original,
            fuel_price_per_kWh: 0.08,
            electricity_price_per_kWh: 0.2
        });
    });

    it('Keeps a cost edited between switches', () => {
        const financial = createDefaultFinancial('ttes', 'eu');

        let { lastSwitch } = switchCostRegion(financial, 'ch', null);
        financial.heat_pump_cost_per_kW = 1240;
        ({ lastSwitch } = switchCostRegion(financial, 'eu', lastSwitch));

        expect(financial.heat_pump_cost_per_kW).toBeCloseTo(1000, 10);
        expect(financial.storage_cost.a).toBe(27102);

        switchCostRegion(financial, 'ch', lastSwitch);

        expect(financial.heat_pump_cost_per_kW).toBe(1240);
    });
});
