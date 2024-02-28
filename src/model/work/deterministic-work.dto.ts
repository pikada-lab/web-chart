import { WorkType } from ".";

export interface DeterministicWorkDTO {
  type: WorkType.DETERMINISTIC;
  normal: string;
}
