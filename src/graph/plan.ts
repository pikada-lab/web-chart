import { EventShape } from "../drawer/shapes/event.shape";
import { FrameShape } from "../drawer/shapes/frame.shape";
import { Shape } from "../drawer/shapes/shape";
import { TaskShape } from "../drawer/shapes/task.shape";
import { Point } from "../geometry/point.geo";
import { StandardCalendar } from "../model/calendar/standard-calendar";
import { WebChart } from "../model/web-chart";

export class Plan {
  private id: number = 1;
  private events = new Map<string, Map<number, EventShape>>();
  private shapes: Shape[] = [];
  private frame: FrameShape[] = [];
  private canvasSize = 1920;
  private framePadding = 10;
  private frameHeight = 80;
  private frameGap = 0;
  private pathPadding = 50;

  constructor(private readonly web: WebChart) {
    let pathY = 0;

    const max = (this.canvasSize - 2* this.framePadding - 2 * this.pathPadding) / this.web.getMaxLengthPath()!.length().getDurationOnMinutes();
    for (let path of this.web.getPathes().value) { 
      this.events.set(path.getName(), new Map());
      const frame = new FrameShape(
        new Point(this.framePadding, this.framePadding + pathY),
        new Point(this.canvasSize - 2 * this.framePadding, this.framePadding + this.frameHeight + pathY),
      );
      frame.setText(
        path.getName() +
          ", Трудозатраты: " +
          path.length().value +
          " " +
          (web.getMaxLengthPath() === path ? " [Критический путь]" : ""),
      );

      for (const e of path.getEvents()) {
        // e.getEarlyDeadline()!.getDurationOnMinutes() * 0.015
        const shape = new EventShape(
          e,
          new Point(
            this.pathPadding + e.getEarlyDeadline()!.getDurationOnMinutes() * max,
            this.framePadding + Math.round(this.frameHeight / 2) + pathY,
          ),
        );
        shape.setRadius(12);
        this.events.get(path.getName())!.set(e.getId(), shape);
        this.shapes.push(shape);
      }
      for (let t of path.getTasks()) {
        const start = this.events.get(path.getName())!.get(t.prev()!.getId());
        const end = this.events.get(path.getName())!.get(t.next()!.getId());
        if (start && end) {
          this.shapes.push(new TaskShape(t, start, end));
        }
      }
      this.frame.push(frame);
      this.shapes.push(frame);
      pathY += this.frameHeight + this.frameGap;
    }

    const plan = this.web.getListOfWork(new Date(), new StandardCalendar())
    console.table(plan);
  }

  getShapes(): Shape[] {
    return this.shapes;
  }
}
