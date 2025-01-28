const path = require("node:path")

const filePath = path.join('../', 'node-api-test', './', 'path2.js')
console.log(filePath); // 解析 ../ ./ 拼接返回一个相对路径： ../node-api-test/path2.js

const filePath2 = path.resolve('../', 'node-api-test', './', 'path2.js')
console.log(filePath2); // 解析返回一个绝对路径：/Users/xueguanghui/Desktop/xue/project/node-cli/node-api-test/path2.js

console.log(path.relative('/a/b/c', '/a/d')); // 返回 a 路径 到 b 路径的相对路径：../../d
console.log(path.parse(__filename)); // 解析路径
/**
 {
  root: '/',
  dir: '/Users/xueguanghui/Desktop/xue/project/node-cli/node-api-test',
  base: 'path2.js',
  ext: '.js',
  name: 'path2'
}
 */
