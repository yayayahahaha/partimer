const Tesseract = require('tesseract.js')

// 捕獲圖像並進行文字辨識
function recognizeText(imagePath) {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(
      imagePath,
      'eng', // 使用英文語言
      { logger: (m) => console.log(m) } // 用於打印日誌，可選
    )
      .then(({ data: { text } }) => {
        resolve(text)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 判斷文字中是否包含特定的字串
function containsString(text, searchString) {
  return text.includes(searchString)
}

// 使用示例
recognizeText('screenshot.png')
  .then((text) => {
    console.log('識別出的文字：', text)
    const searchString = 'Hello'
    if (containsString(text, searchString)) {
      console.log(`找到字串 "${searchString}"`)
    } else {
      console.log(`未找到字串 "${searchString}"`)
    }
  })
  .catch((error) => {
    console.error('文字辨識錯誤：', error)
  })
