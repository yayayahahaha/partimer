import { getForegroundWindowRect, getForegroundWindowTitle } from './application-control.js'
import { pressEnter } from './keyboard-action.js'
import { clickMouse, moveMouseWithBezier, getCurrentCoordinate } from './mouse-control.js'

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

  if (showConsole) {
    console.log(`Foreground application title: ${applicationTitle}`)
    console.log(`Application cordinatins: x: ${x}, y: ${y}, endX: ${endX}, endY: ${endY}`)
  }

  return { applicationTitle, x, y, endX, endY }
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

async function extract(times = 5) {
  const { x, y } = getApplicationInfo()

  // const [cx, cy] = getCurrentCoordinate()
  // console.log(cx - x, cy - y)

  const extractOpenOffset = { x: 521, y: 455 }
  const putOnOffset = { x: 620, y: 500 }
  const confirmOffset = { x: 730, y: 500 }

  // open extract button
  _moveMouseByOffset(x, y, extractOpenOffset, { randomX: 3, randomY: 3 })
  await delay()
  clickMouse()
  await delay()

  for (let i = 0; i < times; i++) {
    // put everythings on the table
    _moveMouseByOffset(x, y, putOnOffset, { randomX: 5, randomY: 3 })
    await delay()
    clickMouse()
    await delay()

    // confirm
    _moveMouseByOffset(x, y, confirmOffset, { randomX: 5, randomY: 3 })
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

export { delay, beforeStart, getApplicationInfo, buy, extract }
