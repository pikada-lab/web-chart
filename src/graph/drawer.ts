import { Task } from "../model/task";
import { TaskEvent } from "../model/task-event";
import { Plan } from "./plan";

export interface Drawer {
  clear(): void;
  drawTask(plan: Plan, t: Task): void;
  drawEvent(plan: Plan, e: TaskEvent): void;
}
