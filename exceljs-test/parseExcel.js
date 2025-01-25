const { Workbook } = require('exceljs')

// 解析excel
async function main() {
  const workbook = new Workbook()

  // 创建工作簿
  const workbook2 = await workbook.xlsx.readFile('./data.xlsx')
  workbook2.eachSheet((sheet, index1) => {
    // sheet 是当前工作表
    console.log('工作表', index1);
    // 1. 手动遍历
    // sheet.eachRow((row, index2) => {
    //   const rowData = []

    //   row.eachCell((cell, index3) => {
    //     rowData.push(cell.value);
    //   })
    //   console.log('行' + index2, rowData);
    // })

    // 2. 使用 getSheetValues 方法拿到表格数据
    const value = sheet.getSheetValues()
    console.log(value);
    
  })
}

main()