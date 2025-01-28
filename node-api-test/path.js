const path = require('node:path');

const filePath = __filename;

console.log(filePath); // 文件路径
console.log(path.dirname(filePath)); // 目录名
console.log(path.basename(filePath)); // 文件名
console.log(path.extname(filePath)); // 后缀名