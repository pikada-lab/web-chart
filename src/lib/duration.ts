import { Calendar } from "../model/calendar/calendar";
import { Result } from "./result";
import { ValueObject } from "./value-object";

/**
 * Продолжительность во времени
 *
 * минимум 1 минута (1m)
 * 1 час (1h) = 60 минут
 * 1 день (1d) = 8 час
 * 1 неделя (1w) = 7 дней
 */
export class Duration extends ValueObject<string> {
  private minutes: number = 0;
  public static Create(value: any): Result<Duration> {
    if (typeof value !== "string" && typeof value !== "number") {
      return Result.failure("Значение должно быть строкой или числом"); // Задайте ограничения
    }
    if (typeof value === "number") {
      value = value + "m";
    }
    value = value.trim().toLowerCase(); // Задайте трансформации
    const part = value.split(/\s+/) as string[];
    if (!part.every((m) => /(\d+(\.\d+)?[mwhd])/.test(m))) {
      return Result.failure(
        "Неверный формат времени, поддерживается m, h, w, d",
      );
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
        "Каждый тип временных едениц можно использовать один раз",
      );
    }
    const minutes = this.parse(value);
    const valueName = this.rename(minutes);
    const duration = new Duration(valueName);
    duration.minutes = minutes;
    return Result.success(duration);
  }

  private static rename(minutes: number): string {
    let builder = "";
    const w = minutes / (5 * 8 * 60);
    const week = Math.floor(w);
    if (week > 0) {
      builder = (builder.trim() + ` ${week}w `).trim();
    }
    let tail = w - week;
    const d = tail * 5;
    const day = Math.floor(d);
    if (day > 0) {
      builder = (builder.trim() + ` ${day}d `).trim();
    }
    tail = d - day;
    const h = tail * 8;
    const hour = Math.floor(h);
    if (hour > 0) {
      builder = (builder.trim() + ` ${hour}h `).trim();
    }
    tail = h - hour;
    const m = tail * 60;
    const mins = Math.round(m);
    if (mins > 0) {
      builder = (builder.trim() + ` ${mins}m `).trim();
    }
    return builder;
  }

  private static parse(value: string): number {
    return value
      .split(/\s+/)
      .map((r) => {
        if (r.endsWith("m")) {
          return +r.replace("m", "");
        }
        if (r.endsWith("w")) {
          return +r.replace("w", "") * 5 * 8 * 60;
        }
        if (r.endsWith("d")) {
          return +r.replace("d", "") * 8 * 60;
        }
        return +r.replace("h", "") * 60;
      })
      .reduce((acc, time) => acc + time, 0);
  }

  static Empty(): Duration {
    return Duration.Create(0).value;
  }

  getDurationOnMinutes(): number {
    return this.minutes;
  }

  isEmpty(): boolean {
    return this.getDurationOnMinutes() === 0;
  }

  sum(that: Duration): Duration {
    return Duration.Create(
      this.getDurationOnMinutes() + that.getDurationOnMinutes(),
    ).value;
  }

  minus(that: Duration): Duration {
    return Duration.Create(
      this.getDurationOnMinutes() - that.getDurationOnMinutes(),
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

  getDays() {
    return this.getMathc(/(\d+)d/);
  }

  getWeeks() {
    return this.getMathc(/(\d+)w/);
  }

  getHours() {
    return this.getMathc(/(\d+)h/);
  }

  getMinutes() {
    return this.getMathc(/(\d+)m/);
  }

  private getMathc(reg: RegExp): number {
    const result = reg.exec(this.value);
    if (!result?.[1]) {
      return 0;
    }
    return parseInt(result[1], 10);
  }
}
