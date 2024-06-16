import { beforeStart } from './utils/others.js'
import { wild } from './utils/thunder.js'

async function startMovie() {
  await beforeStart(3)

  wild()
}
startMovie()
