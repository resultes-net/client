class AssertionError extends Error {

}

export function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        const actualMessage = message !== undefined ? message : "Condition not fullfilled.";

        throw new AssertionError(actualMessage);
    }
}

export function parseAndClampInputValue(
    inputElement: HTMLInputElement,
    fallbackValue: number,
    min: number,
    max: number
): number | null {
    const string = inputElement.value;
    const isEmpty = string.trim() === "";

    const number = Number(string);

    if (isEmpty || isNaN(number)) {
        inputElement.value = fallbackValue.toString();
        return null;
    }

    let value = number;

    if (value < min) {
        value = min;
    }
    if (value > max) {
        value = max;
    }

    return value;
}