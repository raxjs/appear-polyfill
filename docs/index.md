# Example

展开代码块以查看使用的例子

```jsx preview
import { useEffect } from 'react';
import { setupAppear } from '../src/index';

// https://caniuse.com/?search=IntersectionObserver
function intersectionObserverLoader() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => resolve(window.IntersectionObserver);
    script.onerror = () => reject();
    script.src = 'https://g.alicdn.com/ice/intersection-observer/0.12.2/intersection-observer.min.js';
    document.head.appendChild(script);
  });
}
setupAppear(window, { intersectionObserverLoader });

const styles = {
  item: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
};
// Ignore following line.
export default function List() {
  useEffect(() => {
    document.getElementById('item50').addEventListener('appear', (event) => {
      console.log('appear at', event.target, event);
    });

    document.getElementById('item50').addEventListener('disappear', (event) => {
      console.log('disappear at', event.target, event);
    });
  }, []);
  return Array.from({ length: 100 })
    .map((_, index) => (<div id={`item${index}`} key={index} style={styles.item}>Item {index}</div>));
}
```