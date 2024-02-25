import { Duration } from "../core/duration";
import { TaskEvent } from "./task-event";
import { TypeEvent } from "./type-event.enum";

describe("Модель события в сетевом графике", () => {
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

  it("Событие должно приводиться к DTO", () => {
    TaskEvent.LAST_ID = 0;
    const sut = new TaskEvent(TypeEvent.DEFAULT);
    sut.setEarlyDeadline(Duration.Create("20m").value);
    sut.setLateDeadline(Duration.Create("25m").value);

    const dto = sut.toJSON();

    expect(dto).toStrictEqual({
      id: 1,
      type: 2,
      input: [],
      output: [],
    });
  });

  it("Событие должно восстанавливаться из DTO", () => {
    const dto = {
      id: 11,
      type: 2,
      input: [],
      output: [],
    };

    const eventResult = TaskEvent.Restore(dto);

    expect(eventResult.error).toBe("");
    expect(eventResult.value).toBeInstanceOf(TaskEvent);
    expect(eventResult.value.getId()).toBe(11);
    expect(eventResult.value.isDefault()).toBeTruthy();
  });
});
