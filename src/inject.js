import emitter from './emitter';

// hijack Node.prototype.addEventListener
const injectEventListenerHook = (win) => {
  if (!win) {
    if (typeof window !== 'undefined') {
      win = window;
    } else {
      return;
    }
  }

  const Node = win.Node;
  const nativeAddEventListener = Node.prototype.addEventListener;
  // for restore
  Node.prototype.__appearHijackedAddEventListener = nativeAddEventListener;

  Node.prototype.addEventListener = function(eventName, eventHandler, useCapture, doNotWatch) {
    const lowerCaseEventName = eventName && String(eventName).toLowerCase();
    const isAppearEvent = lowerCaseEventName === 'appear' || lowerCaseEventName === 'disappear';
    if (isAppearEvent) emitter.emit(this);

    nativeAddEventListener.call(this, eventName, eventHandler, useCapture);
  };
};

export default injectEventListenerHook
