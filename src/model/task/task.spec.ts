import { Duration } from "../../lib/duration";
import { DeterministicWork } from "../work/deterministic-work";
import { ProbabilisticWork } from "../work/probabilistic-work";
import { Task } from "./task";
import { TaskType } from "./task-type.enum";

describe("Модель работы в сетевом графике", () => {
  it("Работа должна создаваться с названием и идентификатором", () => {
    Task.LAST_ID = 0;
    expect(new Task("Работа 1").id).toBe(1);
  });

  it("Работа должна корректно устанавливать детерминированную продолжительность", () => {
    const sut = new Task("KL1");
    sut.setWork(DeterministicWork.Create(Duration.Create("5m").value).value);
    expect(sut.hasDuration).toBeTruthy();
    expect(sut.getDuration()).toBeInstanceOf(Duration);
    expect(sut.getDuration().getDurationOnMinutes()).toBe(5);
  });

  it("Работа должна корректно устанавливать вероятностную продолжительность", () => {
    const sut = new Task("KL1");
    sut.setWork(
      ProbabilisticWork.Create(
        Duration.Create("5m").value,
        Duration.Create("6m").value,
        Duration.Create("16m").value,
      ).value,
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
      work: { type: 0 },
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
      work: {
        type: 2,
        min: "4m",
        max: "30m",
        real: "20m",
      },
    };

    const taskResult = Task.Restore(dto);

    expect(taskResult.error).toBe("");
    expect(taskResult.value).toBeInstanceOf(Task);
    expect(taskResult.value.id).toBe(1);
    expect(taskResult.value.name).toBe("Работа 1");
    expect(taskResult.value.type).toBe(TaskType.HARD);
    expect(taskResult.value.getDuration()).toBeInstanceOf(Duration);
    expect(taskResult.value.getDuration().getDurationOnMinutes()).toBe(19);
    expect(taskResult.value.hasConnect).toBeFalsy();
  });
});
