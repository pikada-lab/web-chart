import { Duration } from "../lib/duration";
import { Result } from "../lib/result";
import { ValueObject } from "../lib/value-object";
import { Work } from "./work";
import { WorkType } from "./work.type";
export interface NotSetWorkDTO {
  type: WorkType.NOT_SET;
}

export class NotSetWork
  extends ValueObject<Duration>
  implements Work<NotSetWorkDTO>
{
  private static readonly self: NotSetWork = new NotSetWork(Duration.Empty());

  static Create(): Result<Work<NotSetWorkDTO>> {
    return Result.success(NotSetWork.self);
  }

  static Restore(dto: NotSetWork): Result<Work<NotSetWorkDTO>> {
    return Result.success(NotSetWork.self);
  }

  getDuration(): Duration {
    return this.value;
  }

  valueOf(): number {
    return this.value.getDurationOnMinutes();
  }

  toJSON(): NotSetWorkDTO {
    return {
      type: WorkType.NOT_SET,
    };
  }
}
