import PolyfilledIntersectionObserver from './IntersectionObserver';

// Shared intersectionObserver instance.
let intersectionObserverMap = {}

export const IntersectionObserverMode = {
  DEFAULT: 'default',
  PRE_APPEAR: 'pre'
}

const intersectionObserverHandleIMap = {
  [IntersectionObserverMode.DEFAULT]: handleIntersect,
  [IntersectionObserverMode.PRE_APPEAR]: handlePreIntersect
}

const IntersectionObserver = (function () {
  if (typeof window !== 'undefined' &&
    'IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // features are natively supported
    return window.IntersectionObserver;
  } else {
    // polyfilled IntersectionObserver
    return PolyfilledIntersectionObserver;
  }
})();

function generateThreshold(number) {
  const thresholds = [];
  for (let index = 0; index < number; index++) {
    thresholds.push(index / number);
  }

  return thresholds;
}

const defaultCustomOptions = {
  threshold: generateThreshold(10),
  rootMargin: '0px 0px 0px 0px',
};

/** suggest default & pre modes */
export function createIntersectionObserver(type, customOptions = defaultCustomOptions) {
  const { threshold, preAppear } = customOptions;
  const options = {
    root: null,
    rootMargin: type === IntersectionObserverMode.PRE_APPEAR ? preAppear : defaultCustomOptions.rootMargin,
    threshold: threshold ?? defaultCustomOptions.threshold
  };
  intersectionObserverMap[type] = new IntersectionObserver(intersectionObserverHandleIMap[type], options);

  return _observerElement(type)
}

export function destroyAllIntersectionObserver() {
  (Object.keys(intersectionObserverMap) || []).forEach((key) => {
    const current = intersectionObserverMap[key];
    if (current) {
      current.disconnect();
    }
  });
  intersectionObserverMap = {};
}

function _observerElement(type) {
  return function observerElement(element) {
    if (!intersectionObserverMap[type]) createIntersectionObserver();
    if (element === document) element = document.documentElement;
    intersectionObserverMap[type].observe(element);
  }
}

function handleIntersect(entries) {
  entries.forEach((entry) => {
    const {
      target,
      boundingClientRect,
      intersectionRatio
    } = entry;
    const { currentY, beforeY } = getElementY(target, boundingClientRect);

    // is in view
    if (
      intersectionRatio > 0.01 &&
      !isTrue(target.getAttribute('data-appeared')) &&
      !appearOnce(target, 'appear')
    ) {
      target.setAttribute('data-appeared', 'true');
      target.setAttribute('data-has-appeared', 'true');
      target.dispatchEvent(createEvent('appear', {
        direction: currentY > beforeY ? 'up' : 'down'
      }));
    } else if (
      intersectionRatio === 0 &&
      isTrue(target.getAttribute('data-appeared')) &&
      !appearOnce(target, 'disappear')
    ) {
      target.setAttribute('data-appeared', 'false');
      target.setAttribute('data-has-disappeared', 'true');
      target.dispatchEvent(createEvent('disappear', {
        direction: currentY > beforeY ? 'up' : 'down'
      }));
    }

    target.setAttribute('data-before-current-y', currentY);
  });
}

function handlePreIntersect(entries) {
  entries.forEach((entry) => {
    const {
      target,
      boundingClientRect,
      intersectionRatio
    } = entry;
    const { currentY, beforeY } = getElementY(target, boundingClientRect);

    // is in view
    if (
      intersectionRatio > 0.01 &&
      !isTrue(target.getAttribute('data-pre-appeared')) &&
      !appearOnce(target, 'appear')
    ) {
      target.setAttribute('data-pre-appeared', 'true');
      target.dispatchEvent(createEvent('preappear', {
        direction: currentY > beforeY ? 'up' : 'down'
      }));
    }
  });
}

/**
 * need appear again when node has isonce or data-once
 */
function appearOnce(node, type) {
  const isOnce = isTrue(node.getAttribute('isonce')) || isTrue(node.getAttribute('data-once'));
  const appearType = type === 'appear' ? 'data-has-appeared' : 'data-has-disappeared';

  return isOnce && isTrue(node.getAttribute(appearType));
}

function isTrue(flag) {
  return flag && flag !== 'false';
}

function createEvent(eventName, data) {
  return new CustomEvent(eventName, {
    bubbles: false,
    cancelable: true,
    detail: data
  });
}

function getElementY(target, boundingClientRect) {
  // pollfill doesn't have top attribute
  const currentY = boundingClientRect.y || boundingClientRect.top;
  const beforeY = parseInt(target.getAttribute('data-before-current-y')) || currentY;
  return { currentY, beforeY };
}
