import { beforeStart, extract } from './utils/others.js'

async function start() {
  await beforeStart(3)

  extract()
}

start()
