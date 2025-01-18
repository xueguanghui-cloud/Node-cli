var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parentPort } from "node:worker_threads";
import { opendir } from "node:fs/promises";
import EventEmitter from "node:events";
import { join } from "node:path";
(() => {
    let id = 0;
    let fileWalker;
    let tunnel;
    if (parentPort === null) {
        throw new Error('Worker 只能被 parent thread 启动，不能单独跑');
    }
    parentPort.on('message', (message) => {
        if (message.type === 'startup') {
            id = message.value.id;
            tunnel = message.value.channel;
            fileWalker = new FileWalker();
            initTunnelListeners();
            initFileWalkerListeners();
        }
    });
    function initTunnelListeners() {
        tunnel.on('message', (message) => {
            if ((message === null || message === void 0 ? void 0 : message.type) === 'scan') {
                fileWalker.enqueueTask(message.value.path);
            }
        });
    }
    function initFileWalkerListeners() {
        fileWalker.events.on('newResult', ({ results }) => {
            tunnel.postMessage({
                type: 'scanResult',
                value: { results }
            });
        });
    }
})();
class FileWalker {
    constructor() {
        this.events = new EventEmitter();
        this.taskQueue = [];
    }
    enqueueTask(path) {
        this.taskQueue.push({ path });
        this.processQueue();
    }
    processQueue() {
        var _a;
        while (this.taskQueue.length > 0) {
            const path = (_a = this.taskQueue.shift()) === null || _a === void 0 ? void 0 : _a.path;
            if (path === undefined || path === '') {
                return;
            }
            this.run(path);
        }
    }
    run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dir = yield opendir(path);
                yield this.analizeDir(path, dir);
            }
            catch (_) {
            }
        });
    }
    analizeDir(path, dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            let entry = null;
            while ((entry = yield dir.read().catch(() => null)) != null) {
                this.newDirEntry(path, entry, results);
            }
            this.events.emit('newResult', { results });
            yield dir.close();
        });
    }
    newDirEntry(path, entry, results) {
        const subpath = join(path, entry.name);
        const shouldSkip = !entry.isDirectory();
        if (shouldSkip) {
            return;
        }
        results.push({
            path: subpath,
            isTarget: entry.name === 'node_modules'
        });
    }
}
