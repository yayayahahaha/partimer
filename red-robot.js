import { beforeStart } from './utils/others.js'
import { redRobot } from './utils/thunder.js'

async function startRedRobot() {
  await beforeStart(3)

  redRobot()
}
startRedRobot()
