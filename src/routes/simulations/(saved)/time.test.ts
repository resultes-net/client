import { describe, expect, it } from "vitest";

import { TimeRemainingEstimator, millisecondsToMinutes } from "./time";

describe("time remaining estimator", () => {
    it("Doesn't have an estimate after first progress", () => {
        const estimator = new TimeRemainingEstimator();
        estimator.addProgress(1);
        expect(estimator.hasEstimate()).toBeFalsy();
    });

    it("Calculates progress correctly", async () => {
        const estimator = new TimeRemainingEstimator();

        estimator.addProgress(1);
        await sleep({ seconds: 2 });
        estimator.addProgress(2);

        const estimatedMinutes = estimator.getEstimatedMinutes();

        const expectedMilliseconds = 2 / (2 - 1) * (100 - 2) * 1000;
        const expectedMinutes = millisecondsToMinutes(expectedMilliseconds)

        console.log(expectedMinutes);

        expect(estimatedMinutes).equals(expectedMinutes);
    })
})

async function sleep({ seconds }: { seconds: number }): Promise<void> {
    const milliseconds = seconds * 1000;

    await new Promise(r => setTimeout(r, milliseconds));
}
