import { keyboardAction } from './keyboard-control.js'

// TODO 這裡的 key 都是錯的，要改成對的

// 按下 Enter 鍵
function pressEnter() {
  // keyboardAction('VK_RETURN', 'click')
  keyboardAction(0x0d, 'click')
}

// 按下 Alt 鍵
function pressAlt() {
  keyboardAction('VK_MENU', 'click')
}

// 按下上箭頭鍵
function pressUp() {
  keyboardAction('VK_UP', 'click')
}

// 按下左箭頭鍵
function pressLeft() {
  keyboardAction('VK_LEFT', 'click')
}

// 按下右箭頭鍵
function pressRight() {
  keyboardAction('VK_RIGHT', 'click')
}

// 按下下箭頭鍵
function pressDown() {
  keyboardAction('VK_DOWN', 'click')
}

export { pressEnter, pressAlt, pressUp, pressLeft, pressRight, pressDown }
