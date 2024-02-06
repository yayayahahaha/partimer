const ffi = require('ffi-napi')

// 載入 user32.dll 函數庫
const user32 = new ffi.Library('user32', {
  SetWindowsHookExA: ['pointer', ['int', 'pointer', 'pointer', 'int']],
  CallNextHookEx: ['int', ['pointer', 'int', 'int', 'int']],
  UnhookWindowsHookEx: ['int', ['pointer']],
  GetAsyncKeyState: ['short', ['int']],
})

// 定義常數
const WH_KEYBOARD_LL = 13
const WM_KEYDOWN = 0x0100
const VK_ESCAPE = 0x1b

// 設置鍵盤勾子回調函數
const keyboardHookCallback = ffi.Callback('int', ['int', 'int', 'int', 'int'], (nCode, wParam, lParam) => {
  if (nCode >= 0 && wParam === WM_KEYDOWN) {
    const keyCode = lParam.readInt32LE()
    if (keyCode === VK_ESCAPE) {
      console.log('User pressed the Escape key. Stopping the program.')
      // 在這裡進行相應的停止程式的操作
      // 停止程式的程式碼可以放在這裡
      // 例如，設置一個標誌，讓你的主迴圈停止執行
      // 或者執行一個退出程序的函數等等
    }
  }
  return user32.CallNextHookEx(null, nCode, wParam, lParam)
})

// 安裝鍵盤勾子
const keyboardHook = user32.SetWindowsHookExA(WH_KEYBOARD_LL, keyboardHookCallback, null, 0)

// 設置主迴圈（假設你有一個主要的迴圈來控制電腦）
// 這裡可以是你的程式的主要邏輯
// 如果你接收到了停止程式的標誌，就可以退出迴圈
// 例如，你可以檢查一個標誌，讓程式在收到該標誌時停止執行

// 你的主要迴圈代碼

// 等待用戶停止程式（例如，按下 Escape 鍵）
// 這裡你可以設置一個條件，使得當你的程式接收到了停止程式的指示時，就退出迴圈

// 移除鍵盤勾子
user32.UnhookWindowsHookEx(keyboardHook)
