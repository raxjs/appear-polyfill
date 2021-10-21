import { createIntersectionObserver, destroyIntersectionObserver, observerElement } from './intersectionObserverManager';
import emitter from "./emitter";

export default function setup(win) {
  if (!win) {
    if (typeof window !== 'undefined') {
      win = window;
    } else {
      return;
    }
  }

  emitter.on((node) => observerElement(node));

  createIntersectionObserver();

  return function unsetup() {
    emitter.clear();

    const nativeAddEventListener = Node.prototype.__appearHijackedAddEventListener;

    if (typeof nativeAddEventListener === 'function') {
      Node.prototype.addEventListener = nativeAddEventListener;
    }
    
    delete Node.prototype.__appearHijackedAddEventListener;

    destroyIntersectionObserver();
  };
}