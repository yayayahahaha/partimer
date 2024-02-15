// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, buy, displayMousePosition, extract } from './others.js'
import { go } from './replay.js'

async function start() {
  await beforeStart(3)

  // displayMousePosition()

  // buy(8)
  extract(70)
  // go()
}

export { start }
