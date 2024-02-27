import { TaskEvent } from "./task-event";
import { Duration } from "../lib/duration";
import { Result } from "../lib/result";
import { TaskType } from "./task-type.enum";
import { TaskDTO } from "./task.dto";

/**
 * Работа
 * ---->
 */
export class Task {
  static LAST_ID = 0;
  id: number;
  // Время
  private duration: Duration | null = null;
  // Граф
  private start: TaskEvent | null = null;
  private end: TaskEvent | null = null;
  private isConnected: boolean = false;

  private min: Duration | null = null;
  private max: Duration | null = null;
  private normal: Duration | null = null;
  private real: Duration | null = null;
  /**
   * Имеет продолжительность
   */
  get hasDuration(): boolean {
    return this.duration !== null;
  }

  /**
   * Имеет соедениение в сетевом графике
   */
  get hasConnect(): boolean {
    return this.isConnected;
  }

  get key(): string {
    if (!this.start || !this.end) {
      return "(i,j)";
    }
    return `(${this.start.getId()},${this.end.getId()})`;
  }

  constructor(
    public readonly name: string,
    public readonly type: TaskType = TaskType.HARD
  ) {
    this.id = ++Task.LAST_ID;
  }

  /**
   * Установить детерминированную продолжительность
   *
   * Продолжительность согласно нормативам
   */
  setDuration(duration: Duration): void {
    if (duration.getDurationOnMinutes() < 0) {
      return;
    }
    this.normal = duration;
    this.duration = duration;
  }

  /**
   * Установить вероятностную продолжительность
   *
   * @param min - Минимальное время на выполнение работ - Соответствующую наиболее благоприятному выполнению работ
   * @param real - Наиболее вероятное время выполнения работ - которая может иметь место в реальных условиях при обычном ходе работы
   * @param max - Максимальное время выполнения работ - с учётом наихудшего стечения обстоятельств
   */
  setProbabilisticDuration(min: Duration, real: Duration, max: Duration): void {
    this.min = min;
    this.real = real;
    this.max = max;
    this.duration = min.sum(max).sum(real.times(4)).division(6).value;
  }

  toString() {
    return `--- ${this.getDuration().value} -->`;
  }

  getDuration(): Duration {
    if (!this.hasDuration) {
      return Duration.Empty();
    }
    return this.duration!;
  }

  next(): TaskEvent | null {
    if (!this.isConnected) {
      return null;
    }
    return this.end;
  }

  prev(): TaskEvent | null {
    if (!this.isConnected) {
      return null;
    }
    return this.start;
  }

  connect(start: TaskEvent, end: TaskEvent): boolean {
    if (this.isConnected) {
      return false;
    }
    if (start.isEnd()) {
      return false;
    }
    if (end.isStart()) {
      return false;
    }
    if (!start.canConnect(end)) {
      return false;
    }
    this.start = start;
    start.setOutput(this);
    this.end = end;
    end.setInput(this);
    this.isConnected = true;
    return true;
  }

  /**
   * Получить полный резерв времени
   *
   * ```
   * Rп4,8 = Tп8 - Tр4 - t4,8
   * ```
   */
  getFullTimeReserve(): Result<Duration> {
    if (!this.isConnected) {
      return Result.failure("Нет событий, работа не встроена в график");
    }
    if (!this.hasDuration) {
      return Result.failure("Нет продолжительности");
    }
    return Result.success(
      this.end!.getLateDeadline()!
        .minus(this.start!.getEarlyDeadline()!)
        .minus(this.duration!)
    );
  }

  /**
   * Получить свободный резерв времени
   *
   * ```
   * Rп4,8 = Tр8 - Tр4 - t4,8
   * ```
   */
  getFreeTimeReserve(): Result<Duration> {
    if (!this.isConnected) {
      return Result.failure("Нет событий, работа не встроена в график");
    }
    if (!this.hasDuration) {
      return Result.failure("Нет продолжительности");
    }
    return Result.success(
      this.end!.getEarlyDeadline()!
        .minus(this.start!.getEarlyDeadline()!)
        .minus(this.duration!)
    );
  }

  static Restore(dto: TaskDTO): Result<Task> {
    if (!dto.id) {
      return Result.failure("Нет идентификатора работы");
    }
    if (!dto.name) {
      return Result.failure("Нет названия работы");
    }
    const task = new Task(dto.name, dto.type);
    task.id = dto.id;
    if (dto.duration) {
      task.setDuration(Duration.Create(dto.duration).value);
    }
    if (dto.min && dto.max && dto.real) {
      task.setProbabilisticDuration(
        Duration.Create(dto.min).value,
        Duration.Create(dto.real).value,
        Duration.Create(dto.max).value
      );
    }

    return Result.success(task);
  }

  toJSON(): TaskDTO {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      // Граф
      start: this.start?.getId() ?? null,
      end: this.end?.getId() ?? null,
      isConnected: this.isConnected,
      // Временные характеристики
      duration: this.duration?.value ?? null,
      min: this.min?.value ?? null,
      max: this.max?.value ?? null,
      real: this.real?.value ?? null,
    };
  }
}
