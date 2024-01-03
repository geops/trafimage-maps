import { Style } from "ol/style";

export const createPointStyleRenderer =
  (dynamicStyleMapping = null) =>
  (coordinates, state) => {
    if (coordinates.length !== 2 || Array.isArray(coordinates[0])) {
      return;
    }
    let [x, y] = coordinates;
    const pixelRatio = state.pixelRatio || 1;
    const { resolution } = state;
    let radius = 20 * pixelRatio;
    if (dynamicStyleMapping?.length) {
      /** The dynamic style mapping updates the radius and
       * offsets of the highlight depending on the resolution
       * */
      const currentStyleState = dynamicStyleMapping
        .filter((styleState) => styleState.resolution > resolution)
        .find(
          (styleState, index, arr) =>
            styleState.resolution === Math.min(...arr.map((s) => s.resolution)),
        );
      x = currentStyleState ? x + currentStyleState.offsetX : x;
      y = currentStyleState ? y + currentStyleState.offsetY : y;
      radius = currentStyleState ? currentStyleState.radius : radius;
      // console.log(resolution, currentStyleState);
      // console.log(
      //   resolution,
      //   dynamicStyleMapping.filter(
      //     (styleState) => styleState.resolution > resolution,
      //   ),
      //   currentStyleState,
      // );
    }
    const radiusWithPixelRatio = radius * pixelRatio;
    const ctx = state.context;
    const innerRadius = 0;
    const outerRadius = radiusWithPixelRatio * 1.4;
    const gradient = ctx.createRadialGradient(
      x,
      y,
      innerRadius,
      x,
      y,
      outerRadius,
    );
    gradient.addColorStop(0, "rgba(235,0,0,0)");
    gradient.addColorStop(0.2, "rgba(235,0,0,0)");
    gradient.addColorStop(0.6, "rgba(235,0,0,0.4)");
    gradient.addColorStop(0.8, "rgba(235,0,0,0.8)");
    gradient.addColorStop(1, "rgba(235,0,0,1)");
    ctx.beginPath();
    ctx.arc(x, y, radiusWithPixelRatio, 0, 2 * Math.PI, true);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.arc(x, y, radiusWithPixelRatio, 0, 2 * Math.PI, true);
    ctx.strokeStyle = "rgba(235,0,0,1)";
    ctx.lineWidth = 4 * pixelRatio;
    ctx.stroke();
  };

const style = new Style({
  renderer: createPointStyleRenderer(),
});

export default style;
