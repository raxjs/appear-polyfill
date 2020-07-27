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
  setupAppear();
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