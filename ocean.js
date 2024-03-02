import { beforeStart, ocean } from './utils/others.js'

async function start() {
  await beforeStart(3)

  ocean()
}

start()
