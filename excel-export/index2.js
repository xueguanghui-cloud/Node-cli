const { Workbook } = require('exceljs');
const fs = require('node:fs');

async function main(){
    const workbook = new Workbook();

    const workbook2 = await workbook.xlsx.readFile('./bundle.xlsx');

    const zhCNBundle = {};
    const enUSBundle = {};

    workbook2.eachSheet((sheet) => {

        sheet.eachRow((row, index) => {
            if(index === 1) {
                return;
            }
            const key = row.getCell(1).value;
            const zhCNValue = row.getCell(2).value;
            const enUSValue = row.getCell(3).value;

            zhCNBundle[key] = zhCNValue;
            enUSBundle[key] = enUSValue;
        })
    });

    console.log(zhCNBundle);
    console.log(enUSBundle);
    fs.writeFileSync('./locales/zh-CN.json', JSON.stringify(zhCNBundle, null, 2));
    fs.writeFileSync('./locales/en-US.json', JSON.stringify(enUSBundle, null, 2));
}

main();
