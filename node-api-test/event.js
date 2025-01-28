const EventEmitter = require('node:events')

class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter()

myEmitter.on('aaa', (data) => {
  console.log('aaa 事件触发', data);  
})

// once 只监听一次
myEmitter.once('bbb', (data) => {
  console.log('bbb 事件触发', data);
})

myEmitter.emit('aaa', 1);
myEmitter.emit('aaa', 2);
myEmitter.emit('bbb', 3);
myEmitter.emit('bbb', 4);