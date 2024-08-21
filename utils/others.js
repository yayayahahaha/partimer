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

const bagSize = 65
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

const 背包整理_offest = { x: 172, y: 486 }
const 背包向上_offest = { x: 208, y: 496 }

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

export async function marketAndExtract() {
  const { x, y } = getApplicationInfo()

  const townName = await waitUntil({ x, y, maxWait: 6 * 1000, message: '梅斯特', place: 'town' })
  if (townName == null) return void console.log('要先到鎮上喔')

  _keyIn([']', ...Array(4).fill('down')])
  pressEnter()

  const inMarket = await waitUntil({ x, y, message: '楓之谷拍賣', place: 'market-title' })
  if (inMarket == null) return void console.log('到不了市場。。。')

  const marketResult = await market()

  _moveMouseByOffset(x, y, 離開_offset)

  // 為了回到城鎮，所以檢查會放在離開的後面
  if (marketResult == null) return

  await delay()
  clickMouse()
  await delay()

  await extract()

  console.log('結束囉!')
  return marketResult // for recursive stuff
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

function getMarketResult(x, y) {
  return getTextByOffset(x, y, 搜尋結果左上_offset, 搜尋結果右下_offset, 'chi_tra')
}

async function checkPage(x, y) {
  const pageText = await getTextByOffset(x, y, 頁碼左上_offset, 頁碼右下_offset)

  if (!/\d+\/?\d+/.test(pageText)) return null
  if (pageText === '0/0') return null

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

export const MARKET_HAS_ITEM_WHICH_CAN_ONLY_HAVE_ONE_STATUS = 'has-item-which-can-only-have-one-status'
export const MARKET_MATCH_MAX_STATYS = 'match-max-status'
export const MARKET_NO_MORE_STATUS = 'no-more-status'
export async function market() {
  const { x, y } = getApplicationInfo()

  if (!(await englishMarket(x, y))) return void console.log('記得切換到英文喔')

  console.log('包包容量: ', bagSize)

  await goToSearch(x, y)

  // 清空畫面，不然會買到其他東西。。。
  await clearMarket(x, y)

  let boughtNumber = 0

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

// 開始前的倒數
async function beforeStart(sec = 5) {
  console.log(`Start in ${sec} sec`)

  for (let i = 1; i < sec + 1; i++) {
    await delay(1000, 0)
    sec - i && console.log(sec - i)
  }
}

export function getApplicationInfo(showConsole = true) {
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

// TODO 這個蠻好用的，可以改寫放到其他地方試試看
// 覺得需要有一個 instance 去處理的感覺，不然會有點亂
async function waitUntil({ x, y, message, maxWait = 5000, interval = 100, place = 'center', test = false } = {}) {
  let stopTry = false

  let delayResolve = null

  return Promise.race([
    // max wait timer
    new Promise((resolve) => {
      const timer = setTimeout(() => {
        stopTry = true
        return null
      }, maxWait)

      delayResolve = function () {
        clearTimeout(timer)
        resolve(null)
      }
    }),

    // retry function
    new Promise((resolve) => {
      checkMessage()

      async function checkMessage() {
        if (!Array.isArray(message)) {
          // TODO 改寫法
          message = [[message]]
        } else if (!message.every((m) => Array.isArray(m))) {
          message = [message]
        }

        if (!Array.isArray(place)) {
          // TODO 改寫法
          place = [place]
        }

        const fList = place.map((place, i) => {
          switch (place) {
            case 'center':
              return { fn: getCenterMessage, message: message[i] || null }

            case 'extract':
              return { fn: getExtractMessage, message: message[i] || null }

            case 'town':
              return { fn: getTownName, message: message[i] || null }

            case 'market-title':
              return { fn: getMarketTitle, message: message[i] || null }

            case 'market-search':
              return { fn: getMarketSearch, message: message[i] || null }

            case 'result':
              return { fn: getMarketResult, message: message[i] || null }
          }
        })

        let result = false
        for (let i = 0; i < fList.length; i++) {
          const { fn, message } = fList[i]
          const imgText = await fn(x, y)
          let messageList = message

          test && console.log('waitUntil:', JSON.stringify(imgText), JSON.stringify(message))

          if (!Array.isArray(messageList)) messageList = [messageList]

          result = result || messageList.some((str) => imgText.match(new RegExp(str)))
          if (result) break
        }
        if (result) {
          resolve(true)

          // 避免 nodejs 卡住
          return void setTimeout(delayResolve, 100)
        }

        if (stopTry) return resolve(null)

        return setTimeout(checkMessage, interval)
      }
    }),
  ])
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
    maxWait: 15 * 1000,
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
    message: ['成功', '不足', '不存在'], // TODO 這個要加上 "是哪個符合到了" 的功能，畢竟要做的事情不一樣
    maxWait: 10 * 1000,
  })

  pressEnter()
  await delay()
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
    // console.log('color: ', rb.getPixelColor(997, 543))
    console.log('color: ', rb.getPixelColor(ax - 2, ay - 2))
    console.log('offset position: ', ax - x, ay - y)
    console.log()
  }, 1000)
}

async function extract(itemsCount = 65, { paramRow = 6, paramColumn = 5 } = {}) {
  const { x, y } = getApplicationInfo()

  const townName = await waitUntil({ x, y, maxWait: 60 * 1000, message: '梅斯特', place: 'town' })
  if (townName == null) return void console.log('回不去鎮上。。。')

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

  // into the town, turn on map name, scale up the bag size, move bag to aline with the map name.
  // please according the first items you want to extract define the veryFirstStart.
  let row = paramRow // 第一個要被分解的物品的座標
  let column = paramColumn // 第一個要被分解的物品的座標
  const eachBlockSize = 42
  const firstCoordinate = { x: 30, y: 155 }

  const extractOpenOffset = { x: 485, y: 489 }
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

    _checkHasExtraHint()

    const { row: nRow, column: nColumn } = _toNextRowColumn(row, column)
    row = nRow
    column = nColumn
    offset = _getOffsetByCoordinate(row, column)

    if (index % 10 === 0) {
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

export function promiseTest() {
  // 測試 promise.race 就算已經有一個回來了， nodejs 還是會被另一個卡住
  const a = function () {
    return new Promise((resolve) => {
      let i = 0
      setInterval(() => {
        i++
        console.log(i)
        if (i === 10) {
          resolve(1)
        }
      }, 1000)
    })
  }
  const b = function () {
    return new Promise((resolve) => {
      let i = 0
      setInterval(() => {
        i++
        console.log(i)
        if (i === 5) {
          resolve(2)
        }
      }, 1000)
    })
  }
  Promise.race([a(), b()]).then((r) => console.log(r))
}

export { delay, beforeStart, extract, displayMousePosition }
