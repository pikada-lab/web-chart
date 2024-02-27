import { DeterministicWorkDTO } from "./deterministic-work";
import { NotSetWorkDTO } from "./not-set-work";
import { ProbabilisticWorkDTO } from "./probabilistic-work";

export type WorkDTO =
  | DeterministicWorkDTO
  | ProbabilisticWorkDTO
  | NotSetWorkDTO;
export enum WorkType {
  NOT_SET = 0,
  DETERMINISTIC = 1,
  PROBABILISTIC = 2,
}
