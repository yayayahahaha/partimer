import { buy, buyWithNoNo, checkPage, extract, getCurrentPage, goToSearch, market, money } from './utils/money-utils.js'
import { clickMouse } from './utils/mouse-control.js'
import { _moveMouseByOffset, beforeStart, delay, getApplicationInfo, getTextByOffset } from './utils/others.js'
import rb from 'robotjs'
import select, { Separator } from '@inquirer/select'
import { anotherGo, movie, redRobot } from './utils/thunder.js'

async function start() {
  // https://github.com/SBoudrias/Inquirer.js/tree/main/packages/select
  const selectAnswer = await select({
    message: '想做什麼呢',
    choices: [
      {
        name: '賽爾尼溫',
        value: '賽爾尼溫',
      },
      {
        name: '阿爾克斯',
        value: '阿爾克斯',
      },
      {
        name: '奧迪溫',
        value: '奧迪溫',
      },
      {
        name: 'money',
        value: 'money',
      },
      {
        name: 'market',
        value: 'market',
      },
      {
        name: 'extract',
        value: 'extract',
      },
    ],
  })
  console.log(`選了: ${selectAnswer}`)

  await beforeStart(3)
  const { x, y } = getApplicationInfo()

  switch (selectAnswer) {
    case '賽爾尼溫':
      anotherGo()
      break

    case '阿爾克斯':
      movie()
      break

    case '奧迪溫':
      redRobot()
      break

    case 'money':
      money()
      break

    case 'market':
      market()
      break

    case 'extract':
      extract()
      break
  }
}
start()
