import { Duration } from "../lib/duration";
import { Task } from "./task";
import { TaskEvent } from "./task-event";
import { TypeEvent } from "./type-event.enum";

describe("Интеграционный тест работы и события", () => {
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

  it("Нельзя добавить две работы с одного и того же события и с одним и тем же конечным событиям", () => {
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);

    const task = new Task("Original");
    const double = new Task("Double");

    expect(task.connect(start, end)).toBeTruthy();
    expect(double.connect(start, end)).toBeFalsy();
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

    expect(sut.error).toBe("");
    expect(sut.value).toBeInstanceOf(Duration);
    expect(end.getReserveTime().value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(23 - 12 - 2);
    expect(end.getReserveTime().value.getDurationOnMinutes()).toBe(23 - 18);
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

    expect(sut.error).toBe("");
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(18 - 12 - 2);
  });

  it("Должен корректно высчитываться Свободный Резерв времени", () => {
    TaskEvent.LAST_ID = 0;
    Task.LAST_ID = 100;
    const start = new TaskEvent();
    const end = new TaskEvent();
    const task = new Task("Работа 1");
    start.setEarlyDeadline(Duration.Create(12).value);
    start.setLateDeadline(Duration.Create(15).value);
    end.setEarlyDeadline(Duration.Create(18).value);
    end.setLateDeadline(Duration.Create(23).value);
    task.setDuration(Duration.Create(2).value);
    task.connect(start, end);

    expect(task.toJSON()).toStrictEqual({
      duration: "2m",
      end: 2,
      id: 101,
      isConnected: true,
      max: null,
      min: null,
      name: "Работа 1",
      real: null,
      start: 1,
      type: 1,
    });

    expect(start.toJSON()).toStrictEqual({
      id: 1,
      input: [],
      output: [101],
      type: 2,
    });
  });
});
