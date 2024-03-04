import { Line } from "../lib/geometry/line.geo";
import { Point } from "../lib/geometry/point.geo";
import { CanvasDrawer } from "./canvas.drawer";

const drawer = new CanvasDrawer("canvas");

drawer.circle(new Point(100, 100), 20, { borderColor: "#3f0" });
drawer.circle(new Point(100, 100), 14, { dashed: true, with: 3 });
drawer.line(new Point(200, 200), new Point(300, 300), { dashed: true });
drawer.line(new Point(200, 206), new Point(300, 306), { borderColor: "#09f" });
drawer.line(new Line(new Point(200, 222), new Point(300, 322)), {
  arrowEnd: true,
  with: 3,
});
drawer.line(new Line(new Point(200, 242), new Point(300, 342)), {
  borderColor: "#f00",
  arrowEnd: true,
  dashed: true,
});

drawer.rectangle(new Point(20, 20), new Point(320, 500), {});
drawer.rectangle(new Point(16, 16), new Point(324, 504), {
  borderColor: "#888",
  with: 3,
});

drawer.text("Test draw", new Point(170, 30), 0, { color: "#ccc" });
drawer.text("Test draw", new Point(170, 50), 0, {
  fontSize: 22,
  bold: true,
  color: "#09f",
});
