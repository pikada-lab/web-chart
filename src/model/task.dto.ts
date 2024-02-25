import { TaskType } from "./task-type.enum";

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
  duration: string | null;
  min: string | null;
  max: string | null;
  real: string | null;
}
