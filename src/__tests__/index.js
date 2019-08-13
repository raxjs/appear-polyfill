/* eslint-env jest */
import { createElement } from 'rax';
import renderer from 'rax-test-renderer';
import { isWeb } from 'universal-env';
import View from 'rax-view';
import { setupAppear } from '../';

if (isWeb) {
  setupAppear();
}

function AppearNode() {
  return (
    <div onAppear={() => {
      console.log('appear');
    }}>appear node</div>
  );
}

function ViewAppearNode() {
  return (
    <View onAppear={() => {
      console.log('appear');
    }}>view appear node</View>
  );
}

describe('AppearComponent', () => {
  let componentDiv;
  let componentView;

  beforeEach(() => {
    componentDiv = renderer.create(
      <AppearNode />
    );
    componentView = renderer.create(
      <ViewAppearNode />
    );
  });

  it('should render div appear prop', () => {
    let tree = componentDiv.toJSON();

    expect(tree.tagName).toEqual('DIV');
    expect(typeof tree.eventListeners.appear).toEqual('function');
  });

  it('should render view appear prop', () => {
    let tree = componentView.toJSON();

    expect(tree.tagName).toEqual('DIV');
    expect(typeof tree.eventListeners.appear).toEqual('function');
  });
});
