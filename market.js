import { market } from './utils/money-utils.js'
import { beforeStart } from './utils/others.js'

async function start() {
  await beforeStart(3)

  market()
}

start()
