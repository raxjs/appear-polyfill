/**
 * Simulate appear & disappear events.
 */
import { createIntersectionObserver, destroyAllIntersectionObserver } from './intersection-observer-manager';
import { SetupOptions, IntersectionObserverMode } from './types';

let SharedIntersectionObserver: typeof window.IntersectionObserver;
async function getIntersectionObserver(options?: SetupOptions) {
  // Check if IntersectionObserver is available.
  if (typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // Features are natively supported
    SharedIntersectionObserver = window.IntersectionObserver;
  } else {
    // Initialize the polyfill only once.
    if (!SharedIntersectionObserver && options?.intersectionObserverLoader) {
      SharedIntersectionObserver = await options.intersectionObserverLoader?.();
    }
  }

  if (!SharedIntersectionObserver) {
    throw new Error('IntersectionObserver is not available, please set intersectionObserverLoader properly.');
  }
  return SharedIntersectionObserver;
}

const dehijackKey = '__dehijack__';
const hijackListener = (Constructor: typeof Element, callback: (eventName: string) => void) => {
  const nativeAddEventListener = Constructor.prototype.addEventListener;
  // Avoid double hijack.
  if (Constructor[dehijackKey]) return Constructor[dehijackKey];

  function hijackAddEventListener(eventName) {
    try {
      callback.call(this, eventName);
    } catch (e) {
      console.warn('Error when calling appear polyfill listener.');
      console.warn(e);
    } finally {
      return nativeAddEventListener.apply(this, arguments);
    }
  }

  Constructor.prototype.addEventListener = hijackAddEventListener;
  return function dehijack() {
    Constructor.prototype.addEventListener = nativeAddEventListener;
  };
};

// hijack Node.prototype.addEventListener
function injectEventListenerHook(events: string[] = [], Node, observerElement) {
  function callback(eventName) {
    const lowerCaseEventName = String(eventName).toLowerCase();

    // Tip: String#indexOf is faster than other methods in most cases.
    const matchEvent = events.indexOf(lowerCaseEventName) > -1;
    if (matchEvent) observerElement(this);
  }

  const teardownFns: Function[] = [];
  teardownFns.push(
    hijackListener(Node, callback)
  );
  // iOS <= 10.2.2, in App built-in WebView, `addEventListener` of `<div>` 
  // and `<object>` are inconsistent with Node.prototype.addEventListener.
  // The Node.prototype.addEventListener of the corresponding function is required.
  if (HTMLDivElement.prototype.addEventListener !== Node.prototype.addEventListener) {
    teardownFns.push(
      hijackListener(HTMLDivElement, callback)
    );
  }
  if (HTMLObjectElement.prototype.addEventListener !== Node.prototype.addEventListener) {
    teardownFns.push(
      hijackListener(HTMLObjectElement, callback)
    );
  }

  return function teardown() {
    destroyAllIntersectionObserver();
    let fn;
    while (fn = teardownFns.shift()) {
      fn();
    }
  };
};

function getWindow(): Window | null {
  if (typeof window !== 'undefined') {
    return window;
  } else {
    return null;
  }
}

export async function setupPreAppear(window = getWindow(), options: SetupOptions = {}) {
  const IntersectionObserver = await getIntersectionObserver(options);
  const observerElement = createIntersectionObserver(IntersectionObserverMode.PRE_APPEAR, IntersectionObserver, options);
  injectEventListenerHook(['preappear'], Node, observerElement);
}

export async function setupAppear(window = getWindow(), options: SetupOptions = {}) {
  if (!window) return;
  if (options?.preAppear) await setupPreAppear(window, options);
  const IntersectionObserver = await getIntersectionObserver(options);
  const observerElement = createIntersectionObserver(IntersectionObserverMode.DEFAULT, IntersectionObserver, options);
  return injectEventListenerHook(['appear', 'disappear'], Node, observerElement);
}
