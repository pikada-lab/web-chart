import { Duration } from "../../lib/duration";
import { Result } from "../../lib/result";
import { ValueObject } from "../../lib/value-object";

import { WorkType } from ".";
import { DeterministicWorkDTO } from "./deterministic-work.dto";
import { Work } from "./work";

export class DeterministicWork
  extends ValueObject<Duration>
  implements Work<DeterministicWorkDTO>
{
  /**
   * Установить детерминированную продолжительность
   *
   * Продолжительность согласно нормативам
   */
  static Create(duration: Duration): Result<Work<DeterministicWorkDTO>> {
    if (duration.isEmpty()) {
      return Result.failure(
        "Детерменированная работа не может быть равна нулю"
      );
    }
    const work = new DeterministicWork(duration);
    return Result.success(work);
  }

  static Restore(
    dto: DeterministicWorkDTO
  ): Result<Work<DeterministicWorkDTO>> {
    const normal = Duration.Create(dto.normal);
    if (normal.isFailure) {
      return Result.reFailure(normal);
    }
    return DeterministicWork.Create(normal.value);
  }

  getDuration(): Duration {
    return this.value;
  }

  valueOf(): number {
    return this.value.getDurationOnMinutes();
  }

  toJSON(): DeterministicWorkDTO {
    return {
      type: WorkType.DETERMINISTIC,
      normal: this.value.value,
    };
  }
}
