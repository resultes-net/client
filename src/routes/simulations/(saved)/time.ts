export class TimeRemainingEstimator {
    #firstProgress: { progress: number; date: Date } | null = null;
    estimatedMinutes: number | null = null;

    addProgress(progress: number): void {
        const date = new Date();

        if (this.#firstProgress === null) {
            this.#firstProgress = { progress, date };

            if (progress === 100) {
                this.estimatedMinutes = 0.0;
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

        const millisecondsRun = date.getTime() - this.#firstProgress.date.getTime();
        const percentProgressed = progress - this.#firstProgress.progress;

        const percentRemaining = 100 - progress;

        const millisecondsRemaining = (millisecondsRun / percentProgressed) * percentRemaining;

        this.estimatedMinutes = millisecondsToMinutes(millisecondsRemaining);
    }

    hasEstimate(): boolean {
        return this.estimatedMinutes !== null;
    }

    getEstimatedMinutes(): number {
        if (this.estimatedMinutes === null) {
            throw new Error("Don't have an estimated time.");
        }

        return this.estimatedMinutes;
    }
}


export function millisecondsToMinutes(milliseconds: number): number {
    return Math.round(milliseconds / 1000 / 60);
}
