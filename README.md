[![npm](https://img.shields.io/npm/v/rax-appear.svg)](https://www.npmjs.com/package/rax-appear)

**描述：**
封装了组件 Appear 和 Disappear 的监听。

## 安装

```bash
$ npm install appear-polyfill --save
```

## 示例


```jsx
import { createElement, render } from 'rax';
import * as DriverDOM from 'driver-dom';
import { isWeb } from 'universal-env';
import { setupAppear } from 'appear-polyfill';

if (isWeb) {
  setupAppear(window);
}

const list = [];
for (let index = 1; index <= 100; index++) {
  list.push(index);
}

render((
  <div>
    {list.map((item) => {
      return (
        <div
          style={{
            height: 100,
            backgroundColor: '#ccc',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onAppear={(event) => {
            console.log('appear: ', item, event.detail.direction);
          }}
          onDisappear={() => {
            console.log('disappear: ', item, event.detail.direction);
          }}
        >
          第 {item} 个
        </div>
      );
    })}
  </div>
), document.body, { driver: DriverDOM });
```
## 配置项

**endReachedThreshold**

- 类型：`number`

支持预加载浏览器视口底部更多偏移的内容，单位 `px`。为需要预加载的元素设置 `pre-appear` 属性为 `true`。

```jsx
import { createElement, render } from 'rax';
import DriverUniversal from 'driver-universal';
import Image from 'rax-image';

import { setupAppear } from 'appear-polyfill';

if (isWeb) {
  setupAppear(window, {
    endReachedThreshold: 100
  });
}

const App = () => {
  const rendderImage = () => (
    <Image
      pre-appear
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

render(<App />, document.body, { driver: DriverUniversal });
```