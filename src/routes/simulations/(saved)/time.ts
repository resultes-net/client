export type Time = { minutes: number; seconds: number };

export class TimeRemainingEstimator {
    #firstProgress: { progress: number; date: Date } | null = null;
    #estimatedTime: Time | null = null;

    addProgress(progress: number): void {
        const date = new Date();

        if (this.#firstProgress === null) {
            this.#firstProgress = { progress, date };

            if (progress === 100) {
                this.#estimatedTime = { minutes: 0, seconds: 0 };
            }

            return;
        }

        if (progress < this.#firstProgress.progress) {
            throw new Error('Progress must be newer than previous progress.');
        }

        if (progress === this.#firstProgress.progress) {
            return;
        }

        this.#setEstimatedTime(progress, date);
    }

    #setEstimatedTime(progress: number, date: Date): void {
        if (this.#firstProgress === null) {
            throw new Error('First progress not set.');
        }

        const millisecondsRun = date - this.#firstProgress.date;
        const percentProgressed = progress - this.#firstProgress.progress;

        const percentRemaining = 100 - progress;

        const millisecondsRemaining = (millisecondsRun / percentProgressed) * percentRemaining;

        this.#estimatedTime = millisecondsToTime(millisecondsRemaining);
    }

    hasEstimate(): boolean {
        return this.#estimatedTime !== null;
    }

    getEstimatedTime(): Time {
        if (this.#estimatedTime === null) {
            throw new Error("Don't have an estimated time.");
        }

        return this.#estimatedTime;
    }
}


function testTimeRemainingEstimator(): void {

}

export function millisecondsToTime(milliseconds: number): Time {
    const totalSeconds = Math.round(milliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;

    return { minutes, seconds };
}

export function formatTime(time: Time): string {
    const formattedMinutes = formatTimeComponent(time.minutes);
    const formattedSeconds = formatTimeComponent(time.seconds);

    return `${formattedMinutes}:${formattedSeconds}`;
}

function formatTimeComponent(component: number): string {
    return component.toString().padStart(2, '0');
}