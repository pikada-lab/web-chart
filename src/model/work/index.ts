import { DeterministicWorkDTO } from "./deterministic-work.dto";
import { NotSetWorkDTO } from "./not-set-work.dto";
import { ProbabilisticWorkDTO } from "./probabilistic-work.dto";

export type WorkDTO =
  | DeterministicWorkDTO
  | ProbabilisticWorkDTO
  | NotSetWorkDTO;

export enum WorkType {
  NOT_SET = 0,
  DETERMINISTIC = 1,
  PROBABILISTIC = 2,
}
