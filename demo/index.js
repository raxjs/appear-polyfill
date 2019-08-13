import { createElement, render } from 'rax';
import * as DriverDOM from 'driver-dom';
import { isWeb } from 'universal-env';
import { setupAppear } from '../src/index';

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
          onDisAppear={() => {
            console.log('disappear: ', item, event.detail.direction);
          }}
        >
          第 {item} 个
        </div>
      );
    })}
  </div>
), document.body, { driver: DriverDOM });
