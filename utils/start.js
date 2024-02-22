// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, buy, displayMousePosition, extract } from './others.js'
import { anotherGo, go } from './replay.js'

async function start() {
  await beforeStart(3)

  // displayMousePosition()

  // buy(4, 9)
  // extract(60)
  go(3, './behavior/tears-2.json')
  // go(3, './behavior/power-man.json')
  // anotherGo()
}

export { start }
