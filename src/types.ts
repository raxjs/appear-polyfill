export interface SetupOptions {
  // The method to load the IntersectionObserver instance.
  intersectionObserverLoader?: () => Promise<typeof window.IntersectionObserver>;

  // The thresholds array of the IntersectionObserver instance.
  threshold?: number[];

  // The root margin of the IntersectionObserver instance.
  rootMargin?: string;

  preAppear?: string;
}

export enum IntersectionObserverMode {
  DEFAULT = 'default',
  PRE_APPEAR = 'pre',
}