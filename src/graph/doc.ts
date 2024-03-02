import { EventShape } from "../drawer/shapes/event.shape";
import { Shape } from "../drawer/shapes/shape";
import { TaskShape } from "../drawer/shapes/task.shape";
import { Point } from "../lib/geometry/point.geo";
import { Result } from "../lib/result";
import { Task } from "../model/task/task";
import { TaskEvent } from "../model/task-event/task-event";
import { WebChart } from "../model/web-chart/web-chart";
import { DocDTO } from "./doc.dto";

export class Doc {
  private id: number = 0;
  private events = new Map<number, EventShape>();
  private shapes: Shape[] = [];
  constructor(private readonly web: WebChart) {
    let i = 0;
    let j = 0;
    for (let e of this.web.getEvents()) {
      const shape = new EventShape(e, new Point(100 + i * 80, 100 + j * 80));
      this.events.set(e.getId(), shape);
      this.shapes.push(shape);
      i++;
      if (i > 10) {
        i = 0;
        j++;
      }
    }

    for (let t of this.web.getTask()) {
      const start = this.events.get(t.prev()!.getId());
      const end = this.events.get(t.next()!.getId());
      if (start && end) {
        this.shapes.push(new TaskShape(t, start, end));
      }
    }
  }

  addEvent(name: string): void {
    const e = new TaskEvent();
    console.log(e);
    this.web.addBulk([e]);
    const shape = new EventShape(e, new Point(100,100));
    this.shapes.push(shape);
    this.events.set(e.getId(), shape);
  }
  /*
  auto(): void {
    if (!this.web.check()) {
      return;
    }
    const start = this.web.getStart();
    this.events.set(
      start!.getId(),
      new EventShape(start!, new Point(100, 400)),
    );
    this.autoDefault(
      start!.nextItems()!.map((r) => r.next()!),
      400,
      1,
    );
  }

  private autoDefault(events: TaskEvent[], line: number, step: number): void {
    const l = events.length - 1;
    const gap = 100;
    const startY = -(gap * l) / 2;
    let i = 0;
    for (let e of events) {
      if (e.isEnd()) {
        this.events.set(
          e!.getId(),
          new EventShape(e!, new Point(gap + step * 100, 400)),
        );
        continue;
      }
      const ownLine = line + startY + gap * i;
      this.events.set(
        e!.getId(),
        new EventShape(e!, new Point(gap + step * 100, ownLine)),
      );
      i++;
      this.autoDefault(
        e!.nextItems()!.map((r) => r.next()!),
        ownLine,
        step + 1,
      );
    }
  }
*/

  public getEvents(): TaskEvent[] {
    return this.web.getEvents();
  }

  public getTasks(): Task[] {
    return this.web.getTask();
  }

  getShapes(): Shape[] {
    return this.shapes;
  }

  public getEvent(id: number): TaskEvent | null {
    return this.web.getEvents().find((e) => e.getId() === id) ?? null;
  }

  public static Restore(dto: DocDTO, web: WebChart): Result<Doc> {
    if (dto.webChartId !== web.getId()) {
      return Result.failure("Документ не снабжён моделью графика");
    }
    const plan = new Doc(web);
    plan.id = dto.id;
    for (let e of dto.events) {
      const id = e[0];
      plan.events.get(id)?.move(Point.from([e[1], e[2]]));
    }
    return Result.success(plan);
  }

  toJSON(): DocDTO {
    return {
      id: this.id,
      webChartId: this.web.getId(),
      events: [...this.events.entries()].map((r) => [
        r[0],
        r[1].getPosition().X,
        r[1].getPosition().Y,
      ]),
    };
  }
}
