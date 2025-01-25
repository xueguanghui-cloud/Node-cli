const { Workbook } = require('exceljs')
const fs = require('fs')

const languages = ['zh-CN', 'en-US']


function main() {
  const workbook = new Workbook()

  const worksheet = workbook.addWorksheet('codexgh2')

  const bundleData = languages.map(item => {
    return  JSON.parse(fs.readFileSync(`./locales/${item}.json`, 'utf-8'))
  })

  const data = []

  bundleData.forEach((item, index) => {
    for (const key in item) {
      const foundItem = data.find(item => item.id === key)
      if(foundItem) {
        foundItem[languages[index]] = item[key]
      } else {
        data.push({
          id: key,
          [languages[index]]: item[key]
        })
      }
    }
  })

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 30 },
    ...languages.map(item => {
      return {
        header: item,
        key: item,
        width: 30
      }
    })
  ]

  worksheet.addRows(data)

  workbook.xlsx.writeFile('./bundle.xlsx')
  
}

main()