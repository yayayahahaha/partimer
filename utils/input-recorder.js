const inputRecorder = require('./inputRecorder')

// 模擬滑鼠點擊
function clickMouse() {
  inputRecorder.recordAction('mouse', { event: 'click' })
}

// 模擬滑鼠放開
function releaseMouse() {
  inputRecorder.recordAction('mouse', { event: 'release' })
}

module.exports = {
  clickMouse,
  releaseMouse,
}
