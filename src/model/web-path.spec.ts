import { Duration } from "../core/duration";
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
});
