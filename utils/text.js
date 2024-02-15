import robot from 'robotjs'
import Jimp from 'jimp'
import { createWorker } from 'tesseract.js'

// 擷取螢幕截圖並轉換為 Jimp 圖像
async function captureScreenAndConvertToJimp() {
  // 擷取螢幕截圖
  const { width: originWidth, height: originHeight } = robot.getScreenSize()

  const width = originWidth / 3
  const height = originHeight / 3
  console.log('width: ', width)
  console.log('height: ', height)

  const screenshot = robot.screen.capture(0, 0, width, height)

  Jimp.read(screenshot.image).then((r) => console.log(r))

  // image.write('./text.png')

  return null

  // return image.getBufferAsync(.MIME_PNG)
  // return image.getBase64Async(Jimp.MIME_PNG)

  // 這個太慢了
  // https://stackoverflow.com/questions/43881571/how-to-save-binary-buffer-to-png-file-in-nodejs/43881698#43881698
}

// 使用 Tesseract.js 辨識圖像中的文字
async function recognizeText(imageBuffer) {
  const worker = await createWorker('eng')

  ;(async () => {
    const {
      data: { text },
    } = await worker.recognize(imageBuffer)
    console.log('text:', text)
    await worker.terminate()
  })()
}

// 主函式
async function main() {
  try {
    // 擷取螢幕截圖並轉換為 Jimp 圖像
    const imageBuffer = await captureScreenAndConvertToJimp()

    return

    // 使用 Tesseract.js 辨識圖像中的文字
    const recognizedText = await recognizeText(imageBuffer)
    console.log('recognizedText:', recognizedText)

    return

    // 判斷是否包含特定文字
    const targetText = 'your_target_text'
    if (recognizedText.includes(targetText)) {
      console.log(`圖像中包含指定文字: ${targetText}`)
    } else {
      console.log(`圖像中未包含指定文字: ${targetText}`)
    }
  } catch (error) {
    console.error('錯誤:', error)
  }
}

// 執行主函式
setTimeout(() => {
  main()
}, 2000)
