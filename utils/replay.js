import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import { beforeStart } from './others.js'
import ffi from 'ffi-napi'
import path from 'path'

const v = new GlobalKeyboardListener()

async function start() {
  await beforeStart(3)

  const fileName = './behavior/result.json'

  const file = fs.readFileSync(path.resolve(fileName), 'utf8')
  const steps = JSON.parse(file)
  let finishedCount = 0

  const timeoutList = []
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    timeoutList.push(
      setTimeout(() => {
        console.log(step)
        finishedCount++

        if (finishedCount === steps.length) v.removeListener(listener)
      }, step.timestamp)
    )
  }

  function listener(event) {
    // 按下 esc 的時候終止
    if (event.name === 'ESCAPE') {
      timeoutList.forEach((timer) => clearTimeout(timer))
      console.log('Dinner time!')

      v.removeListener(listener)
    }
  }
  v.addListener(listener)
}

start()
