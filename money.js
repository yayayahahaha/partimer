import { MARKET_NO_MORE_STATUS, money } from './utils/money-utils.js'
import { beforeStart, marketAndExtract } from './utils/others.js'

function start() {
  beforeStart(3)
  money()
}
start()
