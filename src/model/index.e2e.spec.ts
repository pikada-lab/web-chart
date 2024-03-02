import { Duration } from "../lib/duration";
import { Task } from "./task/task";
import { TaskEvent } from "./task-event/task-event";
import { TypeEvent } from "./task-event/type-event.enum";
import { WebChart } from "./web-chart/web-chart";
import { dto } from "./testing/index.e2e.dto";
import { DeterministicWork } from "./work/deterministic-work";
import { StandardCalendar } from "./calendar/standard-calendar";

describe("Полная проверка модели сетевого графика", () => {
  it("Должен выполнять подсчёт корректных данных", () => {
    const sut = new WebChart(101, "Учебный сетевой график");
    TaskEvent.LAST_ID = 0;
    Task.LAST_ID = 0;
    const E1 = new TaskEvent(TypeEvent.START);
    const E2 = new TaskEvent();
    const E3 = new TaskEvent();
    const E4 = new TaskEvent();
    const E5 = new TaskEvent();
    const E6 = new TaskEvent();
    const E7 = new TaskEvent();
    const E8 = new TaskEvent();
    const E9 = new TaskEvent();
    const E10 = new TaskEvent();
    const E11 = new TaskEvent();
    const E12 = new TaskEvent();
    const E13 = new TaskEvent();
    const E14 = new TaskEvent();
    const E15 = new TaskEvent();
    const E16 = new TaskEvent();
    const E17 = new TaskEvent();
    const E18 = new TaskEvent();
    const E19 = new TaskEvent();
    const E20 = new TaskEvent();
    const E21 = new TaskEvent();
    const E22 = new TaskEvent();
    const E23 = new TaskEvent();
    const E24 = new TaskEvent();
    const E25 = new TaskEvent();
    const E26 = new TaskEvent(TypeEvent.END);

    const T1 = new Task("Работа 1");
    const T2 = new Task("Работа 2");
    const T3 = new Task("Работа 3");
    const T4 = new Task("Работа 4");
    const T5 = new Task("Работа 5");
    const T6 = new Task("Работа 6");
    const T7 = new Task("Работа 7");
    const T8 = new Task("Работа 8");
    const T9 = new Task("Работа 9");
    const T10 = new Task("Работа 10");
    const T11 = new Task("Работа 11");
    const T12 = new Task("Работа 12");
    const T13 = new Task("Работа 13");
    const T14 = new Task("Работа 14");
    const T15 = new Task("Работа 15");
    const T16 = new Task("Работа 16");
    const T17 = new Task("Работа 17");
    const T18 = new Task("Работа 18");
    const T19 = new Task("Работа 19");
    const T20 = new Task("Работа 20");
    const T21 = new Task("Работа 21");
    const T22 = new Task("Работа 22");
    const T23 = new Task("Работа 23");
    const T24 = new Task("Работа 24");
    const T25 = new Task("Работа 25");
    const T26 = new Task("Работа 26");
    const T27 = new Task("Работа 27");
    const T28 = new Task("Работа 28");
    const T29 = new Task("Работа 29");
    const T30 = new Task("Работа 30");
    const T31 = new Task("Работа 31");

    T1.connect(E1, E2);
    T1.setWork(DeterministicWork.Create(Duration.Create(3).value).value);
    T2.connect(E1, E3);
    T2.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T3.connect(E1, E5);
    T3.setWork(DeterministicWork.Create(Duration.Create(3).value).value);
    T4.connect(E1, E4);
    T4.setWork(DeterministicWork.Create(Duration.Create(4).value).value);
    T5.connect(E4, E7);
    T5.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T6.connect(E4, E8);
    T6.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T7.connect(E4, E9);
    T7.setWork(DeterministicWork.Create(Duration.Create(3).value).value);
    T8.connect(E4, E10);
    T8.setWork(DeterministicWork.Create(Duration.Create(5).value).value);
    T9.connect(E5, E6);
    T9.setWork(DeterministicWork.Create(Duration.Create(4).value).value);
    T10.connect(E6, E11);
    T10.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    T11.connect(E7, E12);
    T11.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T12.connect(E3, E15);
    T12.setWork(DeterministicWork.Create(Duration.Create(4).value).value);
    T13.connect(E9, E13);
    T13.setWork(DeterministicWork.Create(Duration.Create(4).value).value);
    T14.connect(E10, E14);
    T14.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    T15.connect(E8, E16);
    T15.setWork(DeterministicWork.Create(Duration.Create(6).value).value);
    T16.connect(E13, E18);
    T16.setWork(DeterministicWork.Create(Duration.Create(16).value).value);
    T17.connect(E11, E12);
    T17.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T18.connect(E12, E17);
    T18.setWork(DeterministicWork.Create(Duration.Create(3).value).value);
    T19.connect(E14, E21);
    T19.setWork(DeterministicWork.Create(Duration.Create(14).value).value);
    T20.connect(E15, E17);
    T20.setWork(DeterministicWork.Create(Duration.Create(3).value).value);
    T21.connect(E17, E22);
    T21.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T22.connect(E21, E23);
    T22.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    T23.connect(E23, E25);
    T23.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T24.connect(E25, E26);
    T24.setWork(DeterministicWork.Create(Duration.Create(1).value).value);
    T25.connect(E18, E23);
    T25.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    T26.connect(E16, E20);
    T26.setWork(DeterministicWork.Create(Duration.Create(12).value).value);
    T27.connect(E20, E22);
    T27.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T28.connect(E2, E19);
    T28.setWork(DeterministicWork.Create(Duration.Create(4).value).value);
    T29.connect(E19, E24);
    T29.setWork(DeterministicWork.Create(Duration.Create(6).value).value);
    T30.connect(E24, E26);
    T30.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    T31.connect(E22, E25);
    T31.setWork(DeterministicWork.Create(Duration.Create(2).value).value);
    sut.addBulk([
      E1,
      E2,
      E3,
      E4,
      E5,
      E6,
      E7,
      E8,
      E9,
      E10,
      E11,
      E12,
      E13,
      E14,
      E15,
      E16,
      E17,
      E18,
      E19,
      E20,
      E21,
      E22,
      E23,
      E24,
      E25,
      E26,
      T1,
      T2,
      T3,
      T4,
      T5,
      T6,
      T7,
      T8,
      T9,
      T10,
      T11,
      T12,
      T13,
      T14,
      T15,
      T16,
      T17,
      T18,
      T19,
      T20,
      T21,
      T22,
      T23,
      T24,
      T25,
      T26,
      T27,
      T28,
      T29,
      T30,
      T31,
    ]);

    expect(sut.check().error).toBe("");
    expect(sut.getPathes().error).toBe("");
    expect(sut.getPathes().value.length).toBe(7);
    expect(sut.getMaxLengthPath()!.length().getDurationOnMinutes()).toBe(50);
    expect(E12.getEarlyDeadline()!.getDurationOnMinutes()).toBe(21);
    expect(E19.getLateDeadline()!.getDurationOnMinutes()).toBe(42);
    expect(E19.getEarlyDeadline()!.getDurationOnMinutes()).toBe(7);
    expect(E19.getReserveTime().value.getDurationOnMinutes()).toBe(35);

    expect(T5.getDuration()!.getDurationOnMinutes()).toBe(2);
    expect(T5.next()!.getEarlyDeadline()!.getDurationOnMinutes()).toBe(6);
    expect(T5.prev()!.getEarlyDeadline()!.getDurationOnMinutes()).toBe(4);
    expect(T5.getFreeTimeReserve().value!.getDurationOnMinutes()).toBe(
      6 - 4 - 2,
    );

    expect(T6.getFreeTimeReserve().value!.getDurationOnMinutes()).toBe(
      6 - 4 - 2,
    );
    expect(T6.getFullTimeReserve().value!.getDurationOnMinutes()).toBe(21);
    expect(E4.getReserveTime().value!.getDurationOnMinutes()).toBe(0);
    expect(E8.getReserveTime().value!.getDurationOnMinutes()).toBe(21);

    expect(sut.toJSON()).toStrictEqual(dto);
  });

  it("Должна восстанавливаться из dto", () => {
    const wdto = structuredClone(dto);
    wdto.tasks.forEach((t) => {
      t.work.normal = t.work.normal.replace(/(m)/, "w");
    });
    const sut = WebChart.Restore(wdto).value;

    expect(sut.check().error).toBe("");
    expect(sut.getPathes().error).toBe("");
    expect(sut.getPathes().value.length).toBe(7);
    expect(sut.getMaxLengthPath()!.length().getWeeks()).toBe(50);
    expect(sut.toJSON()).toStrictEqual(wdto);

    console.table(
      sut.getListOfWork(new Date("2024-01-01"), new StandardCalendar()),
    );
  });
});
