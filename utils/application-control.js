const ffi = require('ffi-napi')

// 定義 Windows API 函數
const user32 = ffi.Library('user32', {
  EnumWindows: ['bool', ['pointer', 'int32']],
  GetWindowTextA: ['int', ['long', 'string', 'int']],
  IsWindowVisible: ['bool', ['long']],
})

// 定義 JavaScript 回調函數，用於處理 EnumWindows 的結果
const EnumWindowsProc = ffi.Callback('bool', ['long', 'long'], function (hwnd, lParam) {
  const buffer = Buffer.alloc(255)
  if (user32.IsWindowVisible(hwnd)) {
    user32.GetWindowTextA(hwnd, buffer, 255)
    const title = buffer.toString('utf8')
    if (title.length > 0) {
      console.log('Window Title:', title)
    }
  }
  return true
})

// 調用 EnumWindows 函數，並將回調函數傳遞給它
user32.EnumWindows(EnumWindowsProc, 0)
