import { keyboardAction } from './keyboard-control.js'

// 按下 Enter 鍵
function pressEnter() {
  // keyboardAction('VK_RETURN', 'click')
  keyboardAction(0x0d, 'click')
}

const keyValueMap = {
  VK_RETURN: 0x0d,
  // VK_LMENU: 0xa4, // left alt

  VK_LMENU: 0x12,

  VK_UP: 0x26,
  VK_LEFT: 0x25,
  VK_RIGHT: 0x27,
  VK_DOWN: 0x28,
}
function pressAction(keyCode, behavior) {
  if (keyValueMap[keyCode] == null) {
    console.log('這個 keyCode 還沒有 mapping 到!', keyCode)
    return null
  }

  keyboardAction(keyValueMap[keyCode], behavior.toLowerCase())
}

export { pressEnter, pressAction }
