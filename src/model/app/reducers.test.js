import DragPan from "ol/interaction/DragPan";
import DblClickDragZoom from "../../ol/interaction/DblClickDragZoom";
import DblPointerClickZoomOut from "../../ol/interaction/DblPointerClickZoomOut";
import { setActiveTopic, setVectorTilesUrl } from "./actions";
import app from "./reducers";

describe("reducers", () => {
  test("set menuOpen property to false by default", () => {
    const { menuOpen } = app(undefined, {});
    expect(menuOpen).toBe(false);
  });

  test("set menuOpen property to false if mapset has opened the page", () => {
    const originalReferrer = document.referrer;
    Object.defineProperty(document, "referrer", {
      value: "mapset",
      configurable: true,
    });
    expect(app(undefined, {}).menuOpen).toBe(true);
    Object.defineProperty(document, "referrer", {
      value: originalReferrer,
    });
  });

  test("DblPointerClickZoomOut is put at the beginning", () => {
    const { map } = app(undefined, {});
    const interactions = map.getInteractions().getArray();
    const index = interactions.findIndex(
      (interaction) => interaction instanceof DblPointerClickZoomOut,
    );
    expect(index).toBe(0);
  });

  test("DblClikDragZoom is put just after DragPan interaction", () => {
    const { map } = app(undefined, {});
    const interactions = map.getInteractions().getArray();
    const indexDragPan = interactions.findIndex(
      (interaction) => interaction instanceof DragPan,
    );
    const indexDragZoom = interactions.findIndex(
      (interaction) => interaction instanceof DblClickDragZoom,
    );
    expect(indexDragPan + 1).toBe(indexDragZoom);
  });

  test("uses topic vectorTilesUrl override when active topic changes", () => {
    const stateWithDefaultTilesUrl = app(
      undefined,
      setVectorTilesUrl("https://default-tiles.example"),
    );

    const stateWithTopicOverride = app(
      stateWithDefaultTilesUrl,
      setActiveTopic({
        key: "topic-with-override",
        vectorTilesUrl: "https://topic-tiles.example",
      }),
    );

    expect(stateWithTopicOverride.defaultVectorTilesUrl).toBe(
      "https://default-tiles.example",
    );
    expect(stateWithTopicOverride.vectorTilesUrl).toBe(
      "https://topic-tiles.example",
    );
  });

  test("falls back to default vectorTilesUrl when topic has no override", () => {
    const stateWithDefaultTilesUrl = app(
      undefined,
      setVectorTilesUrl("https://default-tiles.example"),
    );
    const stateWithTopicOverride = app(
      stateWithDefaultTilesUrl,
      setActiveTopic({
        key: "topic-with-override",
        vectorTilesUrl: "https://topic-tiles.example",
      }),
    );

    const stateWithoutTopicOverride = app(
      stateWithTopicOverride,
      setActiveTopic({ key: "topic-without-override" }),
    );

    expect(stateWithoutTopicOverride.vectorTilesUrl).toBe(
      "https://default-tiles.example",
    );
  });
});
