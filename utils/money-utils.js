import { pressEnter } from './keyboard-action.js'
import { clickMouse, clickRightMouse } from './mouse-control.js'
import { _keyIn, _moveMouseByOffset, delay, getApplicationInfo, getTextByOffset, waitUntil } from './others.js'
import rb from 'robotjs'

// 1366 * 768
const bagSize = 65
// 城鎮
const 裝備_offset = { x: 30, y: 124 }
const 背包整理_offest = { x: 172, y: 486 }
const 背包向上_offest = { x: 208, y: 496 }

// market
const 查詢_offset = { x: 115, y: 126 }
const 市場搜尋_offset = { x: 198, y: 85 }
const 防具_offset = { x: 135, y: 168 }
const 防具重置_offset = { x: 135, y: 629 }
const 防具等級_offset = { x: 106, y: 369 }
const 防具價格_offset = { x: 211, y: 392 }
const 防具搜尋_offset = { x: 214, y: 637 }
const 武器_offset = { x: 147, y: 670 }
const 武器重置_offset = { x: 136, y: 631 }
const 武器等級_offset = { x: 118, y: 368 }
const 武器價格_offset = { x: 216, y: 396 }
const 武器搜尋_offset = { x: 220, y: 637 }
const firstItemOffset = { x: 950, y: 230 }
const buyButtonOffset = { x: 950, y: 750 }
const completeOffset = { x: 920, y: 120 }
const recievedButtonOffset = { x: 970, y: 170 }
const 頁碼左上_offset = { x: 619, y: 156 }
const 頁碼右下_offset = { x: 668, y: 176 }
// 分解欄位的按鈕的座標
const extractOpenOffset = { x: 485, y: 489 }
const confirmOffset = { x: 809, y: 510 }

const MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS = 'has-item-which-can-only-have-one-status'
const MARKET_MATCH_MAX_STATYS = 'match-max-status'
export const MARKET_NO_MORE_STATUS = 'no-more-status'

// 進入城鎮
// 讓右上角的小地圖包含地圖名稱一起顯示
// 把包包移動到切齊地圖名稱下緣、剛好遮住小地圖
// 然後把 extract function 的座標設定為第一個想要分解的物品  let row = paramRow // 第一個要被分解的物品的座標
export async function extract({ paramRow = 6, paramColumn = 5 } = {}) {
  const { x, y } = getApplicationInfo()
  const confirmColor = {
    ax: x + confirmOffset.x,
    ay: y + confirmOffset.y,
    color: 'ddfffff',
  }

  // 等待畫面中 place: town 的地方的文字變成 梅斯特 的意思
  const townName = await waitUntil({ x, y, maxWait: 60 * 1000, message: '梅斯特', place: 'town' })
  if (townName == null) return void console.log('這裡是哪裡，我要去鎮上')

  // 開啟物品欄 -> 點選裝備
  rb.keyTap('i')

  await delay()

  _moveMouseByOffset(x, y, 裝備_offset, { randomX: 2, randomY: 2 })

  await delay()

  clickMouse()

  await delay()

  _moveMouseByOffset(x, y, 背包整理_offest, { randomX: 2, randomY: 2 })
  clickMouse()

  await delay()

  _moveMouseByOffset(x, y, 背包向上_offest, { randomX: 2, randomY: 2 })
  clickMouse()

  await delay()

  // 設定好第一個座標
  let row = paramRow
  let column = paramColumn // 第一個要被分解的物品的座標
  const eachBlockSize = 42
  const firstCoordinate = { x: 30, y: 155 }

  // 開啟分解框
  _moveMouseByOffset(x, y, extractOpenOffset, { randomX: 2, randomY: 2 })
  await delay()
  clickMouse()
  await delay()

  let offset = null
  for (let index = 1; index <= Infinity; index++) {
    offset = _getOffsetByCoordinate(row, column)
    _moveMouseByOffset(x, y, offset, { randomX: 3, randomY: 3 })
    await delay(50)
    clickRightMouse()
    await delay(50)

    // 檢查是不是不能分解的東西、會跳出一個框的那種，會自動把他按掉
    _checkHasExtraHint()

    if (index % 5 === 0) {
      // 檢查是不是做了點擊的動作之後，仍舊符合關閉的條件
      // 也是要先移動去空白的地方，不然會被情詳遮到
      _moveMouseByOffset(x, y, { x: confirmOffset.x + 50, y: confirmOffset.y + 50 }, { randomX: 5, randomY: 2 })
      await delay()
      if (rb.getPixelColor(confirmColor.ax - 5, confirmColor.ay - 5) !== 'ffffff') {
        console.log('已經沒了!')
        break
      }
    }

    const { row: nRow, column: nColumn } = _toNextRowColumn(row, column)
    row = nRow
    column = nColumn
    offset = _getOffsetByCoordinate(row, column)

    const maxNumberOfExtractOnce = 30
    if (index % maxNumberOfExtractOnce === 0) {
      // 先移到空白的地方, 避免那些道具詳情影響畫面
      _moveMouseByOffset(x, y, { x: confirmOffset.x + 50, y: confirmOffset.y + 50 }, { randomX: 5, randomY: 2 })
      await delay()

      _moveMouseByOffset(x, y, confirmOffset, { randomX: 5, randomY: 2 })
      await delay()

      // 檢查顏色
      const currentColor = rb.getPixelColor(confirmColor.ax - 5, confirmColor.ay - 5)
      if (currentColor !== 'ffffff') {
        console.log('已經沒了!')
        break
      }

      clickMouse()
      await delay()
      pressEnter()
      await delay()

      await waitUntil({
        x,
        y,
        message: '完成', // 這邊真的有點不準確..
        maxWait: 10 * 1000,
        interval: 200,
        place: 'extract',
      })

      pressEnter()
      await delay()

      // 為了把東西全部往上放，所以要先把框關掉
      await delay()
      _keyIn(['escape'])
      await delay()

      // 把東西全部往上放
      _moveMouseByOffset(x, y, 背包整理_offest, { randomX: 2, randomY: 2 })
      await delay()
      clickMouse()
      await delay()
      _moveMouseByOffset(x, y, 背包向上_offest, { randomX: 2, randomY: 2 })
      await delay()
      clickMouse()
      await delay()

      // 因為物品往上了，所以座標也要重新開始
      row = paramRow
      column = paramColumn

      // 再重新把分解框叫出來
      _moveMouseByOffset(x, y, extractOpenOffset, { randomX: 2, randomY: 2 })
      await delay()
      clickMouse()
      await delay()
    }
  }

  // 關閉分解和裝備視窗
  _keyIn(Array(2).fill('escape'))

  function _toNextRowColumn(row, coloumn) {
    let returnRow = row
    let returnColumn = coloumn

    returnColumn = coloumn % 4 === 0 ? returnColumn - 3 : returnColumn + 1

    if (column % 4 === 0) {
      returnRow++
    }
    if (returnRow % 9 === 0) {
      returnRow = 1
      returnColumn += 4
    }

    return {
      row: returnRow,
      column: returnColumn,
    }
  }

  function _getOffsetByCoordinate(row, column) {
    const offset = {
      x: firstCoordinate.x + (column - 1) * eachBlockSize,
      y: firstCoordinate.y + (row - 1) * eachBlockSize,
    }
    return offset
  }

  function _checkHasExtraHint() {
    const hintOkPoint = { x: x + 791, y: y + 444, color: '99dd00' }
    const hintOkColor = rb.getPixelColor(hintOkPoint.x, hintOkPoint.y)
    const hasMessage = hintOkColor === hintOkPoint.color
    if (hasMessage) pressEnter()
  }
}

export async function market() {
  const { x, y } = getApplicationInfo()

  if (!(await englishMarket(x, y))) return void console.log('記得切換到英文喔')

  console.log('包包容量: ', bagSize)

  await goToSearch(x, y)

  // 清空畫面，不然會買到其他東西。。。
  await clearMarket(x, y)

  let boughtNumber = 0

  // 買防具的部分會買到不能分解的東西，這部分還要想要怎麼跳過
  /*
  boughtNumber = await 買防具({ x, y, boughtNumber, price: 70000, level: 130, message: '開始買 130 防具' })
  await delay(2000)
  if (boughtNumber == null) return { status: MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS }
  if (!checkMax(boughtNumber, bagSize)) return { status: MARKET_MATCH_MAX_STATYS }
  console.log('')
  */

  boughtNumber = await 買武器({ x, y, boughtNumber, price: 70000, level: 130, message: '開始買 130 武器' })
  await delay(2000)
  if (boughtNumber == null) return { status: MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS }
  if (!checkMax(boughtNumber, bagSize)) return { status: MARKET_MATCH_MAX_STATYS }
  console.log('')

  /*
  boughtNumber = await 買防具({ x, y, boughtNumber, price: 50000, message: '開始買 108 防具' })
  await delay(2000)
  if (boughtNumber == null) return { status: MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS }
  if (!checkMax(boughtNumber, bagSize)) return { status: MARKET_MATCH_MAX_STATYS }
  console.log('')
  */

  boughtNumber = await 買武器({ x, y, boughtNumber, price: 50000, message: '開始買 108 武器' })
  await delay(2000)
  if (boughtNumber == null) return { status: MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS }
  if (!checkMax(boughtNumber, bagSize)) return { status: MARKET_MATCH_MAX_STATYS }
  console.log('')

  pressEnter()
  console.log('市場結束囉!')

  return { status: MARKET_NO_MORE_STATUS }
}

// 得要是英文輸入才可以
async function englishMarket(x, y) {
  _moveMouseByOffset(x, y, 市場搜尋_offset, { randomX: 2, randomY: 1 })
  await delay()
  clickMouse()
  await delay()
  _keyIn('123')

  let is123 = await waitUntil({ x, y, message: '123', place: 'market-search' })
  if (is123 == null) {
    _keyIn(Array(5).fill('backspace'))
    await delay()

    rb.keyTap('shift')
    await delay()

    _keyIn('123')
    is123 = await waitUntil({ x, y, message: '123', place: 'market-search' })

    if (is123 == null) return false

    return true
  }

  return true
}

async function goToSearch(x, y) {
  pressEnter()
  await delay(50)

  for (let i = 0; i < 2; i++) {
    _moveMouseByOffset(x, y, 查詢_offset)
    await delay(50)
    clickMouse()
    await delay(50)
  }
}

async function clearMarket(x, y) {
  const 標題_offset = 防具_offset
  const 重置_offset = 防具重置_offset
  const 等級_offset = 防具等級_offset
  const 價格_offset = 防具價格_offset
  const 搜尋_offset = 防具搜尋_offset
  const price = 1
  const level = 300

  await setPriceAndLevel(x, y, { 標題_offset, 重置_offset, 等級_offset, 價格_offset, 搜尋_offset, price, level })
  await delay(3500)
}

async function 買防具({ x, y, boughtNumber, price, level, message = '開始買防具' } = {}) {
  console.log(message)

  return buyByOffset({
    x,
    y,
    price,
    level,
    標題_offset: 防具_offset,
    重置_offset: 防具重置_offset,
    等級_offset: 防具等級_offset,
    價格_offset: 防具價格_offset,
    搜尋_offset: 防具搜尋_offset,
    boughtNumber,
  })
}
async function 買武器({ x, y, boughtNumber, price, level, message = '開始買武器' } = {}) {
  console.log(message)

  return buyByOffset({
    x,
    y,
    price,
    level,
    標題_offset: 武器_offset,
    重置_offset: 武器重置_offset,
    等級_offset: 武器等級_offset,
    價格_offset: 武器價格_offset,
    搜尋_offset: 武器搜尋_offset,
    boughtNumber,
  })
}

function checkMax(boughtNumber, bagSize) {
  if (boughtNumber >= bagSize) {
    console.log('達到上限了!')
    console.log(`這次買了 ${boughtNumber} 個`)
    return false
  }

  return true
}

async function setPriceAndLevel(x, y, config) {
  const { 標題_offset, 重置_offset, 等級_offset, 價格_offset, 搜尋_offset, price, level } = config

  _moveMouseByOffset(x, y, 標題_offset)
  await delay(50)
  clickMouse()
  await delay(50)

  _moveMouseByOffset(x, y, 重置_offset, { randomX: 2, randomY: 2 })
  await delay(50)
  clickMouse()
  await delay(50)

  _moveMouseByOffset(x, y, 價格_offset, { randomX: 2, randomY: 2 })
  await delay(50)
  clickMouse()
  await delay(50)
  _keyIn(String(price))
  await delay(50)

  _moveMouseByOffset(x, y, 等級_offset, { randomX: 2, randomY: 2 })
  await delay(50)
  clickMouse()
  await delay(50)
  _keyIn(String(level))
  await delay(50)

  _moveMouseByOffset(x, y, 搜尋_offset, { randomX: 2, randomY: 2 })
  await delay(50)
  clickMouse()
  await delay(50)
  pressEnter()
}

async function buyByOffset(config) {
  const {
    x,
    y,

    標題_offset,
    重置_offset,
    等級_offset,
    價格_offset,
    搜尋_offset,
    price = 40000,
    level = 108,

    boughtNumber: preBoughtNumber = 0,
  } = config

  await goToSearch(x, y)

  await setPriceAndLevel(x, y, { 標題_offset, 重置_offset, 等級_offset, 價格_offset, 搜尋_offset, price, level })

  // 等待查詢結果
  await Promise.race([
    waitUntil({
      x,
      y,
      message: [['搜尋結果'], ['查無此道具。']],
      maxWait: 10 * 1000,
      place: ['result', 'center'],
    }),
  ])

  if (!(await checkPage(x, y))) {
    console.log('沒有頁碼!')
    return preBoughtNumber
  }

  let boughtNumber = preBoughtNumber
  const buyRoundResult = await buyRoundRecursive()

  console.log(`總共買了 ${boughtNumber} 個!`)

  if (buyRoundResult == null) return null
  return boughtNumber

  async function buyRoundRecursive() {
    await _buyRecursive()
    const recievedSuccess = await recieveItems(x, y)

    await goToSearch(x, y)

    if (recievedSuccess && boughtNumber < bagSize && (await checkPage(x, y))) {
      await buyRoundRecursive()
    }

    if (!recievedSuccess) return null
    return true
  }

  async function _buyRecursive(previousBuy = 0) {
    if (!(await checkPage(x, y))) return previousBuy

    // 超過包包了
    if (boughtNumber >= bagSize) return previousBuy

    await buy(x, y)
    const currentBuy = previousBuy + 1
    boughtNumber += 1
    console.log(`目前買了 ${boughtNumber} 個`)

    if (currentBuy === 100) return currentBuy
    return _buyRecursive(currentBuy)
  }
}

export async function getCurrentPage(x, y) {
  return getTextByOffset(x, y, 頁碼左上_offset, 頁碼右下_offset)
}
export async function checkPage(x, y) {
  const pageText = await getCurrentPage(x, y)

  if (!/\d+\/?\d+/.test(pageText)) return null
  if (pageText === '0/0') return null

  return true
}

// TODO 當沒有東西要回收的時候要不要提早結束，目前等到 timeout 的話也不會出錯
export async function recieveItems(x, y) {
  pressEnter()
  await delay()

  // move to complete button
  _moveMouseByOffset(x, y, completeOffset)
  await delay()
  clickMouse()
  await delay()

  // move to accept all recieved items
  _moveMouseByOffset(x, y, recievedButtonOffset)
  await delay()
  clickMouse()
  await delay()
  pressEnter()

  await waitUntil({
    x,
    y,
    message: ['已完成', '只能持有'],
    maxWait: 120 * 1000, // 這個可以改成依照買的數量做動態變動, 之前 10 個的話是 15 秒
  })

  const complete = await waitUntil({
    x,
    y,
    message: '已完成',
    maxWait: 1 * 1000,
  })

  pressEnter()
  await delay()

  return complete
}

const itemOffset = 55
const firstItem左上offset = { x: 349, y: 225 }
const firstItem右下offset = { x: 448, y: 251 }

export async function buy(x, y, offset = firstItemOffset) {
  _moveMouseByOffset(x, y, offset)
  await delay()
  clickMouse()
  await delay()

  // click buy button
  _moveMouseByOffset(x, y, buyButtonOffset)
  await delay()
  clickMouse()
  await delay()

  pressEnter()
  await waitUntil({
    x,
    y,
    message: ['成功', '不足', '不存在'], // TODO 這個要加上 "是哪個符合到了" 的功能，畢竟要做的事情不一樣
    maxWait: 10 * 1000,
  })

  pressEnter()
  await delay()
}
