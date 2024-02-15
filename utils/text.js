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

  const image = new Jimp(screenshot.width, screenshot.height)

  console.time('1')

  // https://stackoverflow.com/questions/43881571/how-to-save-binary-buffer-to-png-file-in-nodejs/43881698#43881698
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // hex is a string, rrggbb format
      const hex = screenshot.colorAt(x, y)
      // Jimp expects an Int, with RGBA data,
      // so add FF as 'full opaque' to RGB color
      const num = parseInt(hex + 'ff', 16)
      // Set pixel manually
      image.setPixelColor(num, x, y)
    }
  }

  console.timeEnd('1')

  image.write('./text.png')

  return image.getBufferAsync(Jimp.MIME_PNG)
  // return image.getBase64Async(Jimp.MIME_PNG)
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
