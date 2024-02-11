import { GlobalKeyboardListener } from 'node-global-key-listener'
import fs from 'fs'
import { beforeStart } from './others.js'

const v = new GlobalKeyboardListener()

async function start() {
  await beforeStart(5)

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

    // console.log("all these things that Iv'e done: ", things)
    fs.writeFileSync('./result-origin.json', JSON.stringify(things, null, 2))
    const minTimestamp = Math.min(...things.map((thing) => thing.timestamp))
    for (let i = 0; i < things.length; i++) {
      const current = things[i]
      current.timestamp -= minTimestamp
      let next = things[i + 1]
      while (next != null) {
        if (next.state === current.state && next.nameRaw === current.nameRaw) {
          things.splice(i + 1, 1)
        } else break
        next = things[i + 1]
      }
    }
    console.log(things)

    fs.writeFileSync('./result.json', JSON.stringify(things, null, 2))
  }
}

start()
