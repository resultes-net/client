class AssertionError extends Error {

}

export function assert(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        const actualMessage = message !== undefined ? message : "Condition not fullfilled.";

        throw new AssertionError(actualMessage);
    }
}

export function clampValue(value: number, min: number, max: number): number {
    if (value < min) {
        return min;
    }
    if (value > max) {
        return max;
    }
    return value;
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

    return clampValue(number, min, max);
}

export function toLocalDateTimeIgnoringTodayDate(iso_date_time: string): string {
    const date = new Date(iso_date_time);

    const now = new Date();

    if (areSameDates(date, now)) {
        return date.toLocaleTimeString();
    }

    return date.toLocaleString();
}

function areSameDates(date1: Date, date2: Date): boolean {
    return (
        date1.getUTCFullYear() == date2.getUTCFullYear() &&
        date1.getUTCMonth() == date2.getUTCMonth() &&
        date1.getUTCDay() == date2.getUTCDay()
    );
}

