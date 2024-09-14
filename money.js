import { MARKET_NO_MORE_STATUS } from './utils/money-utils.js'
import { beforeStart, marketAndExtract } from './utils/others.js'

async function start(wait = true) {
  wait && (await beforeStart(3))

  const { status } = await marketAndExtract()
  if (status !== MARKET_NO_MORE_STATUS) await start(false)
}

start()
