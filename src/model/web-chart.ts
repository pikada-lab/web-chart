import { Result } from "../lib/result";
import { Calendar } from "./calendar/calendar";
import { Task } from "./task";
import { TaskEvent } from "./task-event";
import { WebChartDTO } from "./web-chart.dto";
import { WorkPath } from "./work-path";

export class WebChart {
  private start: TaskEvent | null = null;
  private end: TaskEvent | null = null;
  private readonly tasks: Task[] = [];
  private readonly events: TaskEvent[] = [];
  private readonly pathes: WorkPath[] = [];
  private maxLengthPath: WorkPath | null = null;

  constructor(
    private readonly id: number,
    private readonly title: string,
  ) {}

  getId(): number {
    return this.id;
  }

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

  getEvents(): TaskEvent[] {
    return [...this.events];
  }

  getTask(): Task[] {
    return [...this.tasks];
  }

  private creatreWorkPath(): WorkPath {
    return new WorkPath();
  }

  private updatePathes(): void {
    const pathesResult = this.check().map(() =>
      this.createPathes(this.creatreWorkPath(), this.start!).map((l, i) =>
        l.setName(i + 1),
      ),
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
      a.length().lt(b.length()) ? 1 : -1,
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

  static Restore(dto: WebChartDTO): Result<WebChart> {
    if (!dto) {
      return Result.failure("Нет структуры для восстановления");
    }

    if (!dto.id) {
      return Result.failure("Нет идентификатора сетевого графика");
    }
    if (!dto.title) {
      return Result.failure("Нет заголовка сетевого графика");
    }
    const web = new WebChart(dto.id, dto.title);
    const events = new Map<number, TaskEvent>();
    const items = [];

    for (let edto of dto.events) {
      const res = TaskEvent.Restore(edto);
      if (res.isFailure) {
        return Result.reFailure(res);
      }
      events.set(res.value.getId(), res.value);
      items.push(res.value);
    }

    for (let tdto of dto.tasks) {
      const res = Task.Restore(tdto);
      if (res.isFailure) {
        return Result.reFailure(res);
      }
      items.push(res.value);
      if (
        tdto.start &&
        tdto.end &&
        events.has(tdto.start) &&
        events.has(tdto.end)
      ) {
        res.value.connect(events.get(tdto.start!)!, events.get(tdto.end!)!);
      }
    }

    web.addBulk(items);

    return Result.success(web);
  }

  toJSON(): WebChartDTO {
    return {
      id: this.id,
      title: this.title,
      tasks: this.tasks.map((r) => r.toJSON()),
      events: this.events.map((r) => r.toJSON()),
    };
  }

  toString(): string {
    return `# ${this.title} / ${this.id}\n\n${this.pathes.map((r) => r.toString()).join("\n")}`;
  }

  getPathesByTask(task: Task): WorkPath[] {
    return this.pathes.filter((path) => path.has(task));
  }

  getListOfWork(
    dateStart: Date,
    calendar: Calendar,
  ): {
    num: string;
    work: string;
    startEarly: Date;
    startLate: Date | null;
    duration: string;
    endEarly: Date | null;
    endLate: Date;
  }[] {
    const result = [];
    for (let item of this.tasks) {
      const startEarly = calendar.forward(
        dateStart,
        item.prev()!.getEarlyDeadline()!,
      );
      const startLate = calendar.forward(
        dateStart,
        item.prev()!.getLateDeadline()!,
      );
      const endEarly = calendar.forward(
        dateStart,
        item.next()!.getEarlyDeadline()!,
      );
      const endLate = calendar.forward(
        dateStart,
        item.next()!.getLateDeadline()!,
      );
      result.push({
        num: item.key,
        work: item.name,
        pathes: this.getPathesByTask(item)
          .map((r) => r.getName())
          .join(", "),
        startEarly: startEarly,
        startLate:
          startEarly.valueOf() === startLate.valueOf() ? null : startLate,
        duration: item.getDuration().value,
        endEarly: endEarly.valueOf() === endLate.valueOf() ? null : endEarly,
        endLate: endLate,
        reserveFree: item.getFreeTimeReserve().value.value,
        reserveFull: item.getFullTimeReserve().value.value,
      });
    }

    result.sort((a, b) => (a.startEarly > b.startEarly ? 1 : -1));

    return result;
  }
}
