import { type MiddlewareState } from "@floating-ui/dom";

export function popupSizeApplyReferenceWidthIncludingBorder({ elements, rects }: MiddlewareState) {
    const ref = rects.reference;

    Object.assign(elements.floating.style, {
        // +1 for border of parent
        width: `${ref.width + 1}px`
    });
}