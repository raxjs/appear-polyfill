/**
 * Simulate appear & disappear events.
 */
import inject from './inject';
import setup from './setup';

export function setupAppear(win) {
  inject(win);
  return setup(win);
}
