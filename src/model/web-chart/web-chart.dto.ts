import { TaskEventDTO } from "../task-event/task-event.dto";
import { TaskDTO } from "../task/task.dto";

export interface WebChartDTO {
  id: number;
  title: string;
  tasks: TaskDTO[];
  events: TaskEventDTO[];
}
