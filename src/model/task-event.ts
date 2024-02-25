import { Duration } from "../core/duration";
import { Result } from "../core/result";
import { Task } from "./task";
import { TaskEventDTO } from "./task-event.dto";
import { TypeEvent } from "./type-event.enum";

/**
 * Событие
 * (1)
 */
export class TaskEvent {
  static LAST_ID = 0;
  private id: number;
  private readonly input: Task[] = [];
  private readonly output: Task[] = [];

  /**
   * Ранний срок свершения события
   */
  private earlyDeadline: Duration | null = null;

  /**
   * Поздний срок свершения события
   */
  private lateDeadline: Duration | null = null;

  constructor(private readonly type: TypeEvent = TypeEvent.DEFAULT) {
    this.id = ++TaskEvent.LAST_ID;
  }

  setLateDeadline(time: Duration): void {
    this.lateDeadline = time;
  }

  getLateDeadline(): Duration | null {
    return this.lateDeadline;
  }

  setEarlyDeadline(time: Duration): void {
    this.earlyDeadline = time;
  }

  getEarlyDeadline(): Duration | null {
    return this.earlyDeadline;
  }

  /**
   * Резерв времени для события
   */
  getReserveTime(): Result<Duration> {
    if (this.earlyDeadline === null || this.lateDeadline === null) {
      return Result.failure(
        "Резерв времени можно вычислить только после определения времени свершения каждого события"
      );
    }
    return Result.success(this.lateDeadline!.minus(this.earlyDeadline!));
  }

  nextItems(): Task[] {
    return [...this.output];
  }

  next(): Task | null {
    if (this.isEnd()) {
      return null;
    }
    if (this.output.length === 0) {
      return null;
    }
    return this.output[0];
  }

  prev(): Task | null {
    if (this.isStart()) {
      return null;
    }
    if (this.input.length === 0) {
      return null;
    }
    return this.input[0];
  }

  getId(): number {
    return this.id;
  }

  isEnd(): boolean {
    return this.type === TypeEvent.END;
  }

  isStart(): boolean {
    return this.type === TypeEvent.START;
  }

  isDefault(): boolean {
    return this.type === TypeEvent.DEFAULT;
  }

  setInput(start: Task): void {
    this.input.push(start);
  }

  setOutput(end: Task): void {
    this.output.push(end);
  }

  toString() {
    return `(${this.id})`;
  }

  canConnect(end: TaskEvent): boolean {
    if (this.output.length === 0) {
      return true;
    }

    for (const task of this.output) {
      if (task.next() === end) {
        return false;
      }
    }

    return true;
  }

  static Restore(dto: TaskEventDTO): Result<TaskEvent> {
    if (!dto) {
      return Result.failure("Нет структуры данных для создания события");
    }
    const event = new TaskEvent(dto.type);
    event.id = dto.id;
    return Result.success(event);
  }

  toJSON(): TaskEventDTO {
    return {
      id: this.id,
      input: this.input.map((r) => r.id),
      output: this.output.map((r) => r.id),
      type: this.type,
    };
  }
}
