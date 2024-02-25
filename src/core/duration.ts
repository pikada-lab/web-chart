import { Result } from "./result";
import { ValueObject } from "./value-object";

/**
 * Продолжительность во времени
 */
export class Duration extends ValueObject<string> {
  public static Create(value: any): Result<Duration> {
    if (typeof value !== "string" && typeof value !== "number") {
      return Result.failure("Значение должно быть строкой или числом"); // Задайте ограничения
    }
    if (typeof value === "number") {
      value = value + "m";
    }
    value = value.trim().toLowerCase(); // Задайте трансформации
    const part = value.split(/\s+/) as string[];
    if (!part.every((m) => /(\d+(\.\d+)?[mh])/.test(m))) {
      return Result.failure("Неверный формат времени, поддерживается m, h");
    }

    const index = part
      .map((r) => r.replace(/\d+/, ""))
      .reduce((acc, part) => {
        if (!acc.has(part)) {
          acc.set(part, 1);
        } else {
          acc.set(part, acc.get(part)! + 1);
        }
        return acc;
      }, new Map<string, number>());

    if ([...index.values()].some((l) => l > 1)) {
      return Result.failure(
        "Каждый тип временных едениц можно использовать один раз"
      );
    }

    return Result.success(new Duration(value));
  }

  static Empty(): Duration {
    return Duration.Create(0).value;
  }

  getDurationOnMinutes(): number {
    return this.value
      .split(/\s+/)
      .map((r) => {
        if (r.endsWith("m")) {
          return +r.replace("m", "");
        }
        return +r.replace("h", "") * 60;
      })
      .reduce((acc, time) => acc + time, 0);
  }

  isEmpty(): boolean {
    return this.getDurationOnMinutes() === 0;
  }

  sum(that: Duration): Duration {
    return Duration.Create(
      this.getDurationOnMinutes() + that.getDurationOnMinutes()
    ).value;
  }

  minus(that: Duration): Duration {
    return Duration.Create(
      this.getDurationOnMinutes() - that.getDurationOnMinutes()
    ).value;
  }

  division(divider: number): Result<Duration> {
    if (divider === 0) {
      return Result.failure("Деление на ноль");
    }
    return Duration.Create(this.getDurationOnMinutes() / divider);
  }

  times(time: number): Duration {
    return Duration.Create(this.getDurationOnMinutes() * time).value;
  }

  lt(time: Duration): boolean {
    return this.getDurationOnMinutes() < time.getDurationOnMinutes();
  }

  gt(time: Duration): boolean {
    return this.getDurationOnMinutes() > time.getDurationOnMinutes();
  }
}
