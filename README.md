[![npm](https://img.shields.io/npm/v/rax-appear.svg)](https://www.npmjs.com/package/appear-polyfill)

**描述：**
封装了 appear 和 disappear 事件监听的 Polyfill。

## 安装

```bash
$ npm install appear-polyfill --save
```

## 示例

```jsx
// app.js
import { useEffect } from 'react';
import { setupAppear } from 'appear-polyfill';
setupAppear(window);

function App() {
  useEffect(() => {
    const item50 = document.getElementById('item50');

    item50.addEventListener('appear', (event) => {
      console.log('appear at', event.target, event);
    });

    item50.addEventListener('disappear', (event) => {
      console.log('disappear at', event.target, event);
    });
  }, []);
  return Array.from({ length: 100 })
    .map((_, index) => (
        <div id={`item${index}`} key={index} style={styles.item}>Item {index}</div>
    ))
}
render(<App />);
```
## 配置项

**intersectionObserverLoader**

- 类型：`function`

> Tip: 从 0.2.0 版本开始, appear-polyfill 移除了内置的 IntersectionObserver Polyfill，如有必要可以自行引入。

用于在浏览器不支持 IntersectionObserver 的情况下，动态加载 IntersectionObserver Polyfill。

```js
import { setupAppear } from 'appear-polyfill';

const INTERSECTION_OBSERVER_POLYFILL = 'https://cdn.jsdelivr.net/npm/intersection-observer@0.12.2/intersection-observer.js';
function intersectionObserverLoader() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // Polyfill 加载完成后，会在 window 上挂载 IntersectionObserver 对象
    script.onload = () => resolve(window.IntersectionObserver);
    script.onerror = () => reject();
    script.src = INTERSECTION_OBSERVER_POLYFILL;
    document.head.appendChild(script);
  });
}

// 启动监听
setupAppear(window, { intersectionObserverLoader });
```

**preAppear**

- 类型：`string`

支持预加载浏览器视口底部更多偏移的内容，单位 `px`。为需要预加载的元素设置 `preappear` 事件。

```jsx
import { createElement, render } from 'rax';
import Image from 'rax-image';

import { setupAppear } from 'appear-polyfill';

if (isWeb) {
  setupAppear(window, {
    preAppear: '0px 0px 100px 0px'
  });
}

const App = () => {
  const rendderImage = () => (
    <Image
      onPreappear={(e) => { console.log(e); }}
      source={{
        uri: 'https://gw.alicdn.com/tfs/TB1bBD0zCzqK1RjSZFpXXakSXXa-68-67.png',
      }}
      style={{
        height: 300,
        width: '100%',
      }}
    />
  );
  return (
    <div>
      {
        new Array(10).map(rendderImage)
      }
    </div>
  );
};

render(<App />, document.body);
```