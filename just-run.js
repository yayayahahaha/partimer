import { buy, buyWithNoNo, checkPage, extract, getCurrentPage, goToSearch, market, money } from './utils/money-utils.js'
import { clickMouse } from './utils/mouse-control.js'
import { _moveMouseByOffset, beforeStart, delay, getApplicationInfo, getTextByOffset } from './utils/others.js'
import rb from 'robotjs'
import { anotherGo, movie, redRobot } from './utils/thunder.js'

async function start() {
  await beforeStart(3)

  const { x, y } = getApplicationInfo()

  const bigOffset1 = { x: 340, y: 220 }
  const bigOffset2 = { x: 475, y: 700 }

  const text = await getTextByOffset(x, y, bigOffset1, bigOffset2, 'chi_tra')
  console.log(text.match(/水晶/g))
}
start()
