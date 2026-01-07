import { describe, expect, it } from "vitest";

import { TimeRemainingEstimator, millisecondsToTime } from "./time";

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

        const time = estimator.getEstimatedTime();

        const expectedMilliseconds = 2 / (2 - 1) * (100 - 2) * 1000;
        const expectedTime = millisecondsToTime(expectedMilliseconds)

        console.log(expectedTime);

        expect(time.minutes).equals(expectedTime.minutes);
        expect(time.seconds).equal(expectedTime.seconds);
    })
})

async function sleep({ seconds }: { seconds: number }): Promise<void> {
    const milliseconds = seconds * 1000;

    await new Promise(r => setTimeout(r, milliseconds));
}
