import { MARKET_NO_MORE_STATUS } from './utils/money-utils.js'
import { beforeStart, marketAndExtract } from './utils/others.js'

async function start() {
  await beforeStart(3)

  recursiveMoney()

  async function recursiveMoney() {
    const { status } = await marketAndExtract()
    if (status !== MARKET_NO_MORE_STATUS) recursiveMoney()
  }
}

start()
