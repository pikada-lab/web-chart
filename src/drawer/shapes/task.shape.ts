import { Line } from "../../lib/geometry/line.geo";
import { Point } from "../../lib/geometry/point.geo";
import { Task } from "../../model/task/task";
import { Drawer } from "../drawer";
import { EventShape } from "./event.shape";
import { Selectable, Shape } from "./shape";

export class TaskShape implements Shape, Selectable {
  private isSelect: boolean = false;
  constructor(
    private readonly task: Task,
    private readonly start: EventShape,
    private readonly end: EventShape,
  ) {}

  select(isSelect: boolean): void {
    this.isSelect = isSelect;
  }

  intersect(point: Point): boolean {
    const p1 = this.start.getPosition();
    const r1 = this.start.getRadius();
    const p2 = this.end.getPosition();
    const r2 = this.end.getRadius();
    const line = new Line(p1, p2);
    const endLine = new Line(
      line.createPointOnLineStart(-r1),
      line.createPointOnLineEnd(-r2),
    );
    const CF = endLine.ortoProection(point);
    if (CF < 0 || CF > 1) {
      return false;
    }
    const length = new Line(
      point,
      endLine.getPointByProection(CF)!,
    ).getLength();
    return CF >= 0 && CF <= 1 && length < 10;
  }

  move(point: Point): void {}

  draw(drawer: Drawer): void {
    if (!this.task.hasConnect) {
      return;
    }
    const p1 = this.start.getPosition();
    const r1 = this.start.getRadius();
    const p2 = this.end.getPosition();
    const r2 = this.end.getRadius();
    const line = new Line(p1, p2);
    const endLine = new Line(
      line.createPointOnLineStart(-r1),
      line.createPointOnLineEnd(-r2),
    );
    const center = line.getCenter();
    const tineMode = endLine.getLength() < 20;
    drawer.line(endLine, {
      with: 2,
      dashed: this.task.isFiction(),
      arrowEnd: !tineMode,
      borderColor: this.isSelect ? "#888" : "#000",
    });
    const halfLine = new Line(p1, center);
    let angle = -line.getAngle();
    const mirrow = angle < Math.PI / 2;
    angle = mirrow ? angle : Math.PI + angle;
    drawer.text(
      this.task.getDuration().value,
      halfLine.createProectionPointEnd(tineMode ? 15 : 12)[mirrow ? 1 : 0],
      angle,
      { fontSize: tineMode ? 12 : 18, color: this.isSelect ? "#888" : "#000" },
    );

    if (this.isSelect) {
    }
  }
}
