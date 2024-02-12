import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import { beforeStart } from './others.js'
import path from 'path'
import { pressAction } from './keyboard-action.js'

const v = new GlobalKeyboardListener()

async function start() {
  await beforeStart(3)

  // 讀取歷程檔案
  const fileName = './behavior/result.json'
  const file = fs.readFileSync(path.resolve(fileName), 'utf8')
  const steps = JSON.parse(file)

  // 用於中斷的時候清除 timeout
  const timeoutList = []

  let finishedCount = 0

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]
    const timer = setTimeout(() => {
      console.log(step)
      pressAction(step.nameRaw, step.state)
      finishedCount++

      if (finishedCount === steps.length) v.removeListener(listener)
    }, step.timestamp)

    // for remove
    timeoutList.push(timer)
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
