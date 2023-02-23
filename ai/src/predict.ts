
import { Board } from './board';
import tf from './tf';

const model = await tf.loadLayersModel('file://./model/model.json');

export const doStuff = async () => {
  const b = Board.fromString(` 
 . . 1 . . 
 1 1 1 . . 
 . . . . . 
 . . 0 . . 
 . . . . 1 `)


  const result = (model.predict([b.getAsTensorForColors(true)], {}) as any).dataSync()
  const got = Board.fromResult(result)

  console.log(got.toStringVisualization());

  const merged = Board.mergeTwo(b, got)
  console.log(merged.toStringVisualization());
}
await doStuff()


