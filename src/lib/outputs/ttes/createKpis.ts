import type { CreateKpis } from '$lib/outputs/kpis';
import { FetchError, UnauthorizedError } from 'src/ajax';





export const createKpis: CreateKpis = async (variationId, fetchFunction) => {
    try {
        return [];
    } catch (exception) {
        if (exception instanceof FetchError && !(exception instanceof UnauthorizedError)) {
            return null;
        }

        throw exception;
    }
}
