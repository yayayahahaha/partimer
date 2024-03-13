// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, displayMousePosition, extract, market, ocean, marketAndExtract } from './others.js'
import { anotherGo, listenerStuff } from './thunder.js'

async function start() {
  await beforeStart(3)

  try {
    anotherGo()
  } catch (e) {
    if (e === 'pause') console.log('pause!')
  }

  // displayMousePosition()

  // marketAndExtract()

  // market()
  // extract()

  // go(3, './behavior/tears-2.json')
  // go(5, './behavior/ture-power.json')

  // ocean()
}

export { start }
