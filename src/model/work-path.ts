import { Duration } from "../core/duration";
import { Task } from "./task";
import { TaskEvent } from "./task-event";

export class WorkPath {
  private name = "L";
  private path: (Task | TaskEvent)[] = [];
  private duration = Duration.Empty();
  constructor() {}

  public updateLength() {
    let duration = Duration.Empty();
    for (const item of this.path) {
      if (item instanceof TaskEvent) {
        continue;
      }
      duration = duration.sum(item.getDuration());
    }

    this.duration = duration;
  }

  toString(): string {
    return  this.getName() + ' = ' + this.duration.value + ' >> ' + this.path.map((r) => r.toString()).join(" ");
  }

  public length(): Duration {
    return this.duration;
  }

  public updateEarlyDeadline(): void {
    let time = Duration.Empty();
    for (const item of this.path) {
      if (item instanceof Task) {
        time = time.sum(item.getDuration());
      }
      if (item instanceof TaskEvent) {
        if (!item.getEarlyDeadline()) {
          item.setEarlyDeadline(time);
        } else if (item.getEarlyDeadline()!.gt(time)) {
          break;
        } else {
          item.setEarlyDeadline(time);
        }
      }
    }
  }

  public updateLateDeadline(): void {
    const reversedPathes = [...this.path].reverse();
    let time = (reversedPathes[0] as TaskEvent).getEarlyDeadline()!;

    for (const item of reversedPathes) {
      if (item instanceof Task) {
        time = time.minus(item.getDuration());
      }
      if (item instanceof TaskEvent) {
        if (!item.getLateDeadline()) {
          item.setLateDeadline(time);
        } else if (item.getLateDeadline()!.lt(time)) {
          break;
        } else {
          item.setLateDeadline(time);
        }
      }
    }
  }

  getName(): string {
    return this.name;
  }

  setName(number: number): this {
    this.name = `L${number}`;
    return this;
  }

  add(task: Task | TaskEvent): void {
    this.path.push(task);
  }

  clone() {
    const path = new WorkPath();
    path.path = [...this.path];
    return path;
  }
}
