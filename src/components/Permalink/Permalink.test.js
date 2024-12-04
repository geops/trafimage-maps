import React, { act } from "react";

import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { Layer } from "mobility-toolbox-js/ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Map, View } from "ol";
import OLLayer from "ol/layer/Layer";
import fetchMock from "fetch-mock";
import Permalink from "./Permalink";

describe("Permalink", () => {
  let store;
  let drawLayer;

  beforeEach(() => {
    drawLayer = new Layer({
      name: "test",
      olLayer: new OLLayer({ source: new VectorSource() }),
      properties: {
        description: "description<br/>break",
      },
    });
    store = global.mockStore({
      map: {
        drawLayer,
        layers: [
          new Layer({
            name: "testLayer",
            olLayer: new VectorLayer({
              source: new VectorSource(),
            }),
          }),
        ],
      },
      app: {
        drawUrl: "http://drawfoo.ch/",
        language: "de",
        activeTopic: {
          key: "topic",
          name: "topic name",
          projection: "EPSG:3857",
        },
        map: new Map({ view: new View({}) }),
      },
    });
  });

  test("shoud initialize Permalink with layerService.", () => {
    expect(window.location.search).toEqual("");
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
  });

  test("shoud remove space from 'tripNumber' Tracker filter.", () => {
    window.history.pushState(
      {},
      undefined,
      "/?lang=de&tripNumber=150, 200, 300",
    );
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
    expect(window.location.search).toMatch("tripNumber=150,200,300");
  });

  test("shoud remove space from 'publishedLineName' Tracker filter.", () => {
    window.history.pushState(
      {},
      undefined,
      "/?lang=de&publishedLineName=2068, 3003 ",
    );
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
    expect(window.location.search).toMatch("publishedLineName=2068,3003");
  });

  test("shoud use x,y in mercator.", () => {
    window.history.pushState({}, undefined, "/?x=6456530&y=-7170156 ");
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toMatch("x=6456530&y=-7170156");
    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
    expect(store.getActions()[0]).toEqual({
      data: [6456530, -7170156],
      type: "SET_CENTER",
    });
  });

  test("shoud transform lon,lat to mercator.", () => {
    window.history.pushState({}, undefined, "/?lon=58&lat=-54 ");
    render(
      <Provider store={store}>
        <Permalink />
      </Provider>,
    );

    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
    expect(store.getActions()[0]).toEqual({
      data: [6456530.466009867, -7170156.29399995],
      type: "SET_CENTER",
    });
  });

  describe("shoud load kml if draw.id exists", () => {
    test("if it is a file_id.", async () => {
      window.history.pushState({}, undefined, "/?lang=de&draw.id=quu");
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(0);
      await act(async () => {
        fetchMock.once("http://drawfoo.ch/quu/?format=kml", global.sampleKml);
        render(
          <Provider store={store}>
            <Permalink />
          </Provider>,
        );
      });
      expect(window.location.search).toMatch("lang=de");
      expect(window.location.search).toMatch("draw.id=quu");
      expect(window.location.search).toMatch("layers=testLayer");
      expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(1);
      expect(store.getActions().pop()).toEqual({
        data: {
          file_id: "quu",
        },
        type: "SET_DRAW_IDS",
      });
      fetchMock.restore();
    });
  });

  test("shoud load kml if wkp.draw exists", async () => {
    window.history.pushState({}, undefined, "/?lang=de&wkp.draw=quu");
    expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(0);
    await act(async () => {
      fetchMock.once("http://drawfoo.ch/quu/?format=kml", global.sampleKml);
      render(
        <Provider store={store}>
          <Permalink />
        </Provider>,
      );
    });
    expect(window.location.search).toMatch("draw.id=quu");
    expect(window.location.search).toMatch("lang=de");
    expect(window.location.search).toMatch("layers=testLayer");
    expect(drawLayer.olLayer.getSource().getFeatures().length).toEqual(1);
    expect(store.getActions().pop()).toEqual({
      data: {
        file_id: "quu",
      },
      type: "SET_DRAW_IDS",
    });
    fetchMock.restore();
  });

  test("shoud not update the permalink.", () => {
    window.history.pushState({}, undefined, "/?lang=de&tripNumber=150,200,300");
    render(
      <Provider store={store}>
        <Permalink readOnly />
      </Provider>,
    );

    expect(window.location.search).toMatch("lang=de&tripNumber=150,200,300");
  });
});
