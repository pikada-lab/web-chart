import { Duration } from "../lib/duration";
import { DeterministicWork } from "./work/deterministic-work";
import { Task } from "./task";
import { TaskEvent } from "./task-event";
import { TypeEvent } from "./type-event.enum";
import { WorkPath } from "./work-path";

describe("Путь в сетевом графике", () => {
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
    const task3 = new Task("Работа 3");

    task1.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    task2.setWork(DeterministicWork.Create(Duration.Create(28).value).value);

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
    expect(sut.has(task1)).toBeTruthy()
    expect(sut.has(task2)).toBeTruthy()
    expect(sut.has(task3)).toBeFalsy()
  });
});
