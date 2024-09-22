import { money } from './utils/money-utils.js'
import { beforeStart } from './utils/others.js'

async function start() {
  await beforeStart(3)
  money()
}
start()
