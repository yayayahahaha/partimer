// TODO(flyc): 這個要改寫
import { beforeStart, extract } from './utils/others.js'

async function start() {
  await beforeStart(3)

  extract()
}

start()
