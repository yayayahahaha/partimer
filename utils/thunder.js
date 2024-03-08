import rb from 'robotjs'

const attackList = [
  {
    code: 'g',
    vkCode: 'VK_G',
    coldTime: 9 * 1000,
    previousTimestamp: Date.now() + 5000,
  },
  {
    code: 'a',
    vkCode: 'VK_A',
    coldTime: 13 * 1000,
    previousTimestamp: Date.now() + 5000,
  },
  {
    code: 'y',
    vkCode: 'VK_Y',
    coldTime: 46 * 1000,
    previousTimestamp: Date.now() + 5000,
  },
]
const buffList = [
  {
    code: '2',
    vkCode: 'VK_2',
    coldTime: 123 * 1000,
    previousTimestamp: 0,
  },
  {
    code: '3',
    vkCode: 'VK_3',
    coldTime: 123 * 1000,
    previousTimestamp: 0,
  },
  {
    code: '4',
    vkCode: 'VK_4',
    coldTime: 243 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'home',
    vkCode: 'VK_HOME',
    coldTime: 183 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'end',
    vkCode: 'VK_END',
    coldTime: 123 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'pagedown',
    vkCode: 'VK_NEXT',
    coldTime: 63 * 1000,
    previousTimestamp: 0,
  },
  {
    code: 'delete',
    vkCode: 'VK_DELETE',
    coldTime: 33 * 1000,
    previousTimestamp: 0,
  },
  /*  {
    code: 'h',
    vkCode: 'VK_h',
    coldTime: 363 * 1000,
    previousTimestamp: 0,
  },*/
]
async function attack({ afterDelay = 10 } = {}) {
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

  rb.setKeyboardDelay(afterDelay)
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

function attackThrough({ times = 5, direction = null, goBack = false, moveFirst = true, afterDelay = 100 } = {}) {
  if (moveFirst) turn(direction)

  if (!goBack) {
    for (let i = 0; i < times - 1; i++) {
      attack()
    }
    attack({ afterDelay })
    return
  }

  if (Math.random() > 0.5) _endAndTurn()
  else _halfAndTurn()

  function _endAndTurn() {
    const turnStep = Math.ceil(Math.random() * Math.ceil(times / 2))
    for (let i = 0; i < times - 1; i++) {
      attack()
    }
    attack({ afterDelay })

    direction === 'left' ? turn('right') : turn('left')

    for (let i = 0; i < turnStep - 1; i++) {
      attack()
    }
    attack({ afterDelay })

    turn(direction)

    for (let i = 0; i < turnStep - 1; i++) {
      attack()
    }
    attack({ afterDelay })
  }

  function _halfAndTurn() {
    const halfStep = Math.ceil(times / 2)
    const halfhalfStep = Math.ceil(halfStep / 2)

    for (let i = 0; i < halfhalfStep - 1; i++) {
      attack()
    }
    attack({ afterDelay })

    direction === 'left' ? turn('right') : turn('left')

    for (let i = 0; i < halfhalfStep - 1; i++) {
      attack()
    }
    attack({ afterDelay })

    turn(direction)

    for (let i = 0; i < times - halfStep + halfhalfStep; i++) {
      attack()
    }
    attack({ afterDelay })
  }
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
  rb.setKeyboardDelay(300)
  rb.keyTap('w')
  rb.setKeyboardDelay(10)
}

// TODO 檢查顏色的部分
// 1. 輪
// 2. 其他玩家
// 3. 自己本身的位子是不是跑到最下面了
export async function anotherGo() {
  let stuffList = createStuffList()
  let toFn = (f) => f

  for (let i = 0; i < 100; i++) {
    horizonMove()

    if (stuffList.length === 0) stuffList = createStuffList()
    toFn = stuffList.splice(0, 1)[0]
    toFn()

    console.log('stuffList:', stuffList)
  }

  function horizonMove() {
    const times = Math.ceil(Math.random() * 4)
    console.log(`horizonMove times: ${times}`)
    for (let i = 0; i < times; i++) {
      attackThrough({ direction: 'right', times: 5, goBack: Math.random() > 0.5 })
      buffStuff()
      attackThrough({ direction: 'left', times: 5, goBack: Math.random() > 0.5 })
      buffStuff()

      console.log(`還有 ${times - i - 1} 趟`)
    }
  }

  function createStuffList() {
    return [upStuff, rightStuff, leftStuff].sort(() => Math.random() - 0.5)
  }
  function upStuff() {
    goUp()
    attackThrough({ direction: 'right', times: 2, goBack: false })
    attackThrough({ direction: 'left', times: 3, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'right', times: 4, goBack: Math.random() > 0.5 })
    goDown()

    buffStuff()

    attackThrough({ direction: 'right', times: 1, goBack: false, moveFirst: false })
    attackThrough({ direction: 'left', times: 2, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'right', times: 3, goBack: Math.random() > 0.5 })
    goDown()

    attackThrough({ direction: 'right', times: 2, goBack: false, moveFirst: false })
    attackThrough({ direction: 'left', times: 5, goBack: Math.random() > 0.5 })
  }
  function rightStuff() {
    attackThrough({ direction: 'right', times: 5, goBack: Math.random() > 0.5, afterDelay: 200 })
    hop()

    buffStuff()

    attackThrough({ direction: 'right', times: 2, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'left', times: 3, goBack: Math.random() > 0.5, afterDelay: 200 })
    hop()

    attackThrough({ direction: 'left', times: 5, goBack: Math.random() > 0.5 })
  }
  function leftStuff() {
    attackThrough({ direction: 'right', times: 3, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'left', times: 4, goBack: Math.random() > 0.5, afterDelay: 200 })
    hop()

    buffStuff()

    attackThrough({ direction: 'left', times: 2, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'right', times: 3, goBack: Math.random() > 0.5, afterDelay: 200 })
    hop()

    attackThrough({ direction: 'right', times: 5, goBack: Math.random() > 0.5 })
    attackThrough({ direction: 'left', times: 5, goBack: Math.random() > 0.5 })
  }
  function buffStuff() {
    const current = Date.now()

    // 一次放幾個技能
    let buffCount = 2

    const list = buffList.slice().sort(() => Math.random() - 0.5)

    for (let i = 0; i < list.length; i++) {
      const buff = list[i]
      if (buff.previousTimestamp + buff.coldTime < current) {
        rb.setKeyboardDelay(1000 + Math.floor(Math.random() * 200))
        rb.keyTap(buff.code)

        console.log(`buff: ${buff.code}`)

        // 隨機讓他更久一些
        buff.previousTimestamp = Date.now() - Math.round(Math.random() * 2000)

        buffCount--

        if (buffCount === 0) break
      }
    }
    rb.setKeyboardDelay(10)
  }
}
