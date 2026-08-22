import type { CreateKpis, Kpi } from '$lib/outputs/kpis';
import { FetchError, UnauthorizedError } from 'src/ajax';


export const createKpis: CreateKpis = async (variationId, fetchFunction) => {
    try {
        const kpis: Kpi[] = [];

        return kpis;
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
