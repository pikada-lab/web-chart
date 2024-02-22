export enum TaskType {
  HARD = 1,
  FICTION = 2,
}

/**
 * Работа
 * ---->
 */
export class Task {
  static LAST_ID = 0;
  id: number;
  // Время
  duration: number;
  // Граф
  private start: TaskEvent;
  private end: TaskEvent;
  private isConnect: boolean = false;

  get hasConnect(): boolean {
    return this.isConnect;
  }

  get key(): string {
    return `(${this.start.getId()},${this.end.getId()})`;
  }

  constructor(
    public readonly name: string,
    public readonly type: TaskType = TaskType.HARD,
  ) {
    this.id = ++Task.LAST_ID;
  }

  next(): TaskEvent | null {
    if (!this.isConnect) {
      return null;
    }
    return this.end;
  }

  connect(start: TaskEvent, end: TaskEvent): boolean {
    if (this.isConnect) {
      return false;
    }
    if (start.isEnd()) {
      return false;
    }
    if (end.isStart()) {
      return false;
    }
    this.start = start;
    start.setOutput(this);
    this.end = end;
    end.setInput(this);
    this.isConnect = true;
    return true;
  }
}

export enum TypeEvent {
  START = 1,
  DEFAULT = 2,
  END = 3,
}

/**
 * Событие
 * (1)
 */
export class TaskEvent {
  static LAST_ID = 0;
  private id: number;
  private readonly input: Task[] = [];
  private readonly output: Task[] = [];

  constructor(private type: TypeEvent = TypeEvent.DEFAULT) {
    this.id = ++TaskEvent.LAST_ID;
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
}

export class WebChart {
  private start: TaskEvent | null = null;
  private end: TaskEvent | null = null;
  private readonly tasks: Task[] = [];
  private readonly events: TaskEvent[] = [];

  constructor(private readonly title: string) {}

  addTask(task: Task): void {
    this.tasks.push(task);
  }

  addEvent(event: TaskEvent): void {
    if (event.isStart()) {
      if (this.start) {
        return;
      }
      this.start = event;
    }
    if (event.isEnd()) {
      if (this.end) {
        return;
      }
      this.end = event;
    }
    this.events.push(event);
  }

  check(debug = false): boolean {
    if (!this.start) {
      if (debug) {
        console.log("Нет начала");
      }
      return false;
    }
    if (!this.end) {
      if (debug) {
        console.log("Нет окончания");
      }
      return false;
    }
    const unique = new Set();
    let node: TaskEvent | Task | null = this.start;
    while (true) {
      if (node instanceof TaskEvent && node.isEnd()) {
        break;
      }
      if (!node) {
        if (debug) {
          console.log("Начало не связанно с окончанием");
        }
        return false;
      }
      node = node.next();
      if (unique.has(node)) {
        if (debug) {
          console.log("Есть замкнутый контур");
        }
        return false;
      }
      unique.add(node);
    }
    for (let event of this.events) {
      if (event.isDefault()) {
        if (event.next() === null) {
          if (debug) {
            console.log("Есть тупиковое событие");
          }
          return false;
        }
        if (event.prev() === null) {
          if (debug) {
            console.log("Есть хвостовое событие");
          }
          return false;
        }
      }
    }
    if (debug) {
      console.log("Корректный сетевой график");
    }
    return true;
  }

  getStart(): TaskEvent | null {
    return this.start;
  }

  getEnd(): TaskEvent | null {
    return this.end;
  }
}
