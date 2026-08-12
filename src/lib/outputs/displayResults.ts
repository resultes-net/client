
export interface DisplayResult {
    id: string;
    title: string;
    path: string;
    data: { status: "not-downloaded" } | { status: "not-found" } | { status: "downloaded", blob: Blob } | { status: "object-url-created", url: string }
};

export type CreateDisplayResults = () => DisplayResult[];