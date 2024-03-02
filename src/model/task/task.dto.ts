import { TaskType } from "./task-type.enum";
import { WorkDTO } from "../work/index";

export interface TaskDTO {
  id: number;
  // Описательная часть
  name: string;
  type: TaskType;
  // Структурная часть, Граф
  start: number | null;
  end: number | null;
  isConnected: boolean;
  // Временные характеристики
  work: WorkDTO;
}
