
import { Board, Color } from './board';
import tf from './tf';

const model = await tf.loadLayersModel('file://./model/model.json');

export const doStuff = async () => {
    const b = Board.fromString(` 
  . . . . . . . . .
 . . . . . . . . .
 . . . . . . . . .
 . . . . . . . . .
 . 1 1 1 . . . . .
 . . . . . . . . .
 . . . . . . . . .
 . . . . . . . 1 .
 . . . . . . . . .`)

    const tensor = b.getAsTensorForColor(Color.Red, true)

    const result = (model.predict([tensor], {}) as any).dataSync()
    const got = Board.fromResult(result)

    console.log(got.toStringVisualization());

    const merged = Board.mergeTwo(b, got)
    console.log(merged.toStringVisualization());


    // const rows = []
    // for (let i = 0; i < BOARD_SIZE; i++) {
    //     rows.push(([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e: number) => e.toFixed(5))))
    // }
    // console.table(rows)
    // const max = (result as number[]).reduce((p, c) => c > p ? c : p, -1)
    // rows.length = 0
    // for (let i = 0; i < BOARD_SIZE; i++) {
    //     rows.push(([...result.slice(i * BOARD_SIZE, (i + 1) * BOARD_SIZE)].map((e: number) => e === max ? 1 : 0)))
    // }
    // console.table(rows)
}
await doStuff()


