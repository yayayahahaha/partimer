import ffi from 'ffi-napi'

const user32 = new ffi.Library('user32', {
  keybd_event: ['void', ['uint8', 'uint8', 'uint32', 'uint32']],
})

function keyboardAction(keyCode, action) {
  const KEYEVENTF_EXTENDEDKEY = 0x0001
  const KEYEVENTF_KEYUP = 0x0002

  let key = keyCode
  console.log(key)
  if (action === 'click') {
    user32.keybd_event(key, 0, KEYEVENTF_EXTENDEDKEY, 0)
    user32.keybd_event(key, 0, KEYEVENTF_KEYUP, 0)
  } else if (action === 'down') {
    user32.keybd_event(key, 0, KEYEVENTF_EXTENDEDKEY, 0)
  } else if (action === 'up') {
    user32.keybd_event(key, 0, KEYEVENTF_KEYUP, 0)
  }
}

export { keyboardAction }
