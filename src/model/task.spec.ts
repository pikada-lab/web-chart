import { Duration } from "../core/duration";
import { Task } from "./task";
import { TaskType } from "./task-type.enum";

describe("Модель работы в сетевом графике", () => {
  it("Работа должна создаваться с названием и идентификатором", () => {
    Task.LAST_ID = 0;
    expect(new Task("Работа 1").id).toBe(1);
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

  it("Работа должна приводиться к DTO", () => {
    Task.LAST_ID = 0;
    expect(new Task("Работа 1").toJSON()).toStrictEqual({
      id: 1,
      name: "Работа 1",
      type: 1,
      start: null,
      end: null,
      isConnected: false,
      duration: null,
      min: null,
      max: null,
      real: null,
    });
  });
  it("Должен из DTO приводить к объекту работы", () => {
    const dto = {
      id: 1,
      name: "Работа 1",
      type: 1,
      start: null,
      end: null,
      isConnected: false,
      duration: '10m',
      min: '4m',
      max: '20m',
      normal: '30m',
      real: null,
    };

    const taskResult = Task.Restore(dto);

    expect(taskResult.error).toBe('');
    expect(taskResult.value).toBeInstanceOf(Task);
    expect(taskResult.value.id).toBe(1);
    expect(taskResult.value.name).toBe("Работа 1");
    expect(taskResult.value.type).toBe(TaskType.HARD);
    expect(taskResult.value.getDuration()).toBeInstanceOf(Duration);
    expect(taskResult.value.getDuration().getDurationOnMinutes()).toBe(10);
    expect(taskResult.value.hasConnect).toBeFalsy();
  });
});
