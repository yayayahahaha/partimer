import { beforeStart, marketAndExtract } from './utils/others.js'

async function start() {
  await beforeStart(3)

  marketAndExtract()
}

start()
