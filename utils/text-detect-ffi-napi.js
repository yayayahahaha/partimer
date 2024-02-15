const ffi = require('ffi-napi')

// 載入 user32.dll 和 gdi32.dll 函數庫
const user32 = new ffi.Library('user32', {
  GetDC: ['int', ['int']],
  ReleaseDC: ['int', ['int', 'int']],
  TextOutA: ['bool', ['int', 'int', 'string', 'int']],
})

// 定義函數：檢查指定區域是否包含特定文字
function checkTextInRegion(left, top, right, bottom, text) {
  const hdc = user32.GetDC(0) // 獲取螢幕的設備內容
  const buffer = Buffer.alloc(text.length + 1, 0)
  buffer.write(text, 0, 'ascii')

  const result = user32.TextOutA(hdc, left, top, buffer, text.length) // 在指定區域輸出文字
  user32.ReleaseDC(0, hdc) // 釋放設備內容

  return result
}

// 調用函數進行文字檢測
const left = 100 // 指定區域的左上角 x 座標
const top = 100 // 指定區域的左上角 y 座標
const right = 200 // 指定區域的右下角 x 座標
const bottom = 200 // 指定區域的右下角 y 座標
const searchText = '蘋果' // 指定要搜尋的文字

const result = checkTextInRegion(left, top, right, bottom, searchText)
console.log('Is text present in the specified region?', result)
