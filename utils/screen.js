import rb from 'robotjs'
import { getApplicationInfo } from './others.js'
import fs from 'fs'
import Jimp from 'jimp'

const USER_COLOR = 'ffdd44'
const PURPLE_COLOR = 'dd66ff'

async function ringring(times = 10, interval = 500) {
  let finishedCount = 0
  return new Promise((resolve) => {
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        // system ringring
        process.stdout.write('\x07')
        finishedCount++
        if (finishedCount === times) resolve()
      }, interval * i)
    }
  })
}

function getMiniMapBitMap() {
  const { x, y, width: appWidth, height: appHeight } = getApplicationInfo(false)
  const miniMapOffset = { x: 10, y: 30, miniWidth: 170, miniHeight: 135 }

  return rb.screen.capture(x + miniMapOffset.x, y + miniMapOffset.y, miniMapOffset.miniWidth, miniMapOffset.miniHeight)
}

function hasColor(target = USER_COLOR, { writefile = false, consoleRing = false } = {}) {
  const miniMapBitMap = getMiniMapBitMap()

  const list = []
  let everUserRinging = false
  for (let i = 0; i < miniMapBitMap.width; i++) {
    list[i] = []
    for (let j = 0; j < miniMapBitMap.height; j++) {
      const color = miniMapBitMap.colorAt(i, j)
      list[i][j] = color

      if (target === color && !everUserRinging) {
        if (consoleRing) console.log('in ringring')

        everUserRinging = true
        ringring()
      }
    }
  }

  if (writefile) fs.writeFileSync(`color-${Date.now()}.json`, JSON.stringify(list, null, 2))
}

// https://stackoverflow.com/questions/41941151/capture-and-save-image-with-robotjs
function screenCaptureToFile2(robotScreenPic, path) {
  return new Promise((resolve, reject) => {
    try {
      const image = new Jimp(robotScreenPic.width, robotScreenPic.height)
      let pos = 0
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
        image.bitmap.data[idx + 2] = robotScreenPic.image.readUInt8(pos++)
        image.bitmap.data[idx + 1] = robotScreenPic.image.readUInt8(pos++)
        image.bitmap.data[idx + 0] = robotScreenPic.image.readUInt8(pos++)
        image.bitmap.data[idx + 3] = robotScreenPic.image.readUInt8(pos++)
      })
      image.write(path, resolve)
    } catch (e) {
      console.error(e)
      reject(e)
    }
  })
}

export { screenCaptureToFile2, ringring, hasColor, USER_COLOR, PURPLE_COLOR, getMiniMapBitMap }
