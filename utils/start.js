// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, buy, displayMousePosition, extract } from './others.js'

async function start() {
  await beforeStart(3)

  // displayMousePosition()

  // buy(2)
  extract(80)
}

export { start }
