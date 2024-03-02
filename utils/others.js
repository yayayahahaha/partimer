// 1366 * 768

import { getForegroundWindowRect, getForegroundWindowTitle } from './application-control.js'
import { pressEnter } from './keyboard-action.js'
import { clickMouse, moveMouseWithBezier, getCurrentCoordinate, clickRightMouse } from './mouse-control.js'
import rb from 'robotjs'
import { captureScreenAndConvertToJimp, recognizeText } from './text.js'

function delay(milSec = 200, randomSec = 100) {
  return new Promise((r) => {
    setTimeout(r, milSec + Math.floor(Math.random() * randomSec))
  })
}
function _keyIn(str) {
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    rb.keyTap(char)
  }
}

const bagSize = 80 // TEST codes
const searchOffset = { x: 120, y: 120 }
const firstItemOffset = { x: 950, y: 230 }
const buyButtonOffset = { x: 950, y: 750 }
const completeOffset = { x: 920, y: 120 }
const recievedButtonOffset = { x: 970, y: 170 }
const 搜尋結果左上_offset = { x: 285, y: 155 }
const 搜尋結果右下_offset = { x: 355, y: 180 }
const 頁碼左上_offset = { x: 619, y: 156 }
const 頁碼右下_offset = { x: 668, y: 176 }
const 中央訊息左上_offset = { x: 435, y: 414 }
const 中央訊息右下_offset = { x: 583, y: 437 }
const 查詢_offset = { x: 115, y: 126 }
const 分解訊息左上_offset = { x: 650, y: 473 }
const 分解訊息右下_offset = { x: 730, y: 500 }
const 離開_offset = { x: 977, y: 56 }
const 鎮名左上_Offset = { x: 135, y: 60 }
const 鎮名右下_Offset = { x: 188, y: 80 }
const 裝備_offset = { x: 30, y: 124 }

const 市場標題左上_Offset = { x: 11, y: 43 }
const 市場標題右下_Offset = { x: 140, y: 75 }

const 市場搜尋_offset = { x: 198, y: 85 }
const 市場搜尋左上_offset = { x: 100, y: 81 }
const 市場搜尋右下_offset = { x: 250, y: 96 }

// 得要是英文輸入才可以
async function englishMarket(x, y) {
  _moveMouseByOffset(x, y, 市場搜尋_offset)
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

export async function marketAndExtract() {
  const { x, y } = getApplicationInfo()

  let townName = await waitUntil({ x, y, maxWait: 6 * 1000, message: '梅斯特', place: 'town' })
  if (townName == null) {
    console.log('要先到鎮上喔')
    return
  }

  _keyIn([']', ...Array(4).fill('down')])
  pressEnter()

  const inMarket = await waitUntil({ x, y, message: '楓之谷拍賣', place: 'market-title' })
  if (inMarket == null) {
    console.log('到不了市場。。。')
    return
  }

  if (!(await englishMarket(x, y))) {
    console.log('記得切換到英文喔')
    return
  }

  await market()

  _moveMouseByOffset(x, y, 離開_offset)
  await delay()
  clickMouse()
  await delay()

  townName = await waitUntil({ x, y, maxWait: 60 * 1000, message: '梅斯特', place: 'town' })
  if (townName == null) {
    console.log('回不去鎮上。。。')
    return
  }

  rb.keyTap('i')
  await delay()

  _moveMouseByOffset(x, y, 裝備_offset, { randomX: 2, randomY: 2 })
  await delay()
  clickMouse()
  await delay()

  await extract()

  console.log('結束囉!')
}

function getCenterMessage(x, y) {
  return getTextByOffset(x, y, 中央訊息左上_offset, 中央訊息右下_offset, 'chi_tra')
}

function getExtractMessage(x, y) {
  return getTextByOffset(x, y, 分解訊息左上_offset, 分解訊息右下_offset, 'chi_tra')
}

function getTownName(x, y) {
  return getTextByOffset(x, y, 鎮名左上_Offset, 鎮名右下_Offset, 'chi_tra')
}

function getMarketTitle(x, y) {
  return getTextByOffset(x, y, 市場標題左上_Offset, 市場標題右下_Offset, 'chi_tra')
}

function getMarketSearch(x, y) {
  return getTextByOffset(x, y, 市場搜尋左上_offset, 市場搜尋右下_offset)
}

async function isHasResult(x, y) {
  const resultText = await getTextByOffset(x, y, 搜尋結果左上_offset, 搜尋結果右下_offset, 'chi_tra')
  const centerText = await getCenterMessage(x, y)

  if (centerText === '查無此道具。') return false

  if (resultText !== '搜尋結果') return false

  if (!(await checkPage(x, y))) return false

  return true
}

async function checkPage(x, y) {
  const pageText = await getTextByOffset(x, y, 頁碼左上_offset, 頁碼右下_offset)

  if (!/\d+\/\d+/.test(pageText)) return null
  if (pageText === '0/0') return null

  return true
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

  // 等待查詢結果
  await delay(1000) // TODO 改成圖像查詢?

  if (!(await isHasResult(x, y))) {
    console.log('沒有結果!')
    return preBoughtNumber
  }

  if (!(await checkPage(x, y))) {
    console.log('沒有頁碼!')
    return preBoughtNumber
  }

  let boughtNumber = preBoughtNumber
  await buyRoundRecursive()

  console.log(`總共買了 ${boughtNumber} 個!`)
  return boughtNumber

  async function buyRoundRecursive() {
    await _buyRecursive()
    await recieveItems(x, y)

    await goToSearch(x, y)

    if (boughtNumber < bagSize && (await checkPage(x, y))) {
      await buyRoundRecursive()
    }
  }

  async function _buyRecursive(previousBuy = 0) {
    if (!(await checkPage(x, y))) return previousBuy

    // 超過包包了
    if (boughtNumber >= bagSize) return previousBuy

    await buySingle(x, y)
    const currentBuy = previousBuy + 1
    boughtNumber += 1
    console.log(`目前買了 ${boughtNumber} 個`)

    if (currentBuy === 10) return currentBuy
    return _buyRecursive(currentBuy)
  }
}
async function 買防具({ x, y, boughtNumber, price, level, message = '開始買防具' } = {}) {
  console.log(message)

  const 防具_offset = { x: 135, y: 168 }
  const 防具重置_offset = { x: 135, y: 629 }
  const 防具等級_offset = { x: 106, y: 369 }
  const 防具價格_offset = { x: 211, y: 392 }
  const 防具搜尋_offset = { x: 214, y: 637 }

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

  const 武器_offset = { x: 147, y: 670 }
  const 武器重置_offset = { x: 136, y: 631 }
  const 武器等級_offset = { x: 118, y: 368 }
  const 武器價格_offset = { x: 216, y: 396 }
  const 武器搜尋_offset = { x: 220, y: 637 }

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

export async function market() {
  const { x, y } = getApplicationInfo()

  console.log('包包容量: ', bagSize)

  let boughtNumber = 0

  boughtNumber = await 買防具({ x, y, boughtNumber, message: '開始買 108 防具' })
  if (!checkMax(boughtNumber, bagSize)) return
  console.log('')

  boughtNumber = await 買武器({ x, y, boughtNumber, message: '開始買 108 武器' })
  if (!checkMax(boughtNumber, bagSize)) return
  console.log('')

  boughtNumber = await 買防具({ x, y, boughtNumber, price: 60000, level: 130, message: '開始買 130 防具' })
  if (!checkMax(boughtNumber, bagSize)) return
  console.log('')

  boughtNumber = await 買武器({ x, y, boughtNumber, price: 60000, level: 130, message: '開始買 130 武器' })
  if (!checkMax(boughtNumber, bagSize)) return
  console.log('')

  pressEnter()
  console.log('結束囉!')
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

async function getTextByOffset(x, y, startOffset, endOffset, language = 'eng') {
  const setting = {
    x: x + startOffset.x,
    y: y + startOffset.y,
    width: endOffset.x - startOffset.x,
    height: endOffset.y - startOffset.y,
    noDefault: true,
  }
  const imgBuffer = await captureScreenAndConvertToJimp(setting)
  const recognizedText = await recognizeText(imgBuffer, language)
  return recognizedText.replace(/\s+/g, '')
}

async function beforeStart(sec = 5) {
  console.log(`Start in ${sec} sec`)

  for (let i = 1; i < sec + 1; i++) {
    await delay(1000, 0)
    sec - i && console.log(sec - i)
  }
}

function getApplicationInfo(showConsole = true) {
  const applicationTitle = getForegroundWindowTitle()
  const { left: x, top: y, right: endX, bottom: endY } = getForegroundWindowRect()
  const width = endX - x
  const height = endY - y

  if (showConsole) {
    console.log(`Foreground application title: ${applicationTitle}`)
    console.log(`Application cordinatins: x: ${x}, y: ${y}, endX: ${endX}, endY: ${endY}`)
  }

  return { applicationTitle, x, y, endX, endY, width, height }
}

async function waitUntil({ x, y, message, maxWait = 5000, interval = 100, place = 'center', test = false } = {}) {
  let stopTry = false

  return Promise.race([
    delay(maxWait).then(() => {
      stopTry = true
      return null
    }),
    new Promise((resolve) => {
      return checkMessage()

      async function checkMessage() {
        const screenMessage =
          place === 'center'
            ? await getCenterMessage(x, y)
            : place === 'extract'
              ? await getExtractMessage(x, y)
              : place === 'town'
                ? await getTownName(x, y)
                : place === 'market-title'
                  ? await getMarketTitle(x, y)
                  : place === 'market-search'
                    ? await getMarketSearch(x, y)
                    : () => null

        test && console.log('waitUntil:', JSON.stringify(screenMessage), JSON.stringify(message))

        if (Array.isArray(message)) {
          if (message.some((str) => screenMessage.match(new RegExp(str)))) {
            return resolve(true)
          }
        } else if (screenMessage.match(new RegExp(message))) return resolve(true)

        if (stopTry) return resolve(null)

        return setTimeout(checkMessage, interval)
      }
    }),
  ])
}

async function recieveItems(x, y) {
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
    message: '已完成',
    maxWait: 15 * 1000,
  })

  pressEnter()
  await delay()
}

async function buySingle(x, y) {
  _moveMouseByOffset(x, y, firstItemOffset)
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
    message: ['成功', '不足', '不存在'],
    maxWait: 10 * 1000,
  })

  pressEnter()
  await delay()
}

async function buy(buyTimes = 1, eachRoundItems = 10) {
  const { x, y } = getApplicationInfo()

  for (let i = 0; i < buyTimes; i++) {
    // click search button
    _moveMouseByOffset(x, y, searchOffset)
    await delay()
    clickMouse()
    await delay()

    // buy 10 items once
    for (let j = 0; j < eachRoundItems; j++) {
      // click first item
      _moveMouseByOffset(x, y, firstItemOffset)
      await delay()
      clickMouse()
      await delay()

      // click buy button
      _moveMouseByOffset(x, y, buyButtonOffset)
      await delay()
      clickMouse()
      await delay()

      pressEnter()
      await delay(800)

      pressEnter()
      await delay()
    }

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
    await delay(7500)
    pressEnter()
    await delay()
  }
}

function _moveMouseByOffset(x, y, offestPayload, { steps = 5000, randomX = 10, randomY = 10 } = {}) {
  moveMouseWithBezier(
    undefined,
    null,
    [
      Math.round(Math.random() * randomX) + x + offestPayload.x,
      Math.round(Math.random() * randomY) + y + offestPayload.y,
    ],
    steps
  )
}

function displayMousePosition() {
  const { x, y } = getApplicationInfo()
  setInterval(() => {
    const [ax, ay] = getCurrentCoordinate()
    console.log('absolute position: ', ax, ay)
    console.log('application position: ', x, y)
    // console.log('color: ', rb.getPixelColor(713 + x, 493 + y))
    console.log('offset position: ', ax - x, ay - y)
    console.log()
  }, 1000)
}

async function extract(itemsCount = 100) {
  const { x, y } = getApplicationInfo()

  // into the town, turn on map name, scale up the bag size, move bag to aline with the map name.
  // please according the first items you want to extract define the veryFirstStart.
  let row = 3
  let column = 8
  const eachBlockSize = 42
  const firstCoordinate = { x: 30, y: 155 }

  const extractOpenOffset = { x: 505, y: 489 }
  const confirmOffset = { x: 730, y: 499 }

  let offset = _getOffsetByCoordinate(row, column)

  _moveMouseByOffset(x, y, extractOpenOffset, { randomX: 2, randomY: 2 })
  await delay()
  clickMouse()
  await delay()

  const colorPoint = { ax: x + 713, ay: y + 493, color: 'ccee00' }

  for (let index = 1; index <= itemsCount; index++) {
    _moveMouseByOffset(x, y, offset, { randomX: 3, randomY: 3 })
    await delay(50)
    clickRightMouse()
    await delay(50)

    const { row: nRow, column: nColumn } = _toNextRowColumn(row, column)
    row = nRow
    column = nColumn
    offset = _getOffsetByCoordinate(row, column)

    if (index % 5 === 0) {
      // 先移到空白的地方, 避免那些道具詳情影響畫面
      _moveMouseByOffset(x, y, { x: confirmOffset.x + 50, y: confirmOffset.y + 50 }, { randomX: 5, randomY: 2 })
      await delay()

      _moveMouseByOffset(x, y, confirmOffset, { randomX: 5, randomY: 2 })
      await delay()

      // 檢查顏色
      const currentColor = rb.getPixelColor(colorPoint.ax, colorPoint.ay)
      if (currentColor !== colorPoint.color) {
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
        message: '分解完成',
        maxWait: 4 * 1000,
        interval: 200,
        place: 'extract',
      })

      pressEnter()
      await delay()
    }
  }

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
}

async function ocean() {
  const knife = {
    key: 't',
    current: 0,
    wait: 10 * 1000,
  }
  const wind = {
    key: 'f',
    current: 0,
    wait: 12 * 1000,
  }

  let count = 0
  setInterval(() => {
    const list = [knife, wind]
    for (let i = 0; i < list.length; i++) {
      const item = list[i]

      if (Date.now() - item.current > item.wait) {
        rb.keyTap(count % 2 === 0 ? 'left' : 'right')
        delay()

        rb.keyTap(item.key)
        delay()
        item.current = Date.now()
        break
      }
    }

    count++
  }, 1000)
}

export { delay, beforeStart, getApplicationInfo, buy, extract, displayMousePosition, ocean }
