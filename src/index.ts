import { Duration } from "./core/duration";
import { Result } from "./core/result";

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
    return `--- ${this.getDuration().getDurationOnMinutes()} -->`;
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

  /**
   * Ранний срок свершения события
   */
  private earlyDeadline: Duration | null = null;

  /**
   * Поздний срок свершения события
   */
  private lateDeadline: Duration | null = null;

  constructor(private type: TypeEvent = TypeEvent.DEFAULT) {
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
}

export class WebChart {
  private start: TaskEvent | null = null;
  private end: TaskEvent | null = null;
  private readonly tasks: Task[] = [];
  private readonly events: TaskEvent[] = [];
  private readonly pathes: WorkPath[] = [];
  private maxLengthPath: WorkPath | null = null;

  constructor(private readonly title: string) {}

  addBulk(item: (Task | TaskEvent)[]): void {
    item.forEach((i) => this.add(i));
    this.updatePathes();
  }

  private add(item: Task | TaskEvent): void {
    if (item instanceof Task) {
      this.addTask(item);
      return;
    }
    if (item instanceof TaskEvent) {
      this.addEvent(item);
      return;
    }
  }

  /**
   * Получить Путь максимальной продолжительности
   *
   * > Критический путь сетевого графика
   */
  getMaxLengthPath(): WorkPath | null {
    return this.maxLengthPath;
  }

  private updatePathes(): void {
    const pathesResult = this.check().map(() =>
      this.createPathes(new WorkPath(), this.start!).map((l, i) =>
        l.setName(i + 1)
      )
    );
    this.pathes.length = 0;
    if (pathesResult.isFailure) {
      return;
    }
    this.pathes.splice(0, 0, ...pathesResult.value);
    this.updatePathesLength();
    this.updateMaxLengthPath();
    this.updateEarlyDeadline();
  }

  private updatePathesLength(): void {
    this.pathes.forEach((path) => path.updateLength());
  }

  private addTask(task: Task): void {
    this.tasks.push(task);
  }

  private addEvent(event: TaskEvent): void {
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

  check(): Result<this> {
    if (!this.start) {
      return Result.failure("Нет начала сетевого графика");
    }
    if (!this.end) {
      return Result.failure("Нет окончания сетевого графика");
    }
    const unique = new Set();
    let node: TaskEvent | Task | null = this.start;
    while (true) {
      if (node instanceof TaskEvent && node.isEnd()) {
        break;
      }
      if (!node) {
        return Result.failure("Начало не связанно с окончанием");
      }
      node = node.next();
      if (unique.has(node)) {
        return Result.failure("Есть замкнутый контур");
      }
      unique.add(node);
    }
    for (let event of this.events) {
      if (event.isDefault()) {
        if (event.next() === null) {
          return Result.failure("Есть тупиковое событие " + event.getId());
        }
        if (event.prev() === null) {
          return Result.failure("Есть хвостовое событие");
        }
      }
    }
    return Result.success(this);
  }

  getStart(): TaskEvent | null {
    return this.start;
  }

  getEnd(): TaskEvent | null {
    return this.end;
  }

  getPathes(): Result<WorkPath[]> {
    return Result.success(this.pathes);
  }

  private updateMaxLengthPath(): void {
    if (this.pathes.length === 0) {
      return;
    }
    this.maxLengthPath = [...this.pathes].sort((a, b) =>
      a.length().lt(b.length()) ? 1 : -1
    )[0];
  }

  private createPathes(path: WorkPath, node: Task | TaskEvent): WorkPath[] {
    if (node instanceof Task) {
      // Применение ветвей
      path.add(node);
      return this.createPathes(path, node.next()!);
    }
    if (node instanceof TaskEvent) {
      path.add(node);
      const pathes: WorkPath[] = [];
      const nodes = node.nextItems();
      // Отсутствие ветвления
      if (nodes.length === 0) {
        return [path];
      }
      // Расхождение ветвей
      for (let i = 0; i < nodes.length; i++) {
        const nextNode = nodes[i];
        const clonePath = path.clone();
        pathes.push(...this.createPathes(clonePath, nextNode));
        continue;
      }
      return pathes;
    }
    throw new Error("Неверное определение типа");
  }

  private updateEarlyDeadline(): void {
    for (const path of this.pathes) {
      path.updateEarlyDeadline();
    }
    for (const path of this.pathes) {
      path.updateLateDeadline();
    }
  }
}

export class WorkPath {
  private name = "L";
  private path: (Task | TaskEvent)[] = [];
  private duration = Duration.Empty();
  constructor() {}

  public updateLength() {
    let duration = Duration.Empty();
    for (const item of this.path) {
      if (item instanceof TaskEvent) {
        continue;
      }
      duration = duration.sum(item.getDuration());
    }

    this.duration = duration;
  }

  toString(): string {
    return this.path.map((r) => r.toString()).join(" ");
  }

  public length(): Duration {
    return this.duration;
  }

  public updateEarlyDeadline(): void {
    let time = Duration.Empty();
    for (const item of this.path) {
      if (item instanceof Task) {
        time = time.sum(item.getDuration());
      }
      if (item instanceof TaskEvent) {
        if (!item.getEarlyDeadline()) {
          item.setEarlyDeadline(time);
        } else if (item.getEarlyDeadline()!.gt(time)) {
          break;
        } else {
          item.setEarlyDeadline(time);
        }
      }
    }
  }

  public updateLateDeadline(): void {
    const reversedPathes = [...this.path].reverse();
    let time = (reversedPathes[0] as TaskEvent).getEarlyDeadline()!;

    for (const item of reversedPathes) {
      if (item instanceof Task) {
        time = time.minus(item.getDuration());
      }
      if (item instanceof TaskEvent) {
        if (!item.getLateDeadline()) {
          item.setLateDeadline(time);
        } else if (item.getLateDeadline()!.lt(time)) {
          break;
        } else {
          item.setLateDeadline(time);
        }
      }
    }
  }

  getName(): string {
    return this.name;
  }

  setName(number: number): this {
    this.name = `L${number}`;
    return this;
  }

  add(task: Task | TaskEvent): void {
    this.path.push(task);
  }

  clone() {
    const path = new WorkPath();
    path.path = [...this.path];
    return path;
  }
}
