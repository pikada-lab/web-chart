import { WorkType } from ".";

export interface ProbabilisticWorkDTO {
  type: WorkType.PROBABILISTIC;
  min: string;
  max: string;
  real: string;
}
