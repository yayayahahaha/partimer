import { beforeStart } from './utils/others.js'
import { go } from './utils/replay.js'

async function start() {
  await beforeStart(3)

  go(5, './behavior/true-power.json')
}

start()
