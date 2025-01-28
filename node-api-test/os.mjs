import os from 'node:os';

// os.EOL 是换行符 在windows 上是 /r/n 在其他系统上是 \n 所以直接用 os.EOL 更好
console.log('aaa' + os.EOL + 'bbb' + os.EOL);

console.log(os.cpus());

console.log(os.type()); // 系统类型 有 Darwin（也就是 mac）、Windows_NT、Linux 等值
console.log(os.userInfo()) // 到当前用户相关的信息，比如 homedir、username 等
console.log(os.freemem(), os.totalmem()); // os.freemem() 是可用内存、os.totalmem() 是总内存

console.log(os.homedir());
console.log(os.networkInterfaces()) // 网卡信息
