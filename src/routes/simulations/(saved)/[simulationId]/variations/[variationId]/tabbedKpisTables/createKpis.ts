import type { BtesKpis } from "./createBtesKpis";
import type { PtesKpis } from "./createPtesKpis";
import type { TtesKpis } from "./createTtesKpis";

export type Kpis = TtesKpis | PtesKpis | BtesKpis;

export type CreateKpis = (variationId: string, redirectTo: string, fetchFunction: (...args: any[]) => Promise<Response>) => Promise<Kpis | null>;
