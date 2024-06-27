import rb from 'robotjs'


// 因為要在不同的系統開發的關係，這樣比較方便
import { beforeStart, getApplicationInfo } from './others.js'

async function start() {
  await beforeStart(3)

  const colorMap = {
    'ffaabb': 'red',
    'cc0055': 'red',
    'ff77aa': 'red',
    'ffaacc': 'red',
    '0077ee': 'blue',
    '88ddff': 'blue',
    '99ddff': 'blue',
    '99eeff': 'blue',
    'cceeff': 'blue',
    '88eeff': 'blue',
    'ddff66': 'green',
    'ddff77': 'green',
    '33aa22': 'green'
  }

  const endColor = 'bb88cc'

  const arrow = {
    red: 'up',
    green:'left',
    blue: 'right'
  }

  rb.setKeyboardDelay(5)

  const { x, y } = getApplicationInfo()

  function check() {
    const color = rb.getPixelColor(x + 518, y + 524)

    const arrowKey = arrow[colorMap[color]]
    if (arrow[colorMap[color]]) {
      // console.log(arrowKey)
      rb.keyTap(arrowKey)
      rb.keyTap('space')
    } else {
      console.log(color)
    }

    check()

  }
  check( )

}

export { start }
