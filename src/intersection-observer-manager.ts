import { IntersectionObserverMode, SetupOptions } from './types';

// Shared intersectionObserver instance.
let intersectionObserverMap = {}

const intersectionObserverHandleIMap = {
  [IntersectionObserverMode.DEFAULT]: handleIntersect,
  [IntersectionObserverMode.PRE_APPEAR]: handlePreIntersect
}

function generateThreshold(number) {
  const thresholds: number[] = [];
  for (let index = 0; index < number; index++) {
    thresholds.push(index / number);
  }

  return thresholds;
}

const defaultOptions = {
  threshold: generateThreshold(10),
  rootMargin: '0px 0px 0px 0px',
};

export function createIntersectionObserver(
  mode: IntersectionObserverMode,
  IntersectionObserver,
  options: SetupOptions = {},
) {
  const shallowOption = Object.assign({}, options, defaultOptions);
  const { threshold, preAppear, rootMargin } = shallowOption;
  intersectionObserverMap[mode] = new IntersectionObserver(
    intersectionObserverHandleIMap[mode],
    {
      root: null,
      rootMargin: mode === IntersectionObserverMode.PRE_APPEAR ? preAppear : rootMargin,
      threshold: threshold
    }
  );
  return _observerElement(mode)
}

export function destroyAllIntersectionObserver() {
  for (let key in intersectionObserverMap) {
    const current = intersectionObserverMap[key];
    if (current) {
      current.disconnect();
    }
  }
  intersectionObserverMap = {};
}

function _observerElement(mode: IntersectionObserverMode) {
  return function observerElement(eventTarget: EventTarget) {
    if (eventTarget === document) {
      eventTarget = document.documentElement;
    }
    const observer = intersectionObserverMap[mode];
    observer.observe(eventTarget);
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
