import { GlobalKeyboardListener } from 'node-global-key-listener'
const v = new GlobalKeyboardListener()

function start() {
  //Log every key that's pressed.
  const globalListener = function (e, down) {
    console.log(`${e.name}, ${e.state == 'DOWN' ? 'DOWN' : 'UP  '}, [${e.rawKey._nameRaw}]`)
    console.log('down: ', down)
    console.log()
  }
  v.addListener(globalListener)
  // v.removeListener(globalListener)
}

start()
