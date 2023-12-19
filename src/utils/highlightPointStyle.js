import { Style } from "ol/style";

const style = new Style({
  renderer(coordinates, state) {
    if (coordinates.length !== 2 || Array.isArray(coordinates[0])) {
      return;
    }
    const pixelRatio = state.pixelRatio || 1;
    const [x, y] = coordinates;
    const ctx = state.context;
    const radius = 20 * pixelRatio;
    const innerRadius = 0;
    const outerRadius = radius * 1.4;
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
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = "rgba(235,0,0,1)";
    ctx.lineWidth = 4 * pixelRatio;
    ctx.stroke();
  },
});

export default style;
