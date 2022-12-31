class SeededRandom {
    public constructor(private seed: number) {
    }

    public next(): number {
        return ((this.seed = Math.imul(1597334677, this.seed)) >>> 0) / 2 ** 32
    }
}

export default SeededRandom