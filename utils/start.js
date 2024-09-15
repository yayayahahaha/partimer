// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, displayMousePosition } from './others.js'
import { anotherGo } from './thunder.js'

async function start() {
  await beforeStart(3)

  anotherGo()
}

export { start }
