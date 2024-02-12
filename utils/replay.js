import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import { beforeStart } from './others.js'
import path from 'path'
import rb from 'robotjs'

const v = new GlobalKeyboardListener()

const keyMap = {
  VK_RIGHT: 'right',
  VK_LEFT: 'left',
  VK_LMENU: 'alt',

  VK_2: '2',
  VK_3: '3',
  VK_A: 'a',
  VK_D: 'd',
  VK_DOWN: 'down',
  VK_F: 'f',
  VK_G: 'g',
  VK_NUMPAD7: 'home',
  VK_UP: 'up',
  VK_V: 'v',
  VK_W: 'w',
  VK_Y: 'y',
}

async function start() {
  await beforeStart(3)

  // 讀取歷程檔案
  const fileName = './behavior/thunder.json'
  const file = fs.readFileSync(path.resolve(fileName), 'utf8')
  const steps = JSON.parse(file)

  // 用於中斷的時候清除 timeout
  const timeoutList = []
  let finishedCount = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const timer = setTimeout(() => {
      console.log(step)

      if (keyMap[step.nameRaw] != null) {
        rb.keyToggle(keyMap[step.nameRaw], step.state.toLowerCase())
      } else {
        console.log(`傳入的 key 還沒有 map!`, step.nameRaw)
      }

      finishedCount++
      if (finishedCount === steps.length) v.removeListener(listener)
    }, step.timestamp)

    // for remove
    timeoutList.push(timer)
  }

  function listener(event) {
    // 按下 esc 的時候終止
    if (event.name === 'ESCAPE') {
      timeoutList.forEach((timer) => clearTimeout(timer))
      console.log('Dinner time!')

      v.removeListener(listener)
    }
  }
  v.addListener(listener)
}

start()
