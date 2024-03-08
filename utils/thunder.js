import rb from 'robotjs'

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
function goUp({ delay = 500 } = {}) {
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
}
function goDown({ delay = 300 } = {}) {
  rb.setKeyboardDelay(50)
  rb.keyToggle('down', 'down')
  rb.setKeyboardDelay(10)
  rb.keyTap('alt')
  rb.setKeyboardDelay(delay)
  rb.keyToggle('down', 'up')
  rb.setKeyboardDelay(10)
}
function hop() {
  rb.setKeyboardDelay(50)
  rb.keyTap('d')
  rb.setKeyboardDelay(10)
  rb.keyTap('w')
}
export async function anotherGo() {
  // attack()
  // attackThrough({ direction: 'left', times: 9, goBack: true })
  // goUp({ delay: 1000 })
  // goDown()
  // hop()
  // attackThrough({ direction: 'right', times: 5, goBack: true })
  // attackThrough({ direction: 'left', times: 5, goBack: true })
  // attackThrough({ direction: 'right', times: 5, goBack: true })
  // attackThrough({ direction: 'left', times: 5, goBack: true })
}
