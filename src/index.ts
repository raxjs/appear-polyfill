/**
 * Simulate appear & disappear events.
 */
import { supportsPassive } from './passive-event';
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
    if (!SharedIntersectionObserver && options?.loadIntersectionObserver) {
      SharedIntersectionObserver = await options.loadIntersectionObserver?.();
    }
  }

  if (!SharedIntersectionObserver) {
    throw new Error('IntersectionObserver is not available, please set loadIntersectionObserver properly.');
  }
  return SharedIntersectionObserver;
}

// hijack Node.prototype.addEventListener
function injectEventListenerHook(events: string[] = [], Node, observerElement) {
  const nativeAddEventListener = Node.prototype.addEventListener;

  Node.prototype.addEventListener = function hijackAddEventListener(eventName) {
    const lowerCaseEventName = String(eventName).toLowerCase();

    // Tip: String#indexOf is faster than other methods in most cases.
    const matchEvent = events.indexOf(lowerCaseEventName) > -1;
    if (matchEvent) observerElement(this);

    return nativeAddEventListener.apply(this, arguments);
  };

  return function teardown() {
    destroyAllIntersectionObserver();
    Node.prototype.addEventListener = nativeAddEventListener;
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
