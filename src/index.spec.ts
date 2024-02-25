import { Duration } from "./core/duration";
import { Task, TaskEvent, TypeEvent, WebChart, WorkPath } from "./index";

describe("Модель сетевого графика", () => {
  it("Работа должна создаваться с названием и идентификатором", () => {
    Task.LAST_ID = 0;
    expect(new Task("Работа 1").id).toBe(1);
  });
  it("Событие должно содержать корректный тип: Начало", () => {
    const sut = new TaskEvent(TypeEvent.START);
    expect(sut.isStart()).toBeTruthy();
    expect(sut.isDefault()).toBeFalsy();
    expect(sut.isEnd()).toBeFalsy();
  });

  it("Событие должно содержать корректный тип: Окончание", () => {
    const sut = new TaskEvent(TypeEvent.END);
    expect(sut.isStart()).toBeFalsy();
    expect(sut.isDefault()).toBeFalsy();
    expect(sut.isEnd()).toBeTruthy();
  });

  it("Событие должно содержать корректный тип: По умолчанию", () => {
    const sut = new TaskEvent();
    expect(sut.isStart()).toBeFalsy();
    expect(sut.isDefault()).toBeTruthy();
    expect(sut.isEnd()).toBeFalsy();
  });

  it("Работа должна корректно соединяться с событиями", () => {
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const task = new Task("Работа 2");

    const connect = task.connect(start, end);

    expect(connect).toBeTruthy();
    expect(task.hasConnect).toBeTruthy();
    expect(task.key).toBe(`(1,2)`);
    expect(start.next()).toBe(task);
    expect(task.next()).toBe(end);
  });

  it("Должен создаваться простой сетевой график", () => {
    const sut = new WebChart("Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const task = new Task("Работа 3");
    const connect = task.connect(start, end);

    sut.addBulk([start, end, task]);

    expect(connect).toBeTruthy();
    expect(sut.check()).toBeTruthy();
  });

  it("Работа должна корректно устанавливать детерминированную продолжительность", () => {
    const sut = new Task("KL1");
    sut.setDuration(Duration.Create("5m").value);
    expect(sut.hasDuration).toBeTruthy();
    expect(sut.getDuration()).toBeInstanceOf(Duration);
    expect(sut.getDuration().getDurationOnMinutes()).toBe(5);
  });

  it("Работа должна корректно устанавливать вероятностную продолжительность", () => {
    const sut = new Task("KL1");
    sut.setProbabilisticDuration(
      Duration.Create("5m").value,
      Duration.Create("6m").value,
      Duration.Create("16m").value
    );
    expect(sut.hasDuration).toBeTruthy();
    expect(sut.getDuration()).toBeInstanceOf(Duration);
    expect(sut.getDuration().getDurationOnMinutes()).toBe(7.5);
  });
  it("Если у сетевого графика нет начала, он некорректный", () => {
    const sut = new WebChart("Сетевой график");
    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });

  it("Если у сетевого графика нет конца, он некорректный", () => {
    const sut = new WebChart("Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    sut.addBulk([start]);
    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });

  it("Если из начала нельзя попасть в конец, то график не корректный", () => {
    const sut = new WebChart("Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const task = new Task("Работа 3");

    sut.addBulk([start, end, task]);

    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });

  it("Если есть тупиковое событие, то график не корректный", () => {
    const sut = new WebChart("Сетевой график");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle = new TaskEvent();
    const impasse = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    task1.connect(start, middle);
    task2.connect(middle, end);
    task3.connect(middle, impasse);

    sut.addBulk([start, end, middle, impasse, task1, task2, task3]);

    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });

  it("Если есть хвостовое событие, то график не корректный", () => {
    const sut = new WebChart("Сетевой график");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle = new TaskEvent();
    const tail = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    task1.connect(start, middle);
    task2.connect(middle, end);
    task3.connect(tail, middle);

    sut.addBulk([start, end, middle, tail, task1, task2, task3]);

    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });

  it("Если есть замкнутый контур, то график не корректный", () => {
    const sut = new WebChart("Сетевой график");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle1 = new TaskEvent();
    const middle2 = new TaskEvent();
    const middle3 = new TaskEvent();
    const middle4 = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    const task4 = new Task("Работа 4");
    const task5 = new Task("Работа 5");
    const task6 = new Task("Работа 6");
    task1.connect(start, middle1);
    task2.connect(middle1, middle2);
    task3.connect(middle2, middle3);
    task4.connect(middle3, middle4);
    task5.connect(middle4, middle1);
    task6.connect(middle1, end);

    sut.addBulk([
      start,
      end,
      middle1,
      middle2,
      middle3,
      middle4,
      task1,
      task2,
      task3,
      task4,
      task5,
      task6,
    ]);

    expect(sut.check().error).not.toBe("");
    expect(sut.check().isFailure).toBeTruthy();
  });
  it("Должен корректно высчитывать количество путей сетевого графика", () => {
    const sut = new WebChart("Сетевой график");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle1 = new TaskEvent();
    const middle2 = new TaskEvent();
    const middle3 = new TaskEvent();
    const middle4 = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    const task4 = new Task("Работа 4");
    const task5 = new Task("Работа 5");
    const task6 = new Task("Работа 6");
    /**
     * ```
     * (Start) -> (1) -------------------> (End)
     *             ' -> (2) -> (3) -> (4) -> '
     * ```
     */
    task1.connect(start, middle1);
    task2.connect(middle1, middle2);
    task3.connect(middle2, middle3);
    task4.connect(middle3, middle4);
    task5.connect(middle4, end);
    task6.connect(middle1, end);

    sut.addBulk([
      start,
      end,
      middle1,
      middle2,
      middle3,
      middle4,
      task1,
      task2,
      task3,
      task4,
      task5,
      task6,
    ]);

    expect(sut.check().isFailure).toBeFalsy();

    const pathesResult = sut.getPathes();
    expect(pathesResult.isFailure).toBeFalsy();
    const pathes = pathesResult.value;
    expect(pathes).toHaveLength(2);
    expect(pathes[0].getName()).toBe("L1");
    expect(pathes[1].getName()).toBe("L2");
  });

  it("Путь должен корректно расчитывать длину", () => {
    // Arrange
    const sut = new WorkPath();

    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");

    task1.setDuration(Duration.Create("12m").value);
    task2.setDuration(Duration.Create("28m").value);

    task1.connect(start, middle);
    task2.connect(middle, end);

    sut.add(start);
    sut.add(task1);
    sut.add(middle);
    sut.add(task2);
    sut.add(end);
    sut.updateLength();
    const duration = Duration.Create("40m").value;
    //               12m                    28m
    // (Start,1) ---(1,2)--> (Middle,2) ---(2,3)--> (End, 3)
    //                          =40m

    // Act
    const length = sut.length();

    // Assert
    expect(length.getDurationOnMinutes()).toBe(40);
    expect(duration.equal(length)).toBeTruthy();
  });
  it("Сетевой график должен находить путь максимальной длины", () => {
    const sut = new WebChart("Сетевой график 3");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle1 = new TaskEvent();
    const middle2 = new TaskEvent();
    const middle3 = new TaskEvent();
    const middle4 = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    const task4 = new Task("Работа 4");
    const task5 = new Task("Работа 5");
    const task6 = new Task("Работа 6");

    task1.setDuration(Duration.Create(2).value);
    task2.setDuration(Duration.Create(12).value);
    task3.setDuration(Duration.Create(4).value);

    task4.setDuration(Duration.Create(5).value);
    task5.setDuration(Duration.Create(5).value);
    task6.setDuration(Duration.Create(4).value);
    /**
     * ```
     *          2             12             4
     * (Start) -> (1) ----------------> (4) --> (End)
     *             |  5       5       4  |
     *             ' --> (2) --> (3) --> '
     * ```
     */
    task1.connect(start, middle1);
    task2.connect(middle1, middle4);
    task3.connect(middle4, end);

    task4.connect(middle1, middle2);
    task5.connect(middle2, middle3);
    task6.connect(middle3, middle4);

    sut.addBulk([
      start,
      end,
      middle1,
      middle2,
      middle3,
      middle4,
      task1,
      task2,
      task3,
      task4,
      task5,
      task6,
    ]);

    const maxLengthPath = sut.getMaxLengthPath();

    expect(maxLengthPath).toBeInstanceOf(WorkPath);
    expect(maxLengthPath?.length()).toBeInstanceOf(Duration);
    expect(sut.getPathes().value).toHaveLength(2);
    expect(maxLengthPath?.length().getDurationOnMinutes()).toBe(20);
  });

  it("В событие должен устанавливаться ранний срок свершения события", () => {
    const sut = new TaskEvent();
    sut.setEarlyDeadline(Duration.Create("20m").value);
    expect(sut.getEarlyDeadline()).toBeInstanceOf(Duration);
    expect(sut.getEarlyDeadline()!.getDurationOnMinutes()).toBe(20);
  });

  it("В событие должен устанавливаться поздний срок свершения события", () => {
    const sut = new TaskEvent();
    sut.setLateDeadline(Duration.Create("20m").value);
    expect(sut.getLateDeadline()).toBeInstanceOf(Duration);
    expect(sut.getLateDeadline()!.getDurationOnMinutes()).toBe(20);
  });

  it("Сетевой график должен определять ранний и поздний срок свершения события между двумя ветвями", () => {
    const sut = new WebChart("Сетевой график 3");
    TaskEvent.LAST_ID = 0;
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const middle1 = new TaskEvent();
    const middle2 = new TaskEvent();
    const middle3 = new TaskEvent();
    const middle4 = new TaskEvent();
    const middle5 = new TaskEvent();
    Task.LAST_ID = 0;
    const task1 = new Task("Работа 1");
    const task2 = new Task("Работа 2");
    const task3 = new Task("Работа 3");
    const task4 = new Task("Работа 4");
    const task5 = new Task("Работа 5");
    const task6 = new Task("Работа 6");
    const task7 = new Task("Работа 7");

    task1.setDuration(Duration.Create(2).value);
    task2.setDuration(Duration.Create(6).value);
    task3.setDuration(Duration.Create(4).value);

    task4.setDuration(Duration.Create(5).value);
    task5.setDuration(Duration.Create(5).value);
    task6.setDuration(Duration.Create(4).value);
    task7.setDuration(Duration.Create(6).value);
    /**
     * ```
     *          2       6          6         4
     * (Start) -> (1) -----> (5) -----> (4) --> (End)
     *             |  5       5       4  |
     *             ' --> (2) --> (3) --> '
     * ```
     */
    task1.connect(start, middle1);
    task2.connect(middle1, middle5);
    task7.connect(middle5, middle4);
    task3.connect(middle4, end);

    task4.connect(middle1, middle2);
    task5.connect(middle2, middle3);
    task6.connect(middle3, middle4);

    sut.addBulk([
      start,
      end,
      middle1,
      middle2,
      middle3,
      middle4,
      middle5,
      task1,
      task2,
      task3,
      task4,
      task5,
      task6,
      task7,
    ]);

    expect(middle1.getEarlyDeadline()).toBeInstanceOf(Duration);
    expect(middle2.getEarlyDeadline()).toBeInstanceOf(Duration);
    expect(middle3.getEarlyDeadline()).toBeInstanceOf(Duration);
    expect(middle4.getEarlyDeadline()).toBeInstanceOf(Duration);
    expect(middle5.getEarlyDeadline()).toBeInstanceOf(Duration);

    expect(middle1.getEarlyDeadline()!.getDurationOnMinutes()).toBe(2);
    expect(middle2.getEarlyDeadline()!.getDurationOnMinutes()).toBe(7);
    expect(middle3.getEarlyDeadline()!.getDurationOnMinutes()).toBe(12);
    expect(middle4.getEarlyDeadline()!.getDurationOnMinutes()).toBe(16);
    expect(middle5.getEarlyDeadline()!.getDurationOnMinutes()).toBe(8);

    expect(middle1.getLateDeadline()).toBeInstanceOf(Duration);
    expect(middle2.getLateDeadline()).toBeInstanceOf(Duration);
    expect(middle3.getLateDeadline()).toBeInstanceOf(Duration);
    expect(middle4.getLateDeadline()).toBeInstanceOf(Duration);
    expect(middle5.getLateDeadline()).toBeInstanceOf(Duration);

    expect(middle1.getLateDeadline()!.getDurationOnMinutes()).toBe(2);
    expect(middle2.getLateDeadline()!.getDurationOnMinutes()).toBe(7);
    expect(middle3.getLateDeadline()!.getDurationOnMinutes()).toBe(12);
    expect(middle4.getLateDeadline()!.getDurationOnMinutes()).toBe(16);
    expect(middle5.getLateDeadline()!.getDurationOnMinutes()).toBe(10);
  });

  it("Должен корректно высчитываться Поздний Резерв времени", () => {
    const start = new TaskEvent();
    const end = new TaskEvent();
    const task = new Task("Работа 1");
    start.setEarlyDeadline(Duration.Create(12).value);
    start.setLateDeadline(Duration.Create(15).value);
    end.setEarlyDeadline(Duration.Create(18).value);
    end.setLateDeadline(Duration.Create(23).value);
    task.setDuration(Duration.Create(2).value);
    task.connect(start, end);

    const sut = task.getFullTimeReserve();

    expect(sut).toBeInstanceOf(Duration);
    expect(end.getReserveTime()).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(23 - 12 - 2);
    expect(end.getReserveTime().getDurationOnMinutes()).toBe(23 - 18);
  });

  it("Должен корректно высчитываться Свободный Резерв времени", () => {
    const start = new TaskEvent();
    const end = new TaskEvent();
    const task = new Task("Работа 1");
    start.setEarlyDeadline(Duration.Create(12).value);
    start.setLateDeadline(Duration.Create(15).value);
    end.setEarlyDeadline(Duration.Create(18).value);
    end.setLateDeadline(Duration.Create(23).value);
    task.setDuration(Duration.Create(2).value);
    task.connect(start, end);

    const sut = task.getFreeTimeReserve();

    expect(sut).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(18 - 12 - 2);
  });
});
