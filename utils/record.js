import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'

const v = new GlobalKeyboardListener()

function start() {
  const things = []

  //Log every key that's pressed.
  const globalListener = function (e, down /* 當前按壓著的案件 map */) {
    console.log(`${e.name}, ${e.state == 'DOWN' ? 'DOWN' : 'UP  '}, [${e.rawKey._nameRaw}]`)

    if (e.name === 'ESCAPE') return void shutdown()

    const {
      name,
      state,
      rawKey: { _nameRaw: nameRaw },
    } = e
    things.push({
      name,
      state,
      nameRaw,
      timestamp: Date.now(),
    })
  }
  v.addListener(globalListener)

  function shutdown() {
    v.removeListener(globalListener)

    console.log("all these things that Iv'e done: ", things)
    const miniTimestamp = Math.min(...things.map((thing) => thing.timestamp))
    for (let index = 0; index < things.length; index++) {
      const thing = things[index]

      thing.timestamp -= miniTimestamp

      // 避免重複按壓造成多次記錄一樣的事件
      let nextItem = things[index + 1]
      while (nextItem != null) {
        if (nextItem.state === thing.state && nextItem.rawKey === thing.rawKey) {
          things.splice(index + 1, 1)
        } else break
        nextItem = things[index + 1]
      }
    }

    fs.writeFileSync('./result.json', JSON.stringify(things, null, 2))
  }
}

start()
