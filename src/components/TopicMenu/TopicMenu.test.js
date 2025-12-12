import React from "react";
import { render, screen } from "@testing-library/react";
import { Layer } from "mobility-toolbox-js/ol";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/styles";
import TopicMenu from "./TopicMenu";
import theme from "../../themes/default";

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

describe("TopicMenu", () => {
  it("renders the topic name and not layers when topic is not active", () => {
    const store = global.mockStore({
      map: { layers: [layer1, layer2] },
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        menuOpen: true,
        activeTopic: {},
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <TopicMenu topic={{ name: "topicName", key: "topic" }} />
        </Provider>
      </ThemeProvider>,
    );
    expect(screen.getByText("topicName")).toBeInTheDocument();
    expect(screen.queryByText("parent1")).toBe(null);
    expect(screen.queryByText("child")).toBe(null);
    expect(screen.queryByText("layer2")).toBe(null);
  });

  it("renders the topic's layers name when topic is active", () => {
    const topic = { name: "topicName", key: "topic" };
    const store = global.mockStore({
      map: {
        layers: [layer1, layer2],
      },
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        menuOpen: true,
        activeTopic: topic,
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <TopicMenu topic={topic} />
        </Provider>
      </ThemeProvider>,
    );
    // Test important operator
    expect(screen.getByText("parent1")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(screen.getByText("layer2")).toBeInTheDocument();
    expect(screen.getByText("topicName")).toBeInTheDocument();
  });

  it("renders html <b> tag form tanslated layer's name", () => {
    global.i18n.addResourceBundle("de", "translation", {
      layerWithHtmlTagsInName: "translation <b>withhtmltags</b>",
    });
    const topic = { name: "topicName", key: "topic" };
    const layerWithHtmlTags = new Layer({
      name: "layerWithHtmlTagsInName",
    });
    const store = global.mockStore({
      map: {
        layers: [layerWithHtmlTags],
      },
      app: {
        i18n: global.i18n,
        t: global.i18n.t,
        menuOpen: true,
        activeTopic: topic,
      },
    });
    render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <TopicMenu topic={topic} />
        </Provider>
      </ThemeProvider>,
    );
    expect(screen.getByText("withhtmltags").nodeName).toBe("B");
  });
});
