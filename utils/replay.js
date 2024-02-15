import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import { beforeStart } from './others.js'
import path from 'path'
import rb from 'robotjs'

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
  VK_HOME: 'home',
  VK_UP: 'up',
  VK_V: 'v',
  VK_T: 't',
  VK_W: 'w',
  VK_Y: 'y',
}

const attackMap = {
  VK_V: {
    coldTime: 0 * 1000,
    previousTimestamp: 0,
  },
  VK_R: {
    coldTime: 10 * 1000,
    previousTimestamp: 0,
  },

  VK_G: {
    coldTime: 9 * 1000,
    previousTimestamp: 0,
  },
  VK_A: {
    coldTime: 13 * 1000,
    previousTimestamp: 0,
  },
  VK_Y: {
    coldTime: 46 * 1000,
    previousTimestamp: 0,
  },
}

const THUNDER_STAR = './behavior/thunder.json'
function replayStar(type = THUNDER_STAR) {
  let resolveFunction = null
  const promise = new Promise((resolve) => {
    resolveFunction = resolve
  })

  const v = new GlobalKeyboardListener()

  // 讀取歷程檔案
  const fileName = type
  const file = fs.readFileSync(path.resolve(fileName), 'utf8')
  const steps = JSON.parse(file)

  // 用於中斷的時候清除 timeout
  const timeoutList = []
  let finishedCount = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]

    if (keyMap[step.nameRaw] == null) {
      console.log(`傳入的 key 還沒有 map!`, step.nameRaw)
      continue
    }

    const eachStepTimer = setTimeout(() => {
      // for quick return
      ;(() => {
        // 如果不是攻擊技能，就直接操作
        if (attackMap[step.nameRaw] == null) return void rb.keyToggle(keyMap[step.nameRaw], step.state.toLowerCase())

        // 如果是攻擊技能的話，有一些判斷
        // up 不做事
        if (step.state.toLowerCase() === 'up') return

        // 是攻擊技能、也不是 up 的話，根據冷卻時間隨機發動技能
        const flow = Math.random() > 0.5 ? ['VK_A', 'VK_G'] : ['VK_G', 'VK_A']
        let everDo = false
        for (let aIndex = 0; aIndex < flow.length; aIndex++) {
          const skill = flow[aIndex]
          const { previousTimestamp, coldTime } = attackMap[skill]

          // 如果還在 cooldown 的話，
          const isInCoolDown = previousTimestamp + coldTime + Math.random() * 2000 > Date.now()
          if (isInCoolDown) continue

          rb.keyToggle(keyMap[skill], 'down')
          setTimeout(() => rb.keyToggle(keyMap[skill], 'up'), 130 + Math.random() * 50)
          attackMap[skill].previousTimestamp = Date.now()
          everDo = true
          break
        }

        // 如果沒有發動過上述技能的話，有一個基本的
        if (!everDo) {
          rb.keyToggle(keyMap['VK_V'], 'down')
          setTimeout(() => rb.keyToggle(keyMap['VK_V'], 'up'), 130 + Math.random() * 50)
        }
      })()

      finishedCount++
      if (finishedCount === steps.length) finished()
    }, step.timestamp)

    // for remove
    timeoutList.push(eachStepTimer)
  }

  function finished() {
    v.removeListener(listener)
    resolveFunction()
  }

  function listener(event) {
    // 按下 esc 的時候終止, 不知道為什麼有時候會失效，應該是 stack 的問題
    if (event.name === 'ESCAPE') {
      timeoutList.forEach((timer) => clearTimeout(timer))
      console.log('Dinner time!')

      v.removeListener(listener)
    }
  }
  v.addListener(listener)

  return promise
}

export { replayStar }
