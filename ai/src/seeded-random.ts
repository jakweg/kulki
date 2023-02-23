class SeededRandom {
    public constructor(public seed: number) {
    }

    public next01(): number {
        return ((this.seed = Math.imul(1597334677, this.seed)) >>> 0) / 2 ** 32
    }

    public int(max: number): number {
        return (this.next01() * max) | 0
    }

    public intRange(min: number, max: number): number {
        return (this.int((max - min) | 0) + min) | 0
    }

    public bool(): boolean {
        return this.int(2) === 0
    }
}

export default SeededRandom