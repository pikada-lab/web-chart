import { Work } from "./work";
import { Result } from "../lib/result";
import { ValueObject } from "../lib/value-object";
import { Duration } from "../lib/duration";
import { WorkType } from "./work.type";

export interface ProbabilisticWorkDTO {
  type: WorkType.PROBABILISTIC;
  min: string;
  max: string;
  real: string;
}

export class ProbabilisticWork
  extends ValueObject<Duration>
  implements Work<ProbabilisticWorkDTO>
{
  private min: Duration = Duration.Empty();
  private max: Duration = Duration.Empty();
  private real: Duration = Duration.Empty();

  /**
   * Установить вероятностную продолжительность
   *
   * @param min - Минимальное время на выполнение работ - Соответствующую наиболее благоприятному выполнению работ
   * @param real - Наиболее вероятное время выполнения работ - которая может иметь место в реальных условиях при обычном ходе работы
   * @param max - Максимальное время выполнения работ - с учётом наихудшего стечения обстоятельств
   */
  static Create(
    min: Duration,
    real: Duration,
    max: Duration
  ): Result<Work<ProbabilisticWorkDTO>> {
    if (min.isEmpty()) {
      return Result.failure(
        "Минимальное время работы не может быть равна нулю"
      );
    }
    if (real.isEmpty()) {
      return Result.failure(
        "Наиболее вероятное время выполнения работ не может быть равна нулю"
      );
    }
    if (max.isEmpty()) {
      return Result.failure("Максимальное время не может быть равна нулю");
    }
    if (min.gt(max)) {
      return Result.failure(
        "Минимальное время работы не может быть больше максимального"
      );
    }
    if (min.gt(real)) {
      return Result.failure(
        "Минимальное время работы не может быть больше наиболее вероятного"
      );
    }
    if (real.gt(max)) {
      return Result.failure(
        "Наиболее вероятного не может быть больше максимального времени"
      );
    }
    const duration = min.sum(max).sum(real.times(4)).division(6).value;
    const work = new ProbabilisticWork(duration);
    work.min = min;
    work.max = max;
    work.real = real;
    return Result.success(work);
  }

  static Restore(dto: ProbabilisticWorkDTO): Result<Work<ProbabilisticWorkDTO>> {
    const min = Duration.Create(dto.min);
    if (min.isFailure) {
      return Result.reFailure(min);
    }
    const max = Duration.Create(dto.max);
    if (max.isFailure) {
      return Result.reFailure(max);
    }
    const real = Duration.Create(dto.real);
    if (real.isFailure) {
      return Result.reFailure(real);
    }
    return ProbabilisticWork.Create(min.value, real.value, max.value);
  }

  getDuration(): Duration {
    return this.value;
  }

  valueOf(): number {
    return this.value.getDurationOnMinutes();
  }

  toJSON(): ProbabilisticWorkDTO {
    return {
      type: WorkType.PROBABILISTIC,
      min: this.min.value,
      max: this.max.value,
      real: this.real.value,
    };
  }
}
