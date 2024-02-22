import { Task, TaskEvent, TypeEvent, WebChart } from "./index";

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

    sut.addEvent(start);
    sut.addEvent(end);
    sut.addTask(task);

    expect(connect).toBeTruthy();
    expect(sut.check()).toBeTruthy();
  });

  it("Если у сетевого графика нет начала, он некорректный", () => {
    const sut = new WebChart("Сетевой график");
    expect(sut.check()).toBeFalsy();
  });

  it("Если у сетевого графика нет конца, он некорректный", () => {
    const sut = new WebChart("Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    sut.addEvent(start);
    expect(sut.check()).toBeFalsy();
  });

  it("Если из начала нельзя попасть в конец, то график не корректный", () => {
    const sut = new WebChart("Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const task = new Task("Работа 3");

    sut.addEvent(start);
    sut.addEvent(end);
    sut.addTask(task);

    expect(sut.check()).toBeFalsy();
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

    sut.addEvent(start);
    sut.addEvent(end);
    sut.addEvent(middle);
    sut.addEvent(impasse);
    sut.addTask(task1);
    sut.addTask(task2);
    sut.addTask(task3);

    expect(sut.check()).toBeFalsy();
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

    sut.addEvent(start);
    sut.addEvent(end);
    sut.addEvent(middle);
    sut.addEvent(tail);
    sut.addTask(task1);
    sut.addTask(task2);
    sut.addTask(task3);

    expect(sut.check()).toBeFalsy();
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

    sut.addEvent(start);
    sut.addEvent(end);
    sut.addEvent(middle1);
    sut.addEvent(middle2);
    sut.addEvent(middle3);
    sut.addEvent(middle4);
    sut.addTask(task1);
    sut.addTask(task2);
    sut.addTask(task3);
    sut.addTask(task4);
    sut.addTask(task5);
    sut.addTask(task6);

    expect(sut.check()).toBeFalsy();
  });
});
