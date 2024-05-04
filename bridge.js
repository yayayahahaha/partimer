import { beforeStart } from './utils/others.js'
import { bridge } from './utils/thunder.js'

async function startTears() {
  await beforeStart(3)

  bridge()
}
startTears()
