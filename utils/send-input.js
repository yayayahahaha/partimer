import ref from 'ref-napi'
import ffi from 'ffi-napi'

// 定義 Windows API 中的一些函數
const user32 = ffi.Library('user32', {
  SendInput: ['int', ['int', 'pointer', 'int']],
})

// 定義常數
const INPUT_KEYBOARD = 1
const KEYEVENTF_KEYDOWN = 0x0000
const KEYEVENTF_KEYUP = 0x0002

// 定義 INPUT 和 KEYBDINPUT 結構體
const INPUT = ref.types.Struct({
  type: ref.types.uint32,
  ki: ref.refType(ref.types.void),
})

const KEYBDINPUT = ref.types.Struct({
  wVk: ref.types.uint16,
  wScan: ref.types.uint16,
  dwFlags: ref.types.uint32,
  time: ref.types.uint32,
  dwExtraInfo: ref.types.pointer,
})

// 定義一個函數來發送鍵盤輸入
function sendKeyboardInput(keyCode, keyDown) {
  const input = new INPUT()
  const keybdInput = new KEYBDINPUT()

  input.type = INPUT_KEYBOARD
  keybdInput.wVk = keyCode
  keybdInput.dwFlags = keyDown ? KEYEVENTF_KEYDOWN : KEYEVENTF_KEYUP

  input.ki = keybdInput.ref()

  // 創建 INPUT 實例的指針
  const pInput = ref.alloc(INPUT, input)

  // 發送輸入
  user32.SendInput(1, pInput, INPUT.size)
}

// 模擬按下 'A' 鍵
sendKeyboardInput(0x41, true)

// 模擬放開 'A' 鍵
sendKeyboardInput(0x41, false)
