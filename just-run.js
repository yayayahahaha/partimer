import { buy, buyWithNoNo, checkPage, getCurrentPage, goToSearch } from './utils/money-utils.js'
import { clickMouse } from './utils/mouse-control.js'
import { _moveMouseByOffset, beforeStart, delay, getApplicationInfo, getTextByOffset } from './utils/others.js'
import rb from 'robotjs'

async function start() {
  await beforeStart(3)

  const { x, y } = getApplicationInfo()

  await buyWithNoNo(x, y, { nonoFn })
}

start()
