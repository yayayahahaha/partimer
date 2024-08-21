import { beforeStart } from './utils/others.js'
import { _100 } from './utils/thunder.js'

async function start() {
  await beforeStart(3)

  _100()
}

start()
