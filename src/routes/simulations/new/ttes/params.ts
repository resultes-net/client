export interface Parameters {
    solarCollectorField: SolarCollectorField,
    storage: Storage,
    demand: Demand
};

export interface SolarCollectorField {
    area_m2: number
};

export interface Storage {
    volume_m3: number
};

export interface Demand {
    profile: File
};

export function createDefaultParameters(): Parameters {
    const defaultParameters = {
        solarCollectorField: {
            area_m2: 1000
        },
        storage: {
            volume_m3: 10000
        },
        demand: {
            profile: null
        },
    };

    return defaultParameters;
};
