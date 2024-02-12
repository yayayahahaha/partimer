import rb from 'robotjs'
import { beforeStart, delay } from './others.js'

async function start() {
  await beforeStart(3)

  rb.keyToggle('alt', 'down')
  await delay(3000)
  rb.keyToggle('a', 'up')
}

start()
