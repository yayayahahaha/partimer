import { beforeStart } from './utils/others.js'
import { tears } from './utils/thunder.js'

async function startTears() {
  await beforeStart(3)

  tears()
}
startTears()
