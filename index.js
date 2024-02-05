import { pressEnter, pressUp } from './utils/keyboard-action.js'

function start() {
  console.log('hello world')

  for (let index = 0; index < 3; index++) {
    pressEnter()
    pressUp()
  }
}

start()
