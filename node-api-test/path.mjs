import path from 'node:path';
import { fileURLToPath } from 'node:url';

const filePath = fileURLToPath(import.meta.url)

console.log(filePath); // 文件路径
console.log(path.dirname(filePath)); // 目录名
console.log(path.basename(filePath)); // 文件名
console.log(path.extname(filePath)); // 后缀名