// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, buy, displayMousePosition, extract, market, ocean, marketAndExtract } from './others.js'
import { anotherGo, go } from './replay.js'

async function start() {
  await beforeStart(3)

  // displayMousePosition()

  // marketAndExtract()

  const a = function () {
    return new Promise((resolve) => {
      let i = 0
      setInterval(() => {
        i++
        console.log(i)
        if (i === 10) {
          resolve(1)
        }
      }, 1000)
    })
  }
  const b = function () {
    return new Promise((resolve) => {
      let i = 0
      setInterval(() => {
        i++
        console.log(i)
        if (i === 5) {
          resolve(2)
        }
      }, 1000)
    })
  }
  Promise.race([a(), b()]).then((r) => console.log(r))

  // market()
  // extract()

  // buy(4, 9)
  // go(3, './behavior/tears-2.json')
  // go(5, './behavior/ture-power.json')

  // ocean()
}

export { start }
