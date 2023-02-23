
import { Board } from './board';
import tf from './tf';

const model = await tf.loadLayersModel('file://./models/model/model.json');

export const doStuff = async () => {
  const b = Board.fromString(` 
 . . 2 . . 
 1 1 1 . . 
 . 1 . . . 
 . . . . . 
 . . . . 2 `)
  b.shiftColors(1, 2)


  const result = (model.predict([b.getAsTensorForColors(true)], {}) as any).dataSync()
  const got = Board.fromResult(result)

  console.log(got.toStringVisualization());

  const merged = Board.mergeTwo(b, got)
  console.log(merged.toStringVisualization());
}
await doStuff()


