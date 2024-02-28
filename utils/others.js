// 1366 * 768

import { getForegroundWindowRect, getForegroundWindowTitle } from './application-control.js'
import { pressEnter } from './keyboard-action.js'
import { clickMouse, moveMouseWithBezier, getCurrentCoordinate, clickRightMouse } from './mouse-control.js'
import rb from 'robotjs'

const delay = (milSec = 200, randomSec = 100) =>
  new Promise((r) => {
    setTimeout(r, milSec + Math.floor(Math.random() * randomSec))
  })

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

async function buy(buyTimes = 1, eachRoundItems = 10) {
  const { x, y } = getApplicationInfo()

  const searchOffset = { x: 120, y: 120 }
  const firstItemOffset = { x: 950, y: 230 }
  const buyButtonOffset = { x: 950, y: 750 }
  const completeOffset = { x: 920, y: 120 }
  const recievedButtonOffset = { x: 970, y: 170 }

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
    console.log('offset position: ', ax - x, ay - y)
    console.log()
  }, 1000)
}

async function extract(itemsCount = 10) {
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

  for (let index = 1; index <= itemsCount; index++) {
    _moveMouseByOffset(x, y, offset, { randomX: 3, randomY: 3 })
    await delay()
    clickRightMouse()
    await delay()

    const { row: nRow, column: nColumn } = _toNextRowColumn(row, column)
    row = nRow
    column = nColumn
    offset = _getOffsetByCoordinate(row, column)

    if (index % 5 === 0) {
      _moveMouseByOffset(x, y, confirmOffset, { randomX: 5, randomY: 2 })
      await delay()
      clickMouse()
      await delay()
      pressEnter()
      await delay()

      await delay(4000)

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
    wait: 11 * 1000,
  }
  const wind = {
    key: 'f',
    current: 0,
    wait: 13 * 1000,
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
