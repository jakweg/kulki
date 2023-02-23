
import { Board, Color } from './board';
import tf from './tf';

const model = await tf.loadLayersModel('file://./model/model.json');

export const doStuff = async () => {
  const b = Board.fromString(` 
 . . 1 . . 
 1 1 1 . . 
 . . . . . 
 . . 0 . . 
 . . . . 1 `)

  const tensor = b.getAsTensorForColor(Color.Red, true)

  const result = (model.predict([tensor], {}) as any).dataSync()
  const got = Board.fromResult(result)

  console.log(got.toStringVisualization());

  const merged = Board.mergeTwo(b, got)
  console.log(merged.toStringVisualization());
}
await doStuff()


