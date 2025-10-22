import { getContext, setContext } from "svelte"
import { type Writable } from "svelte/store"

export interface BreadCrumb {
    readonly href?: string,
    readonly text: string,
}

const _CONTEXT_KEY = {}

export function getBreadCrumbsStore(): Writable<BreadCrumb[]> {
    return getContext(_CONTEXT_KEY)
}

export function setBreadCrumbStore(store: Writable<BreadCrumb[]>): void {
    setContext(_CONTEXT_KEY, store)
}