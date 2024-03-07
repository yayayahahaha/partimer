import fs from 'fs'
import path from 'path'
import rb from 'robotjs'
import { hasColor, PURPLE_COLOR, OTHER_USER_COLOR, USER_COLOR } from './screen.js'
import { delay } from './others.js'

const az = new Array(26).fill().map((_, index) => String.fromCharCode('a'.codePointAt() + index))
const oneNine = new Array(10).fill().map((_, index) => `${index}`)

const keyMap = Object.assign(
  {
    VK_NUMPAD7: 'home',
    VK_HOME: 'home',

    VK_LMENU: 'alt',
    VK_END: 'end',

    VK_UP: 'up',
    VK_DOWN: 'down',
    VK_RIGHT: 'right',
    VK_LEFT: 'left',

    VK_DELETE: 'delete',
    VK_NEXT: 'pagedown',
  },
  Object.fromEntries(az.map((char) => [`VK_${char.toUpperCase()}`, char])),
  Object.fromEntries(oneNine.map((num) => [`VK_${num}`, `${num}`]))
)

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

const attackList = [
  {
    code: 'v',
    vkCode: 'VK_V',
    coldTime: 0 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'r',
    vkCode: 'VK_R',
    coldTime: 10 * 1000,
    previousTimestamp: 0,
  },

  {
    code: 'g',
    vkCode: 'VK_G',
    coldTime: 9 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'a',
    vkCode: 'VK_A',
    coldTime: 13 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'y',
    vkCode: 'VK_Y',
    coldTime: 46 * 1000,
    previousTimestamp: 0,
  },
]
const attackMap2 = Object.fromEntries(attackList.map((item) => [item.code, item]))

async function attack({ setLastDelay = 10 } = {}) {
  // 雖然已經很近了，但每個技能還是多少有一些時間差
  // 不設定這個的話霹靂可以更快，但位置會跑掉
  rb.setKeyboardDelay(Math.ceil(Math.random() * 5) + 75)

  let alreayAttack = false
  const current = Date.now()
  for (let i = 0; i < attackList.length; i++) {
    const attack = attackList[i]
    if (attack.previousTimestamp + attack.coldTime < current) {
      alreayAttack = true
      rb.keyTap(attack.code)

      // 隨機讓他更久一些
      attack.previousTimestamp = Date.now() - Math.round(Math.random() * 2000)
    }
  }

  if (!alreayAttack) _defaultAttack()

  rb.setKeyboardDelay(setLastDelay)
  rb.keyTap('f')
  rb.setKeyboardDelay(10)

  function _defaultAttack(test = false) {
    return rb.keyTap('v')

    const randomNum = Math.floor(Math.random() * 10)
    test && console.log('randomNum:', randomNum)

    switch (randomNum) {
      case 0:
        return rb.keyTap('e')
      case 1:
        return rb.keyTap('r')
      default:
        return rb.keyTap('v')
    }
  }
}
function attackThrough({ times = 5, direction = null, goBack = false, moveFirst = true } = {}) {
  if (moveFirst) turn(direction)

  if (!goBack) {
    for (let i = 0; i < times - 1; i++) {
      attack()
    }
    attack({ setLastDelay: 100 })
    return
  }

  // TODO times 太少的時候的測試
  // 寫得再複雜一些
  // 5: 1 or 2
  // 6: 1 or 2 or 3
  // 7: 1 or 2 or 3
  const turnStep = Math.ceil(Math.random() * Math.floor(times / 2))
  for (let i = 0; i < times - 1; i++) {
    attack()
  }
  attack({ setLastDelay: 100 })

  direction === 'left' ? turn('right') : turn('left')

  for (let i = 0; i < turnStep - 1; i++) {
    attack()
  }
  attack({ setLastDelay: 100 })

  turn(direction)

  for (let i = 0; i < turnStep - 1; i++) {
    attack()
  }
  attack({ setLastDelay: 100 })
}
function turn(direction = 'left') {
  rb.setKeyboardDelay(100)
  rb.keyToggle(direction, 'down')
  rb.keyToggle(direction, 'up')
  rb.setKeyboardDelay(10)
}
function goUp({ way = 'jump', delay = 500 } = {}) {
  // TODO 寫成 const value
  if (way === 'jump') {
    rb.setKeyboardDelay(100)
    rb.keyToggle('up', 'down')

    rb.setKeyboardDelay(100)
    rb.keyTap('alt')
    rb.keyTap('alt')
    rb.setKeyboardDelay(10)
    rb.keyToggle('up', 'up')
    rb.setKeyboardDelay(delay)
    rb.keyTap('d')
    rb.setKeyboardDelay(10)
    return
  }
}
function hop() {
  rb.setKeyboardDelay(50)
  rb.keyTap('d')
  rb.setKeyboardDelay(10)
  rb.keyTap('w')
}

async function anotherGo() {
  // attack()
  // attackThrough({ direction: 'left', times: 9, goBack: true })
  // goUp({ delay: 1000 })
  // hop()

  attackThrough({ direction: 'right', times: 5, goBack: true })
  attackThrough({ direction: 'left', times: 5, goBack: true })
  attackThrough({ direction: 'right', times: 5, goBack: true })
  attackThrough({ direction: 'left', times: 5, goBack: true })
}

export { replayStar, go, anotherGo }
