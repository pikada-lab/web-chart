import { Duration } from "../../lib/duration";

export interface Work<T> {
  getDuration(): Duration;
  toJSON(): T;
}
