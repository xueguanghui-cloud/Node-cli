import { cpus } from 'node:os';
import { MessageChannel, Worker } from 'node:worker_threads';
export class ScanService {
    constructor() {
        this.index = 0;
        this.workers = [];
        this.tunnels = [];
    }
    startScan(stream$, path) {
        this.initWorkers(); // 创建workers
        this.listenEvents(stream$); // 监听所有 port 的 message 消息
        this.addJob({ job: 'scan', value: { path } }); // 给worker派发一个job
    }
    listenEvents(stream$) {
        this.tunnels.forEach(tunnel => {
            tunnel.on('message', (data) => {
                this.newWorkerMessage(data, stream$);
            });
        });
    }
    newWorkerMessage(message, stream$) {
        const { type, value } = message;
        if (type === 'scanResult') {
            const results = value.results;
            results.forEach(result => {
                const { path, isTarget } = result;
                if (isTarget) {
                    stream$.next(path);
                }
                else {
                    this.addJob({
                        job: 'scan',
                        value: { path }
                    });
                }
            });
        }
    }
    initWorkers() {
        const size = this.getPoolSize();
        for (let i = 0; i < size; i++) {
            const { port1, port2 } = new MessageChannel();
            const worker = new Worker('./dist/worker.js');
            worker.postMessage({
                type: 'startup',
                value: {
                    channel: port2,
                    id: i
                }
            }, [port2]);
            this.workers.push(worker);
            this.tunnels.push(port1);
        }
    }
    getPoolSize() {
        return cpus().length;
    }
    addJob(job) {
        if (job.job === 'scan') {
            const tunnel = this.tunnels[this.index];
            const message = { type: 'scan', value: job.value };
            tunnel.postMessage(message);
            this.index = this.index >= this.workers.length - 1 ? 0 : this.index + 1;
        }
    }
}
