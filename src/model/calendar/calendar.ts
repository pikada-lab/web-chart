import { Duration } from "../../lib/duration";

export interface Calendar {
  forward(date: Date, duration: Duration): Date;
}
