import { DeterministicWorkDTO } from "./deterministic-work";
import { NotSetWorkDTO } from "./not-set-work";
import { ProbabilisticWorkDTO } from "./probabilistic-work";
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
  work: DeterministicWorkDTO | ProbabilisticWorkDTO | NotSetWorkDTO;
}
