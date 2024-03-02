import { Circle } from "../../lib/geometry/circle.geo";
import { Line } from "../../lib/geometry/line.geo";
import { Point } from "../../lib/geometry/point.geo";
import { TaskEvent } from "../../model/task-event/task-event";
import { Drawer } from "../drawer";
import { Dragable, Selectable, Shape } from "./shape";

export class EventShape implements Shape, Selectable, Dragable {
  private isSelect: boolean = false;
  private radius = 20;
  private offset: Point = Point.empty();
  private contur = new Circle(this.point, this.radius);

  constructor(
    private event: TaskEvent,
    private point: Point,
  ) {}

  drag(point: Point): void {
    this.offset = point;
  }

  setRadius(r: number): void {
    this.radius = r;
    this.contur = new Circle(this.point, this.radius);
  }

  drop(point: Point): void {
    this.offset = Point.empty();
    const end = this.point.offset(point);
    end.x = Math.round(end.X / 20) * 20;
    end.y = Math.round(end.Y / 20) * 20;
    this.move(end);
  }

  intersect(point: Point): boolean {
    return this.contur.hasPoint(point);
  }

  select(isSelect: boolean): void {
    this.isSelect = isSelect;
  }

  move(point: Point): void {
    this.point = point;
    this.contur = new Circle(this.point, this.radius);
  }

  getPosition(): Point {
    return this.point.offset(this.offset);
  }

  getRadius(): number {
    return this.radius;
  }

  getEvent(): TaskEvent {
    return this.event;
  }

  draw(drawer: Drawer): void {
    const center = this.point.offset(this.offset);

    const placeholderCircle = new Point(
      Math.round(center.X / 20) * 20,
      Math.round(center.Y / 20) * 20,
    );

    const line = new Line(this.point, placeholderCircle);
    if (line.getLength() > this.radius * 2) {
      const placeholderLine = new Line(
        line.createPointOnLineStart(-this.radius),
        line.createPointOnLineEnd(-this.radius),
      );
      drawer.line(placeholderLine, { arrowEnd: true, borderColor: "#ccc" });
      drawer.circle(this.point, this.radius, { borderColor: "#ccc" });

      drawer.circle(placeholderCircle, this.radius, { borderColor: "#ccc" });
    }
    drawer.circle(center, this.radius, {});
    drawer.text(`${this.event.getId()}`, center, 0, {
      fontSize: this.radius - 2,
    });
    if (this.isSelect) {
      drawer.circle(center, this.radius - 4, { dashed: true });
    }
  }
}
