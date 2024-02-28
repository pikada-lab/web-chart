import { Task } from "../model/task";
import { TaskEventGraph } from "./task-event.graph";

export class TaskGraph {
  constructor(
    private readonly task: Task,
    private readonly start: TaskEventGraph,
    private readonly end: TaskEventGraph
  ) {}

  draw(ctx: CanvasRenderingContext2D): void {

  }
}
