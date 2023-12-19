import React from "react";
import { render, screen } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import { Provider } from "react-redux";
import { Map } from "ol";
import TopicsMenu from "./TopicsMenu";

const layer1 = new Layer({
  name: "parent1",
  children: [
    new Layer({
      name: "child",
    }),
  ],
});

const layer2 = new Layer({
  name: "layer2",
});

const topic1 = {
  name: "topic1",
  key: "topic1",
  layers: [layer1],
};

const topic2 = {
  name: "topic2",
  key: "topic2",
  layers: [layer2],
};

describe("TopicsMenu", () => {
  it("renders the active topic name and active layers", () => {
    const store = global.global.mockStore({
      map: {
        layers: [layer1, layer2],
      },
      app: {
        menuOpen: true,
        topics: [topic1, topic2],
        activeTopic: topic2,
        map: new Map(),
      },
    });
    render(
      <Provider store={store}>
        <TopicsMenu />
      </Provider>,
    );
    expect(screen.getAllByText(/topic2/).length).toBe(2);
    expect(screen.getByText("alle aktiviert")).toBeInTheDocument();
  });
});
