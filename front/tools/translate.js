require('dotenv').config()

const { Translate } = require('@google-cloud/translate').v2
const translate = new Translate()
const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../locales')

fs.readdir(directoryPath, function (err, files) {
  //handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  //listing all files using forEach
  files.forEach(function (file) {
    if (file.substr(-4) !== 'json') return
    //if (file === 'en.json') return

    translateFile(file)
  })
})

async function translateFile (filename) {
  const file = JSON.parse(fs.readFileSync(path.join(directoryPath, filename)))
  const lang = filename.replace('.json', '')

  for (let key in file) {
    if (file[key].length) continue
    console.log(`[${lang}] Translating ${key}`)
    if (lang === 'en') file[key] = key
    else {
      let [translation] = await translate.translate(key, lang)
      file[key] = translation
    }
  }

  fs.writeFileSync(
    path.join(directoryPath, filename),
    JSON.stringify(file, null, 4)
  )
  console.log(`Lang ${lang} translated.`)
}
