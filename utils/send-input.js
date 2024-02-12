import ks from 'node-key-sender'
import rb from 'robotjs'
import { beforeStart, delay } from './others.js'

async function start() {

  await beforeStart(3)
  // ks.sendKey('a')
  // await delay()

  rb.keyToggle('alt', 'down')
  await delay(3000)
  rb.keyToggle('a', 'up')
}

start()
