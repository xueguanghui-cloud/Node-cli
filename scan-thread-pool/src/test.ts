import { filter, map, Subject } from 'rxjs'

const stream$ = new Subject<number>()

// 对值做了乘方运算，然后过滤掉偶数的值。
const result$ = stream$.pipe(map(x => x * x)).pipe(filter(x => x % 2 !== 0))

result$.subscribe((v) => {
  console.log(`订阅者1: ${v}`);
})

result$.subscribe((v) => {
  console.log(`订阅者2: ${v}`);
})

stream$.next(1)

setTimeout(() => {
  stream$.next(2)
}, 1000);

setTimeout(() => {
  stream$.next(3)
}, 2000);