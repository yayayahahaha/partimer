import rb from 'robotjs'
import { GlobalKeyboardListener } from 'node-global-key-listener'
const keyboardListener = new GlobalKeyboardListener()
import { keyboardAction } from './keyboard-control.js'

const nDefault = 2
let nCount = 2
let isPause = false

export function listenerStuff() {
  const globalListener = function (e, down /* 當前按壓著的案件 map */) {
    // console.log(`${e.name}, ${e.state == 'DOWN' ? 'DOWN' : 'UP  '}, [${e.rawKey._nameRaw}]`)

    console.log(nCount)

    if (e.name === 'N') {
      if (e.state == 'DOWN') nCount--
    } else nCount = nDefault

    if (nCount === 0) {
      if (isPause) {
        keyboardListener.removeListener(globalListener)

        anotherGo()
        isPause = false
      } else isPause = true
    }
  }
  keyboardListener.addListener(globalListener)
}

const attackList = [
  {
    code: 'g',
    vkCode: 'VK_G',
    coldTime: 9 * 1000,
    delayTime: 100,
    previousTimestamp: Date.now() + 5000,
  },
  {
    code: 'a',
    vkCode: 'VK_A',
    coldTime: 13 * 1000,
    delayTime: 75,
    previousTimestamp: Date.now() + 5000,
  },
  {
    code: 'y',
    vkCode: 'VK_Y',
    coldTime: 46 * 1000,
    delayTime: 75,
    previousTimestamp: Date.now() + 5000,
  },
]
const buffBetweenEach = {
  coldTime: 3 * 1000,
  previousTimestamp: 0,
}
const buffList = [
  {
    code: '2',
    vkCode: 'VK_2',
    coldTime: 123 * 1000,
    priority: false,
    previousTimestamp: Date.now() + 123,
  },
  {
    code: '3',
    vkCode: 'VK_3',
    coldTime: 123 * 1000,
    priority: true,
    previousTimestamp: Date.now(),
  },
  {
    code: '4',
    vkCode: 'VK_4',
    coldTime: 243 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: 'home',
    vkCode: 'VK_HOME',
    coldTime: 183 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: 'end',
    vkCode: 'VK_END',
    coldTime: 123 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: 'pagedown',
    vkCode: 'VK_NEXT',
    coldTime: 63 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: 'delete',
    vkCode: 'VK_DELETE',
    coldTime: 45 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: '6',
    vkCode: 'VK_6',
    coldTime: 500 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  {
    code: 'n',
    vkCode: 'VK_n',
    coldTime: 255 * 1000,
    priority: false,
    previousTimestamp: Date.now(),
  },
  /*  {
    code: 'h',
    vkCode: 'VK_h',
    coldTime: 363 * 1000,
    previousTimestamp: Date.now() + 363,
  },*/
]
function buffStuff(test = false) {
  const current = Date.now()

  // 兩次檢查太近的話直接跳掉
  if (buffBetweenEach.previousTimestamp + buffBetweenEach.coldTime > current) return

  // 一次放幾個技能: 1 ~ 2
  let buffCount = randomNumber(2)
  // test && console.log('buffCount:', buffCount)

  // 有 priority 的放前面
  const list = buffList
    .slice()
    .sort(() => Math.random() - 0.5)
    .sort((a) => (a.priority ? -1 : 1))

  test && console.log('buff list: ', JSON.stringify(list.map((item) => item.code)))
  for (let i = 0; i < list.length; i++) {
    const buff = list[i]
    if (buff.previousTimestamp + buff.coldTime < current) {
      // TODO sleep function
      ;(function sleep() {
        rb.setKeyboardDelay(randomNumber(200, 100))
        rb.keyTap('7') // 這個按鍵目前沒有綁定任何功能
        rb.setKeyboardDelay(10)
      })()

      // each between part
      buffBetweenEach.previousTimestamp = Date.now() + randomNumber(4000, 0)

      // buff part
      rb.setKeyboardDelay(randomNumber(1200, 1000))
      rb.keyTap(buff.code)

      test && console.log(`buff: ${buff.code}`)

      // 隨機讓他更久一些
      buff.previousTimestamp = Date.now() + randomNumber(2000, 1000)

      buffCount--

      if (buffCount === 0) break
    }
  }
  rb.setKeyboardDelay(10)
}

let doBuff = true
async function attack({ afterDelay = null } = {}) {
  if (isPause) throw 'pause'

  // 攻擊前放 buff
  doBuff && buffStuff()

  // 雖然已經很近了，但每個技能還是多少有一些時間差
  // 不設定這個的話霹靂可以更快，但位置會跑掉
  // 或許可以設定每個技能有不同的 delay
  rb.setKeyboardDelay(randomNumber(120, 100))

  let alreayAttack = false
  const current = Date.now()
  for (let i = 0; i < attackList.length; i++) {
    const attack = attackList[i]
    if (attack.previousTimestamp + attack.coldTime < current) {
      alreayAttack = true
      rb.keyTap(attack.code)

      // 隨機讓他更久一些
      attack.previousTimestamp = Date.now() + randomNumber(2000, 1000)
    }
  }

  const waveDelay = alreayAttack ? afterDelay || attack.delayTime : 100
  if (!alreayAttack) _defaultAttack()

  rb.setKeyboardDelay(waveDelay)
  rb.keyTap('f')
  rb.setKeyboardDelay(10)

  function _defaultAttack() {
    rb.keyTap('v')
  }
}

function attackThrough({ times = 5, direction = 'left', goBack = false, moveFirst = true, afterDelay = 100 } = {}) {
  if (moveFirst) turn(direction)

  if (!goBack) {
    for (let i = 0; i < times - 1; i++) {
      attack()
    }
    attack({ afterDelay })
    return
  }

  if (halfChance()) _endAndTurn()
  else _halfAndTurn()

  function _endAndTurn() {
    const turnStep = randomNumber(Math.ceil(times / 2))
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
  rb.setKeyboardDelay(randomNumber(70, 50))
  rb.keyToggle(direction, 'down')
  rb.keyToggle(direction, 'up')
  rb.setKeyboardDelay(10)
}
function goUp({ type = 'top' } = {}) {
  rb.setKeyboardDelay(randomNumber(130, 100))
  rb.keyToggle('up', 'down')

  rb.setKeyboardDelay(randomNumber(130, 100))
  rb.keyTap('alt')
  rb.keyTap('alt')
  rb.setKeyboardDelay(10)
  rb.keyToggle('up', 'up')
  rb.setKeyboardDelay(randomNumber(530, 500))
  type === 'top' && rb.keyTap('d')
  rb.setKeyboardDelay(10)
}
function goDown({ delay = 500 } = {}) {
  rb.setKeyboardDelay(randomNumber(60, 50))
  rb.keyToggle('down', 'down')
  rb.setKeyboardDelay(10)
  rb.keyTap('alt')
  rb.setKeyboardDelay(randomNumber(delay + 20, delay))
  rb.keyToggle('down', 'up')
  rb.setKeyboardDelay(10)
}
function hop() {
  rb.setKeyboardDelay(60)
  rb.keyTap('d')
  rb.setKeyboardDelay(randomNumber(310, 300))
  rb.keyTap('w')
  rb.setKeyboardDelay(10)
}
export function jumpForward() {
  rb.setKeyboardDelay(150)
  rb.keyTap('alt')
  rb.keyTap('alt')
  rb.setKeyboardDelay(10)
}
function halfChance() {
  return Math.random() > 0.5
}
function randomNumber(max = 10, min = 1) {
  if (max < min) console.log('[randomNumber] max is smaller than min!', max, min)

  return Math.floor(Math.random() * (max - min + 1)) + min
}

let previousMoveTimes = 0

// TODO 檢查顏色的部分
// 1. 輪
// 2. 其他玩家
// 3. 自己本身的位子是不是跑到最下面了
// 4. 不透過 ctrl + tab 就可以暫停的方式
export async function anotherGo() {
  // TODO 在 robot 在跑的時候，這個 listenerStuff 就不會作用了
  // 可能要改成判斷螢幕上的東西來做停止? 像是地名之類的
  // listenerStuff()

  let stuffList = createStuffList()
  let toFn = (f) => f

  let roundList = createRoundList()
  let roundFn = (f) => f

  halfChance() && horizonMove()
  for (let i = 0; i < 100; i++) {
    if (i % 5 === 0 || i % randomNumber(3, 2) === 0) checkAround()

    checkStuff()

    horizonMove()
  }

  function checkStuff() {
    if (stuffList.length === 0) stuffList = createStuffList()
    console.log('stuffList:', stuffList)
    toFn = stuffList.splice(0, 1)[0]
    toFn()
  }

  function checkAround() {
    if (roundList.length === 0) roundList = createRoundList()
    console.log('roundList:', roundList)
    roundFn = roundList.splice(0, 1)[0]
    roundFn()
  }

  function horizonMove(test = false) {
    const moveTimes = randomNumber(previousMoveTimes !== 3 ? 3 : 1)
    const times = randomNumber(6, 4)

    previousMoveTimes = moveTimes

    console.log('horizonMove: ', moveTimes, times)

    test && console.log(`horizonMove moveTimes: ${moveTimes}`)
    for (let i = 0; i < moveTimes; i++) {
      attackThrough({ direction: 'right', times, goBack: halfChance() })
      attackThrough({ direction: 'left', times, goBack: halfChance() })

      test && console.log(`還有 ${moveTimes - i - 1} 趟`)
    }
  }

  function createStuffList() {
    return [upStuff, rightStuff, leftStuff].sort(() => Math.random() - 0.5)
  }
  function createRoundList() {
    const r1 = () => around(1)
    const r2 = () => around(2)
    return [r1, r2, r1, r2].sort(() => Math.random() - 0.5)
  }

  function upStuff(way = randomNumber(2)) {
    console.log('upStuff: ', way)
    switch (way) {
      case 1:
        return _upStuff1()

      case 2:
      default:
        return _upStuff2()
    }

    function _upStuff1() {
      goUp()
      attackThrough({ direction: 'right', times: 2, goBack: false })
      attackThrough({ direction: 'left', times: 2, goBack: halfChance() })
      attackThrough({ direction: 'right', times: 3, goBack: halfChance() })
      goDown()

      attackThrough({ direction: 'right', times: 1, goBack: false, moveFirst: false })
      attackThrough({ direction: 'left', times: 2, goBack: halfChance() })
      attackThrough({ direction: 'right', times: 3, goBack: halfChance() })
      goDown()

      attackThrough({ direction: 'right', times: 1, goBack: false, moveFirst: false })
      attackThrough({ direction: 'left', times: 5, goBack: halfChance() })
    }

    function _upStuff2() {
      attackThrough({ direction: 'right', times: 2, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 3, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 1, goBack: false, moveFirst: false })
      attackThrough({ direction: 'right', times: 2, goBack: false })
      goUp()

      attackThrough({ direction: 'right', times: 3, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 3, goBack: false })
      goDown()

      attackThrough({ direction: 'left', times: 1, goBack: false })
      attackThrough({ direction: 'right', times: 3, goBack: false })
      goDown()
    }
  }
  function rightStuff(way = randomNumber(2)) {
    console.log('rightStuff: ', way)
    switch (way) {
      case 1:
        return _rightStuff1()
      case 2:
      default:
        return _rightStuff2()
    }

    function _rightStuff1() {
      attackThrough({ direction: 'right', times: 6, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 3, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 5, goBack: halfChance() })
    }

    function _rightStuff2() {
      attackThrough({ direction: 'right', times: 2, goBack: false })
      attackThrough({ direction: 'left', times: 3, goBack: false })
      goUp()

      attackThrough({ direction: 'right', times: 2, goBack: false })
      goDown()

      attackThrough({ direction: 'left', times: 2, goBack: halfChance() })
      attackThrough({ direction: 'right', times: 3, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 3, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 3, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 2, goBack: false })
      goDown()

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false })
    }
  }
  function leftStuff(way = randomNumber(2)) {
    console.log('leftStuff: ', way)
    switch (way) {
      case 1:
        return _leftStuff1()

      case 2:
      default:
        return _leftStuff2()
    }

    function _leftStuff1() {
      attackThrough({ direction: 'right', times: 3, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 5, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 1, goBack: false, moveFirst: false })
      attackThrough({ direction: 'right', times: 2, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 5, goBack: halfChance() })
      attackThrough({ direction: 'left', times: 5, goBack: halfChance() })
    }

    function _leftStuff2() {
      attackThrough({ direction: 'right', times: 5, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), moveFirst: false })
      goUp({ type: 'jump' })

      attackThrough({ direction: 'left', times: 4, goBack: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 1, goBack: false, moveFirst: false })
      attackThrough({ direction: 'right', times: 2, goBack: false })

      goDown()
    }
  }
  function around(way = randomNumber(3)) {
    console.log('around: ', way)
    switch (way) {
      case 1:
        return _aroundStuff1()
      case 2:
      default:
        return _aroundStuff2()
    }

    function _aroundStuff1() {
      attackThrough({ direction: 'right', times: 4, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), moveFirst: false })
      goUp({ type: 'jump' })

      attackThrough({ direction: 'left', times: 3, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
      attackThrough({ direction: 'right', times: 2, goBack: halfChance() })
      goUp({ type: 'jump' })

      attackThrough({ direction: 'left', times: 2, goBack: halfChance(), afterDelay: 200 })
      attackThrough({ direction: 'right', times: 3, goBack: halfChance(), afterDelay: 200 })
      goDown()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), afterDelay: 200 })
      goDown()

      attackThrough({ direction: 'left', times: 3, goBack: halfChance(), afterDelay: 200 })
    }

    function _aroundStuff2() {
      attackThrough({ direction: 'right', times: 3, goBack: halfChance(), afterDelay: 200 })
      attackThrough({ direction: 'left', times: 4, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), afterDelay: 200 })
      goUp({ type: 'jump' })

      attackThrough({ direction: 'right', times: 1, goBack: false, moveFirst: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), moveFirst: false, afterDelay: 200 })
      hop()

      attackThrough({ direction: 'right', times: 3, goBack: halfChance(), moveFirst: false, afterDelay: 200 })
      attackThrough({ direction: 'left', times: 3, goBack: halfChance(), afterDelay: 200 })
      hop()

      attackThrough({ direction: 'left', times: 1, goBack: false, moveFirst: false, afterDelay: 200 })
      goUp({ type: 'jump' })

      attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
      goDown()

      attackThrough({ direction: 'right', times: 2, goBack: halfChance(), afterDelay: 200 })
      goDown()
    }
  }
}

export async function tears() {
  doBuff = false

  for (let i = 0; i < 100; i++) {
    // tearsRound()
    tearsRound2()
  }

  function tearsRound2() {
    attackThrough({ direction: 'left', times: 1, goBack: false })
    // goUp({ type: 'jump' })
    for (let i = 0; i < 12; i++) {
      hop()
    }
    attackThrough({ direction: 'right', times: 15, goBack: false })
  }

  function tearsRound() {
    attackThrough({ direction: 'left', times: 7, goBack: false, afterDelay: 200 })
    hop()
    goDown()
    attackThrough({ direction: 'left', times: 1, goBack: false, moveFirst: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'left', times: 2, goBack: false, moveFirst: false })

    attackThrough({ direction: 'right', times: 2, goBack: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'right', times: 2, goBack: false, moveFirst: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'right', times: 7, goBack: false })
  }
}

export async function bridge() {
  for (let i = 0; i < 100; i++) {
    bridgeRound()
  }

  function bridgeRound() {
    attackThrough({ direction: 'right', times: randomNumber(5, 4), goBack: true })
    attackThrough({ direction: 'left', times: randomNumber(5, 4), goBack: true })

    attackThrough({ direction: 'right', times: 2, goBack: false })
    goUp({ type: 'jump' })
    attackThrough({ direction: 'right', times: 3, goBack: false, moveFirst: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'right', times: 3, goBack: false, moveFirst: false, afterDelay: 200 })
    attackThrough({ direction: 'left', times: 3, goBack: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'left', times: 3, goBack: false, moveFirst: false, afterDelay: 200 })
    hop()
    attackThrough({ direction: 'left', times: 3, goBack: false, moveFirst: false, afterDelay: 200 })
    goDown()
    attackThrough({ direction: 'right', times: 10, goBack: true, afterDelay: 200 })
    attackThrough({ direction: 'left', times: 4, goBack: false, afterDelay: 200 })
    goUp()
    attackThrough({ direction: 'left', times: 2, goBack: false, afterDelay: 200 })
    goDown()
    attackThrough({ direction: 'left', times: 1, goBack: false, afterDelay: 200 })
  }
}

function left(times, goBack = halfChance()) {
  return attackThrough({ direction: 'left', times, goBack })
}
function right(times, goBack = halfChance()) {
  return attackThrough({ direction: 'right', times, goBack })
}
function justAttack(times) {
  return attackThrough({ moveFirst: false, times, goBack: false })
}

function delay(msec = 200) {
  rb.setKeyboardDelay(msec)
  rb.keyTap('7')
  rb.setKeyboardDelay(10)
}

