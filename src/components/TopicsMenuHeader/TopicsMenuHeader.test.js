import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { Layer } from 'mobility-toolbox-js/ol';
import { Provider } from 'react-redux';
import { Map } from 'ol';
import TopicsMenuHeader from '.';

describe('TopicsMenuHeader', () => {
  let layer1;
  let layer2;
  let topic1;
  let topic2;
  let store;
  let state;

  beforeEach(() => {
    layer1 = new Layer({
      name: 'parent1',
      children: [
        new Layer({
          name: 'child',
        }),
        new Layer({
          name: 'child2',
        }),
      ],
    });

    layer2 = new Layer({
      name: 'layer2',
    });

    topic1 = {
      name: 'topic1',
      key: 'topic1',
      layers: [layer1],
    };

    topic2 = {
      name: 'topic2',
      key: 'topic2',
      layers: [layer1, layer2],
    };
    state = {
      map: {
        layers: topic2.layers,
      },
      app: {
        menuOpen: true,
        topics: [topic1, topic2],
        activeTopic: topic2,
        map: new Map(),
      },
    };
    store = global.mockStore(state);
  });

  it('renders the active topic name and active layers', () => {
    render(
      <Provider store={store}>
        <TopicsMenuHeader />
      </Provider>,
    );
    expect(screen.getByText('topic2')).toBeInTheDocument();
    expect(screen.getByText('alle aktiviert')).toBeInTheDocument();
  });

  it('updates the active layers when a visiblity changes', () => {
    const { container } = render(
      <Provider store={store}>
        <TopicsMenuHeader />
      </Provider>,
    );
    expect(screen.getByText('topic2')).toBeInTheDocument();
    const allActiveText = screen.getByText('alle aktiviert');
    expect(allActiveText).toBeInTheDocument();
    act(() => {
      topic2.layers[0].children[0].visible = false;
      topic2.layers[0].children[1].visible = false;
    });
    expect(screen.getByText('layer2')).toBeInTheDocument();
    act(() => {
      layer2.visible = false;
    });
    expect(
      container.querySelector('.wkp-menu-layers.hidden'),
    ).toBeInTheDocument();
  });

  it('updates the activetopic changes', () => {
    const { container } = render(
      <Provider store={store}>
        <TopicsMenuHeader onToggle={() => {}} />
      </Provider>,
    );
    expect(screen.getByText('topic2')).toBeInTheDocument();
    const allActiveText = screen.getByText('alle aktiviert');
    expect(allActiveText).toBeInTheDocument();
    act(() => {
      topic2.layers[0].children[0].visible = false;
      topic2.layers[0].children[1].visible = false;
    });
    expect(screen.getByText('layer2')).toBeInTheDocument();
    act(() => {
      layer2.visible = false;
    });
    expect(
      container.querySelector('.wkp-menu-layers.hidden'),
    ).toBeInTheDocument();
  });

  it("doesn't render html tags from layer name", () => {
    layer2.visible = false;
    const layerWithHtmlTags = new Layer({
      name: 'layer2<b>withHtmlTags</b>',
    });
    state.map.layers = [layer2, layerWithHtmlTags];
    store = global.mockStore(state);
    render(
      <Provider store={store}>
        <TopicsMenuHeader />
      </Provider>,
    );
    expect(screen.getByText('layer2withHtmlTags')).toBeInTheDocument();
  });
});
