/**
 * @module passive-event-listener-test
 */
const noop = () => {};
const TEST_EVENT_NAME = 'passivetester';
let _supportsPassive = false;

try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      return _supportsPassive = true;
    },
  });

  window.addEventListener(TEST_EVENT_NAME, noop, opts);
  window.removeEventListener(TEST_EVENT_NAME, noop, opts);
} catch (error) {
  // do noting.
}

/**
 * Test via a getter in the options object to see if the passive property is accessed.
 *
 * **TIP**
 * - The specification for `addEventListener()` defines the default value for the `passive`
 *   option as always being `false`. However, that introduces the potential for event listeners
 *   handling touch events and wheel events to block the browser's main thread while the browser
 *   is attempting to handle scrolling — possibly resulting in an enormous reduction in performance
 *   during scroll handling.
 *   To prevent that problem, browsers other than Safari and Internet Explorer have changed the
 *   default value of the `passive` option to `true` for the wheel, mousewheel, touchstart and touchmove
 *   events on the document-level nodes Window, Document, and Document.body. That prevents the event
 *   listener from canceling the event, so it can't block page rendering while the user is scrolling.
 *
 * - You don't need to worry about the value of `passive` for the basic scroll event. Since it can't be
 *   canceled, event listeners can't block page rendering anyway.
 *
 * - more details, visit [Improving scrolling performance with passive listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#improving_scrolling_performance_with_passive_listeners).
 * :::
 *
 * @example
 *
 * window.addEventListener(
 *   'touchmove',
 *   () => {
 *     // ...
 *   },
 *   supportsPassive() ? { passive: true } : false
 * );
 *
 * @function supportsPassive
 * @returns {boolean} returns whether `passive` option is supported.
 */
export const supportsPassive = (): boolean => _supportsPassive;
