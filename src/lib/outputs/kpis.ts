export interface Kpi {
    descriptionKey: string,
    formattedValue: string,
    unit: string,
    note: string | null,
};

export type CreateKpis = (variationId: string, fetchFunction: (...args: any[]) => Promise<Response>) => Promise<Kpi[] | null>;

