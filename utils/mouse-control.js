import ffi from 'ffi-napi'

const user32 = new ffi.Library('user32', {
  SetCursorPos: ['bool', ['int', 'int']],
  GetCursorPos: ['bool', ['pointer']],
  mouse_event: ['void', ['uint32', 'uint32', 'int32', 'int32', 'uint32']],
})

function moveMouse(x, y) {
  user32.SetCursorPos(x, y)
}

function clickMouse() {
  const MOUSEEVENTF_LEFTDOWN = 0x02
  const MOUSEEVENTF_LEFTUP = 0x04
  user32.mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
  user32.mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
}

export { moveMouse, clickMouse }
