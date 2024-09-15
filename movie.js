import { beforeStart } from './utils/others.js'
import { movie } from './utils/thunder.js'

async function startMovie() {
  await beforeStart(3)

  movie()
}
startMovie()
