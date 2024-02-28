import { Duration } from "../../lib/duration";
import { Result } from "../../lib/result";
import { ValueObject } from "../../lib/value-object"; 
import { WorkType } from ".";
import { NotSetWorkDTO } from "./not-set-work.dto";
import { Work } from "./work";
 

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
