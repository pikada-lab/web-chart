import { TaskEventDTO } from "./task-event.dto";
import { TaskDTO } from "./task.dto";

export interface WebChartDTO {
    id: number;
    title: string;
    tasks: TaskDTO[];
    events: TaskEventDTO[]
}