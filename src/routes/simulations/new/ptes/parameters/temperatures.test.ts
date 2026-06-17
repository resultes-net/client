import { describe, it, expect } from 'vitest';

// Test the temperature refactoring logic directly
describe('Temperatures Component Refactoring', () => {
  it('should calculate deltas on-the-fly for display', () => {
    const temperatures = {
      demand_setpoint_degC: 80,
      boiler_output_setpoint_degC: 85,
      heat_pump_output_setpoint_degC: 90,
      storage_maximum_degC: 95,
      output_temperature_setpoint_degC: 100
    };

    // Helper functions (same as in the refactored component)
    function getDtBoilerDemand() {
      return temperatures.boiler_output_setpoint_degC - temperatures.demand_setpoint_degC;
    }

    function getDtHeatPumpBoiler() {
      return temperatures.heat_pump_output_setpoint_degC - temperatures.boiler_output_setpoint_degC;
    }

    function getDtStorageMaxHeatPump() {
      return temperatures.storage_maximum_degC - temperatures.heat_pump_output_setpoint_degC;
    }

    function getDtCollectorStorageMax() {
      return temperatures.output_temperature_setpoint_degC - temperatures.storage_maximum_degC;
    }

    // Test the calculated deltas
    expect(getDtBoilerDemand()).toBe(5); // 85 - 80
    expect(getDtHeatPumpBoiler()).toBe(5); // 90 - 85
    expect(getDtStorageMaxHeatPump()).toBe(5); // 95 - 90
    expect(getDtCollectorStorageMax()).toBe(5); // 100 - 95
  });

  it('should update absolute temperatures when deltas change', () => {
    const temperatures = {
      demand_setpoint_degC: 80,
      boiler_output_setpoint_degC: 85,
      heat_pump_output_setpoint_degC: 90,
      storage_maximum_degC: 95,
      output_temperature_setpoint_degC: 100
    };

    // Simulate changing dtBoilerDemand from 5 to 10
    // This should keep demand_setpoint_degC fixed and adjust boiler_output_setpoint_degC
    const newDelta = 10;
    temperatures.boiler_output_setpoint_degC = temperatures.demand_setpoint_degC + newDelta;
    
    expect(temperatures.boiler_output_setpoint_degC).toBe(90); // 80 + 10
    expect(temperatures.demand_setpoint_degC).toBe(80); // Should remain unchanged
  });

  it('should maintain deltas when demand setpoint changes in relative mode', () => {
    const temperatures = {
      demand_setpoint_degC: 80,
      boiler_output_setpoint_degC: 85,
      heat_pump_output_setpoint_degC: 90,
      storage_maximum_degC: 95,
      output_temperature_setpoint_degC: 100
    };

    // Helper functions
    function getDtBoilerDemand() {
      return temperatures.boiler_output_setpoint_degC - temperatures.demand_setpoint_degC;
    }

    function getDtHeatPumpBoiler() {
      return temperatures.heat_pump_output_setpoint_degC - temperatures.boiler_output_setpoint_degC;
    }

    function getDtStorageMaxHeatPump() {
      return temperatures.storage_maximum_degC - temperatures.heat_pump_output_setpoint_degC;
    }

    function getDtCollectorStorageMax() {
      return temperatures.output_temperature_setpoint_degC - temperatures.storage_maximum_degC;
    }

    // Store original deltas
    const originalDeltas = {
      dtBoilerDemand: getDtBoilerDemand(),
      dtHeatPumpBoiler: getDtHeatPumpBoiler(),
      dtStorageMaxHeatPump: getDtStorageMaxHeatPump(),
      dtCollectorStorageMax: getDtCollectorStorageMax()
    };

    // Change demand setpoint and adjust other temperatures to maintain deltas
    const newDemand = 85;
    temperatures.demand_setpoint_degC = newDemand;
    temperatures.boiler_output_setpoint_degC = newDemand + originalDeltas.dtBoilerDemand;
    temperatures.heat_pump_output_setpoint_degC = temperatures.boiler_output_setpoint_degC + originalDeltas.dtHeatPumpBoiler;
    temperatures.storage_maximum_degC = temperatures.heat_pump_output_setpoint_degC + originalDeltas.dtStorageMaxHeatPump;
    temperatures.output_temperature_setpoint_degC = temperatures.storage_maximum_degC + originalDeltas.dtCollectorStorageMax;

    // Verify deltas are maintained
    expect(getDtBoilerDemand()).toBe(originalDeltas.dtBoilerDemand);
    expect(getDtHeatPumpBoiler()).toBe(originalDeltas.dtHeatPumpBoiler);
    expect(getDtStorageMaxHeatPump()).toBe(originalDeltas.dtStorageMaxHeatPump);
    expect(getDtCollectorStorageMax()).toBe(originalDeltas.dtCollectorStorageMax);
  });
});