import { beforeStart, displayMousePosition } from './utils/others.js'
;(async () => {
  await beforeStart(3)
  displayMousePosition()
})()
