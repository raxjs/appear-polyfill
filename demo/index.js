import { createElement, render, useEffect } from 'rax';
import * as DriverDOM from 'driver-dom';
import { isWeb } from 'universal-env';
import RecyclerView from 'rax-recyclerview';
import Picture from 'rax-picture';
import View from 'rax-view';
import Text from 'rax-text';

import { setupAppear } from '../src/index';
import data from './data.json';

setupAppear();

const list = [];
for (let index = 1; index <= 100; index++) {
  list.push(index);
}

const styles = {
  root: {
    width: 750,
    paddingTop: 20
  },

  sticky: {
    position: "sticky",
    width: 750,
    backgroundColor: "#cccccc"
  },

  container: {
    padding: 20,
    borderStyle: "solid",
    borderColor: "#dddddd",
    borderWidth: 1,
    marginLeft: 20,
    height: 1000,
    marginRight: 20,
    marginBottom: 10
  },
};

function App() {
  
  useEffect(() => {
    document.addEventListener('touchmove', () => {
      console.log('move');
    });
  }, []);

  return (
    <div>
      <RecyclerView
        style={{
          height: 667
        }}
      >
        {data.list.map((item, index) => {
          return (
            <RecyclerView.Cell key={index}>
              <View style={styles.box}>
                <Picture
                  source={{
                    uri: item.pic,
                  }}
                  style={{
                    width: 220,
                    height: 270
                  }}
                />
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </RecyclerView.Cell>
          );
        })}
      </RecyclerView>
    </div>
  );
}

render((
  <App />
), document.body, { driver: DriverDOM });
