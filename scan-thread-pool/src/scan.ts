import { cpus } from 'node:os'
import { MessageChannel, MessagePort, Worker } from 'node:worker_threads'
import { Subject } from 'rxjs'

interface WorkerJob {
  job: 'scan',
  value: {
    path: string
  }
}

export type WorkerMessage = {
  type: 'scanResult',
  value: {
    results: Array<{
      path: string,
      isTarget: boolean
    }>
  }
} | {
  type: 'scan',
  value: {
    path: string
  }
} | {
  type: 'startup',
  value: {
    channel: MessagePort,
    id: number
  }
}

export class ScanService {
  private index = 0;
  private workers: Worker[] = []
  private tunnels: MessagePort[] = []

  startScan(stream$: Subject<string>, path: string) {
    this.initWorkers() // 创建workers
    this.listenEvents(stream$) // 监听所有 port 的 message 消息
    this.addJob({ job: 'scan', value: { path } }) // 给worker派发一个job
  }

  private listenEvents(stream$: Subject<string>) {
    this.tunnels.forEach(tunnel => {
      tunnel.on('message', (data: WorkerMessage) => {
        this.newWorkerMessage(data, stream$)
      })
    })
  }

  private newWorkerMessage(message: WorkerMessage, stream$: Subject<string>) {
    const { type, value } = message
    if(type === 'scanResult') {
      const results: Array<{ path: string, isTarget: boolean }> = value.results

      results.forEach(result => {
        const { path, isTarget } = result
        if(isTarget) {
          stream$.next(path)
        }else{
          this.addJob({
            job: 'scan',
            value: { path }
          })
        }
      })
    }
  }

  private initWorkers(): void {
    const size = this.getPoolSize();
    
    for (let i = 0; i < size; i++) {
      const { port1, port2 } = new MessageChannel();
      const worker = new Worker('./worker.js');
      
      worker.postMessage(
        { 
            type: 'startup', 
            value: { 
                channel: port2, 
                id: i 
            } 
        },
        [port2]
      );

      this.workers.push(worker);
      this.tunnels.push(port1);
    }
  }

  private getPoolSize() {
    return cpus().length;
  }

  private addJob(job: WorkerJob) {
    if (job.job === 'scan') {
      const tunnel = this.tunnels[this.index];
      const message: WorkerMessage = { type: 'scan', value: job.value };
      tunnel.postMessage(message);
      this.index = this.index >= this.workers.length - 1 ? 0 : this.index + 1;
    }
  }
}