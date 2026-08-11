
export interface DisplayResult {
    id: string;
    title: string;
    path: string;
    data: { blob: Blob; url: string | null; } | null;
};

export type CreateDisplayResults = () => DisplayResult[];