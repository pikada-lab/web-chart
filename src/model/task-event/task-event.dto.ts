import { TypeEvent } from "./type-event.enum";

export interface TaskEventDTO {
  id: number;
  input: number[];
  output: number[];
  type: TypeEvent;
}
