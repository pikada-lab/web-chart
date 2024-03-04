import { CanvasController } from "./canvas.controller";
import { CanvasDrawer } from "./drawer/canvas.drawer";
import { Drawer } from "./drawer/drawer";
import { SvgDrawer } from "./drawer/svg.drawer";
import { ZoomDrawer } from "./drawer/zoom.drawer";
import { Line } from "./lib/geometry/line.geo";
import { Point } from "./lib/geometry/point.geo";
import { LineController } from "./line.controller";

const drawerSvg = new SvgDrawer("svg");
var drawerCanvas = new CanvasDrawer("canvas");
const dSvg = new ZoomDrawer(drawerSvg);
const cSvg = new ZoomDrawer(drawerCanvas);
dSvg.setZoom(1.3);
cSvg.setZoom(1.3);
dSvg.setPan(Point.from([ 400, 200]))
cSvg.setPan(Point.from([ 400, 200]))

var controller = new CanvasController(dSvg);
var controller2 = new CanvasController(cSvg);
controller.test();
controller2.test();
// const drawer = new SvgDrawer("svg");
// draw(drawer);

// const drawer2 = new CanvasDrawer("canvas");
// draw(drawer2);

function draw(drawer: Drawer) {
  drawer.circle(new Point(100, 100), 20, { borderColor: "#3f0" });
  drawer.circle(new Point(100, 100), 14, { dashed: true, with: 3 });
  drawer.line(new Point(200, 200), new Point(300, 300), { dashed: true });
  drawer.line(new Point(200, 206), new Point(300, 306), {
    borderColor: "#09f",
  });
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
}
