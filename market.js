import { beforeStart, market } from './utils/others.js'

async function start() {
  await beforeStart(3)

  market()
}

start()
