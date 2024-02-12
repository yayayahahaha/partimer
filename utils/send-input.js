import ks from 'node-key-sender'
import { beforeStart } from './others.js'

async function start() {

  await beforeStart()
  ks.sendKey('a')
}

start()
