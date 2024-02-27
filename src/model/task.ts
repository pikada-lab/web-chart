import { TaskEvent } from "./task-event";
import { Duration } from "../lib/duration";
import { Result } from "../lib/result";
import { TaskType } from "./task-type.enum";
import { TaskDTO } from "./task.dto";
import { Work } from "./work";
import { WorkDTO, WorkType } from "./work.type";
import { ProbabilisticWork } from "./probabilistic-work";
import { NotSetWork } from "./not-set-work";
import { DeterministicWork } from "./deterministic-work";

/**
 * Работа
 * ---->
 */
export class Task {
  static LAST_ID = 0;
  id: number;
  // Время
  private work: Work<WorkDTO> = NotSetWork.Create().value;

  // Граф
  private start: TaskEvent | null = null;
  private end: TaskEvent | null = null;
  private isConnected: boolean = false;

  /**
   * Имеет продолжительность
   */
  get hasDuration(): boolean {
    return this.work.valueOf() !== 0;
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
   * Установить детерминированную продолжительность работы
   * Установить вероятностную продолжительность работы
   * Установить отсутствие оценки времени работы
   */
  setWork(work: Work<WorkDTO>): this {
    this.work = work;
    return this;
  }

  toString() {
    return `--- ${this.getDuration().value} -->`;
  }

  /**
   * Конечная продолжительность
   */
  getDuration(): Duration {
    if (!this.hasDuration) {
      return Duration.Empty();
    }
    return this.work.getDuration()!;
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
        .minus(this.work.getDuration()!)
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
        .minus(this.work.getDuration()!)
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
    const work = this.restoreWork(dto);
    if (work.isFailure) {
      return Result.reFailure(work);
    }
    task.setWork(work.value);
    return Result.success(task);
  }

  private static restoreWork(dto: TaskDTO): Result<Work<WorkDTO>> {
    if (dto.work.type === WorkType.DETERMINISTIC) {
      return DeterministicWork.Restore(dto.work);
    } else if (dto.work.type === WorkType.PROBABILISTIC) {
      return ProbabilisticWork.Restore(dto.work);
    }
    return NotSetWork.Create();
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
      work: this.work.toJSON(),
    };
  }
}
