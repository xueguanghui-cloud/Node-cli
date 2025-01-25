const { Workbook } = require('exceljs')

// 生成excel
function main () {
  const workbook = new Workbook()
  // 创建工作表
  const worksheet = workbook.addWorksheet('codexgh');

  // 表头
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 20 },
    { header: 'Name', key: 'name', width: 50 },
    { header: '出生日期', key: 'birthday', width: 50 },
    { header: '手机号', key: 'phone', width: 50 },
  ]

  const data = [
    {
      id: 1,
      name: '小红',
      birthday: new Date('1990-01-01'),
      phone: '13800138000',
    },
    {
      id: 2,
      name: '小明',
      birthday: new Date('1999-01-01'),
      phone: '13800138001',
    },
    {
      id: 3,
      name: '小刚',
      birthday: new Date('1998-01-01'),
      phone: '13800138002',
    },
  ]

  worksheet.addRows(data)

  worksheet.eachRow((row, rowIndex) => {
    row.eachCell(cell => {
        if(rowIndex === 1) {
            cell.style = {
                font: {
                    size: 10,
                    bold: true,
                    color: { argb: 'ffffff' }
                },
                alignment: { vertical: 'middle', horizontal: 'center' },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: '000000' }
                },
                border: {
                    top: { style: 'dashed', color: { argb: '0000ff' } },
                    left: { style: 'dashed', color: { argb: '0000ff' } },
                    bottom: { style: 'dashed', color: { argb: '0000ff' } },
                    right: { style: 'dashed', color: { argb: '0000ff' } }
                }
            }
        } else {
            cell.style = {
                font: {
                    size: 10,
                    bold: true,
                },
                alignment: { vertical: 'middle', horizontal: 'left' },
                border: {
                    top: { style: 'dashed', color: { argb: '0000ff' } },
                    left: { style: 'dashed', color: { argb: '0000ff' } },
                    bottom: { style: 'dashed', color: { argb: '0000ff' } },
                    right: { style: 'dashed', color: { argb: '0000ff' } }
                }
            }
        }
    })
})


  workbook.xlsx.writeFile('./data2.xlsx')
}

main()