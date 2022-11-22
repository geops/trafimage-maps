import React from 'react';
import { render, screen } from '@testing-library/react';
import { Layer } from 'mobility-toolbox-js/ol';
import { Provider } from 'react-redux';
import TopicMenu from './TopicMenu';

const layer1 = new Layer({
  name: 'parent1',
  children: [
    new Layer({
      name: 'child',
    }),
  ],
});

const layer2 = new Layer({
  name: 'layer2',
});

describe('TopicMenu', () => {
  it('renders the topic name and not layers when topic is not active', () => {
    const store = global.mockStore({
      map: { layers: [layer1, layer2] },
      app: {
        menuOpen: true,
        activeTopic: {},
      },
    });
    render(
      <Provider store={store}>
        <TopicMenu topic={{ name: 'topicName', key: 'topic' }} />
      </Provider>,
    );
    expect(screen.getByText('topicName')).toBeInTheDocument();
    expect(screen.queryByText('parent1')).toBe(null);
    expect(screen.queryByText('child')).toBe(null);
    expect(screen.queryByText('layer2')).toBe(null);
  });

  it("renders the topic's layers name when topic is active", () => {
    const topic = { name: 'topicName', key: 'topic' };
    const store = global.mockStore({
      map: {
        layers: [layer1, layer2],
      },
      app: {
        menuOpen: true,
        activeTopic: topic,
      },
    });
    render(
      <Provider store={store}>
        <TopicMenu topic={topic} />
      </Provider>,
    );
    // Test important operator
    expect(screen.getByText('parent1')).toBeInTheDocument();
    expect(screen.getByText('child')).toBeInTheDocument();
    expect(screen.getByText('layer2')).toBeInTheDocument();
    expect(screen.getByText('topicName')).toBeInTheDocument();
  });
});
