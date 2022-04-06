import PolyfilledIntersectionObserver from './IntersectionObserver';

// Shared intersectionObserver instance.
let intersectionObserver;
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
  endReachedThreshold: 0
};

export function createIntersectionObserver(customOptions = defaultCustomOptions) {
  const { endReachedThreshold } = customOptions;
  const options = {
    root: null,
    rootMargin: `0px 0px ${endReachedThreshold}px 0px`,
    threshold: generateThreshold(10)
  };
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
    const {
      target,
      boundingClientRect,
      intersectionRatio
    } = entry;
    // pollfill 里面没有 top
    const currentY = boundingClientRect.y || boundingClientRect.top;
    const beforeY = parseInt(target.getAttribute('data-before-current-y')) || currentY;
    const screenHeight = window.innerHeight;

    // is in view
    if (
      intersectionRatio > 0.01 &&
      !isTrue(target.getAttribute('data-appeared')) &&
      !appearOnce(target, 'appear')
    ) {
      const isInView = screenHeight >= currentY;
      const isPreAppear = (screenHeight < currentY) && isTrue(target.getAttribute('pre-appear'));
      if(isInView || isPreAppear) {
        target.setAttribute('data-appeared', 'true');
        target.setAttribute('data-has-appeared', 'true');
        target.dispatchEvent(createEvent('appear', {
          direction: currentY > beforeY ? 'up' : 'down'
        }));
      }
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
