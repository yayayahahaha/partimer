// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, recieveItems, displayMousePosition, extract, market, ocean, marketAndExtract } from './others.js'
import { anotherGo, listenerStuff } from './thunder.js'

async function start() {
  await beforeStart(3)

  // anotherGo()

  recieveItems(206, 141)

  // displayMousePosition()

  // marketAndExtract()

  // market()
  // extract()

  // go(3, './behavior/tears-2.json')
  // go(5, './behavior/ture-power.json')

  // ocean()
}

export { start }
