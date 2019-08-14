import PolyfilledIntersectionObserver from './IntersectionObserver';

// Shared intersectionObserver instance.
let intersectionObserver;
const IntersectionObserver = (function(window) {
  if ('IntersectionObserver' in window &&
    'IntersectionObserverEntry' in window &&
    'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    // features are natively supported
    return window.IntersectionObserver;
  } else {
    // polyfilled IntersectionObserver
    return PolyfilledIntersectionObserver;
  }
})(window);

function generateThreshold(number) {
  const thresholds = [];
  for (let index = 0; index < number; index++) {
    thresholds.push(index / number);
  }

  return thresholds;
}

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  threshold: generateThreshold(10)
};

export function createIntersectionObserver(options = defaultOptions) {
  intersectionObserver = new IntersectionObserver(handleIntersect, options);
}

export function destroyIntersectionObserver() {
  if (intersectionObserver) {
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }
}

export function observerElement(element) {
  if (!intersectionObserver) createIntersectionObserver();

  if (element === document) element = document.documentElement;

  intersectionObserver.observe(element);
}

function handleIntersect(entries) {
  entries.forEach((entry) => {
    const { target, boundingClientRect, intersectionRatio } = entry;
    const currentY = boundingClientRect.y;
    const beforeY = parseInt(target.dataset.beforeCurrentY) || currentY;

    // is in view
    if (intersectionRatio > 0.2 && !isTrue(target.dataset.appeared)) {
      target.dataset.appeared = true;
      target.dispatchEvent(createEvent('appear', {
        direction: currentY > beforeY ? 'up' : 'down'
      }));
    } else if (intersectionRatio === 0 && isTrue(target.dataset.appeared)) {
      target.dataset.appeared = false;
      target.dispatchEvent(createEvent('disappear', {
        direction: currentY > beforeY ? 'up' : 'down'
      }));
    }

    target.dataset.beforeCurrentY = currentY;
  });
}

function isTrue(flag) {
  return flag && flag === 'true';
}

function createEvent(eventName, data) {
  return new CustomEvent(eventName, {
    bubbles: false,
    cancelable: true,
    detail: data
  });
}