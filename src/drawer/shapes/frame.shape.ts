import { Point } from "../../lib/geometry/point.geo";
import { Drawer } from "../drawer";
import { Shape } from "./shape";

export class FrameShape implements Shape {
  private text: string = "";
  constructor(
    private point1: Point = new Point(10, 10),
    private point2: Point = new Point(1600, 800),
  ) {}

  setText(text: string): void {
    this.text = text;
  }

  move(point: Point): void {}

  draw(drawer: Drawer): void {
    drawer.rectangle(this.point1, this.point2, { borderColor: "#000" });
    if (this.text) {
      const textPoint = this.point1.offset(Point.from([4, 10]));
      drawer.text(this.text, textPoint, 0, { align: "left" });
    }
  }
}
