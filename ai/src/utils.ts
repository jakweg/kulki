export const range = (length: number) => [...new Array(length)].map((_, i) => i)

export const repeatUntil = <T>(repeat: (() => T), shouldContinue: ((it: T) => boolean)): T => {
    while (true) {
        const value = repeat()
        if (shouldContinue(value))
            continue
        return value
    }
}