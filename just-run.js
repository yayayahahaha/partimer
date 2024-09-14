import { buy, checkPage, getCurrentPage } from './utils/money-utils.js'
import { clickMouse } from './utils/mouse-control.js'
import { _moveMouseByOffset, beforeStart, delay, getApplicationInfo, getTextByOffset } from './utils/others.js'
import rb from 'robotjs'

async function start() {
  await beforeStart(3)

  const { x, y } = getApplicationInfo()

  const firstItem左上offset = { x: 349, y: 220 }
  const firstItem右下offset = { x: 448, y: 251 }

  let page = null

  const nono = '水晶'

  for (let i = 0; i < 10; i++) {
    page = await getCurrentPage(x, y)

    console.log(`第 ${i + 1} 頁`)

    // region check single page
    let offset1 = firstItem左上offset
    let offset2 = firstItem右下offset
    for (let j = 0; j < 9; j++) {
      const text = await getTextByOffset(x, y, offset1, offset2, 'chi_tra')

      console.log(`${page}: [${j + 1}]: ${text}`)

      // 沒 nono, 就 buybuy
      if (text !== '' && !text.match(new RegExp(nono))) {
        await buy(x, y, { ...offset1, y: offset1.y + 5 })
        j-- // 卡在同一格用
      } else {
        offset1 = { x: offset1.x, y: offset1.y + 55 }
        offset2 = { x: offset2.x, y: offset2.y + 55 }
      }

      await delay()
    }
    // endregion check single page

    // 檢查到最後一頁了沒
    if (checkPage() != null) {
      const [c, t] = page.split('/')
      if (c === t) break
    }

    // 還沒到，換頁後繼續
    await goNextPage(x, y)
    await delay()
  }

  async function goNextPage(x, y) {
    await _moveMouseByOffset(x, y, { x: 687, y: 171 }, { randomX: 1, randomY: 1 })
    await delay()
    await clickMouse()
    await delay()
  }
}

start()
