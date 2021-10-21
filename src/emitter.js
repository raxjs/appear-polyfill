class Emitter {
  constructor() {
    this._listeners = [];
    this._queue = [];
  }

  on(listener) {
    if (typeof listener === 'function') {
      this._listeners.push( listener );
    }
    this.run();
  }

  emit(...args) {
    this._queue.push(args);
    this.run();
  }

  run() {
    const listeners = this._listeners;
    const queue = this._queue;

    // consume data in queue
    const queueLength = queue.length;
    const listenersLength = listeners.length;

    if ((queueLength > 0) && (listenersLength > 0)) {
      for (let i = 0; i < queueLength; i++) {
        for (let j = 0; j < listenersLength; j++) {
          listeners[j](...queue[i]);
        }
      }
    }
  }

  clear() {
    this._listeners.length = 0;
    this._queue.length = 0;
  }
}

export default new Emitter()

