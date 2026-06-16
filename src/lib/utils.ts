class AssertionError extends Error {

}

export function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        const actualMessage = message !== undefined ? message : "Condition not fullfilled.";

        throw new AssertionError(actualMessage);
    }
}

export function parseAndClampInputValue(
    input: string,
    min: number,
    max: number,
    fallbackValue: number
): number {
    const isEmpty = input.trim() === "";

    const number = Number(input);

    if (isEmpty || isNaN(number)) {
        return fallbackValue;
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

