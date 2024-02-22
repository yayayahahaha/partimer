import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import path from 'path'
import rb from 'robotjs'
import { hasColor, PURPLE_COLOR, OTHER_USER_COLOR, USER_COLOR } from './screen.js'

const keyMap = {
  VK_RIGHT: 'right',
  VK_LEFT: 'left',
  VK_LMENU: 'alt',
  VK_END: 'end',

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
  VK_E: 'e',
  VK_T: 't',
  VK_W: 'w',
  VK_Y: 'y',
  VK_R: 'r',
  VK_DELETE: 'delete',
  VK_NEXT: 'pagedown',
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

  // 讀取歷程檔案
  let steps = null
  if (typeof type === 'string') {
    const fileName = type
    const file = fs.readFileSync(path.resolve(fileName), 'utf8')
    steps = JSON.parse(file)
  } else {
    steps = type
  }

  // 檢查顏色
  const intervalCheck = setInterval(() => {
    hasColor(PURPLE_COLOR)
    hasColor(OTHER_USER_COLOR)
    // hasColor(USER_COLOR)
  }, 3000)

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
        const flow = Math.random() > 0.5 ? ['VK_A', 'VK_G', 'VK_Y'] : ['VK_G', 'VK_A', 'VK_Y']
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
          const basicKey = Math.random() > 0.9 ? 'VK_E' : 'VK_V'
          rb.keyToggle(keyMap[basicKey], 'down')
          setTimeout(() => rb.keyToggle(keyMap[basicKey], 'up'), 130 + Math.random() * 50)
        }
      })()

      finishedCount++

      if (finishedCount % 100 === 0) console.log(finishedCount, step.index + 1)
      if (finishedCount === steps.length) finished()
    }, step.timestamp)

    // for remove
    timeoutList.push(eachStepTimer)
  }

  function finished() {
    console.log('finished!!', resolveFunction)
    clearInterval(intervalCheck)
    resolveFunction()
  }

  return promise
}

async function go(times = 3, type) {
  for (let i = 0; i < times; i++) {
    console.log('type: ', type)
    await replayStar(type)
  }
}

function anotherGo() {
  const v = new GlobalKeyboardListener()
  function listener(event) {
    // 按下 esc 的時候終止, 不知道為什麼有時候會失效，應該是 stack 的問題
    if (event.name === 'ESCAPE') {
      timeoutList.forEach((timer) => clearTimeout(timer))
      console.log('Dinner time!')
      v.removeListener(listener)
    }
  }
  v.addListener(listener)

  // backup
  // 'behavior/left-right-1.json'
  // 'behavior/left-right-2.json'
  // 'behavior/left-right-3.json'

  const left = [
    { from: 'left', to: 'top', file: './behavior/left-top-1.json', steps: null },
    { from: 'left', to: 'top', file: './behavior/left-top-2.json', steps: null },
    { from: 'left', to: 'top', file: './behavior/left-top-3.json', steps: null },
    { from: 'left', to: 'bottom', file: './behavior/left-bottom-1.json', steps: null },
    { from: 'left', to: 'bottom', file: './behavior/left-bottom-2.json', steps: null },
  ]
  const top = [
    { from: 'top', to: 'left', file: './behavior/top-middle-1.json', steps: null },
    { from: 'top', to: 'left', file: './behavior/top-middle-2.json', steps: null },
  ]
  const bottom = [
    { from: 'bottom', to: 'left', file: './behavior/bottom-middle-1.json', steps: null },
    { from: 'bottom', to: 'left', file: './behavior/bottom-middle-2.json', steps: null },
  ]
  const moveMap = { left, top, bottom }

  Object.keys(moveMap).forEach((keys) => {
    moveMap[keys].forEach((move) => {
      const fileName = move.file
      const fileContent = fs.readFileSync(fileName, 'utf8')
      move.steps = JSON.parse(fileContent)
    })
  })

  async function start(from = 'left') {
    const index = Math.floor(Math.random() * moveMap[from].length)
    const move = moveMap[from][index]
    console.log('current move: ', move.file)
    await replayStar(move.steps)

    start(move.to)
  }

  start()
}

export { replayStar, go, anotherGo }
