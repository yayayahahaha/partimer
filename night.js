import { beforeStart, displayMousePosition } from './utils/others.js'

async function startTears() {
  await beforeStart(3)

  displayMousePosition()
}
startTears()
