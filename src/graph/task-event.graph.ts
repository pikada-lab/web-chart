import { Task } from "../model/task";
import { Point } from "./point";

export class TaskEventGraph {
  constructor(
    private task: Task,
    private coordinate: Point = Point.Empty(),
    private radius: number = 3
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.arc(this.coordinate.X, this.coordinate.Y, this.radius, 0, 2 * Math.PI, true);
  }
}
