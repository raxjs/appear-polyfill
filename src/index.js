/**
 * Simulate appear & disappear events.
 */
import { createIntersectionObserver, destroyAllIntersectionObserver, IntersectionObserverMode } from './intersectionObserverManager';

// hijack Node.prototype.addEventListener
const injectEventListenerHook = (events = [], Node, observerElement) => {
  let nativeAddEventListener = Node.prototype.addEventListener;

  Node.prototype.addEventListener = function (eventName, eventHandler, useCapture, doNotWatch) {
    const lowerCaseEventName = eventName && String(eventName).toLowerCase();
    const isAppearEvent = events.some((item) => (item === lowerCaseEventName));
    if (isAppearEvent) observerElement(this);

    nativeAddEventListener.call(this, eventName, eventHandler, useCapture);
  };

  return function unsetup() {
    Node.prototype.addEventListener = nativeAddEventListener;
    destroyAllIntersectionObserver();
  };
};

export function setupPreAppear(win, options) {
  const observerElement = createIntersectionObserver(IntersectionObserverMode.PRE_APPEAR, options);
  injectEventListenerHook(['preappear'], win.Node, observerElement);
}

export function setupAppear(win, options) {
  if (!win) {
    if (typeof window !== 'undefined') {
      win = window;
    } else {
      return;
    }
  }

  if (options?.preAppear) {
    setupPreAppear(win, options);
  }

  const observerElement = createIntersectionObserver(IntersectionObserverMode.DEFAULT, options);
  return injectEventListenerHook(['appear', 'disappear'], win.Node, observerElement);
}
