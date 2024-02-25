import { Duration } from "./core/duration";
import { Task, TaskEvent, TypeEvent, WebChart, WorkPath } from "./index";

describe("Полная проверка модели сетевого графика", () => {
  it("Должен выполнять подсчёт корректных данных", () => {
    const sut = new WebChart("Учебный сетевой график");
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
    const T32 = new Task("Работа 32");

    T1.connect(E1, E2);
    T1.setDuration(Duration.Create(3).value);
    T2.connect(E1, E3);
    T2.setDuration(Duration.Create(2).value);
    T3.connect(E1, E5);
    T3.setDuration(Duration.Create(3).value);
    T4.connect(E1, E4);
    T4.setDuration(Duration.Create(4).value);
    T5.connect(E4, E7);
    T5.setDuration(Duration.Create(2).value);
    T6.connect(E4, E8);
    T6.setDuration(Duration.Create(2).value);
    T7.connect(E4, E9);
    T7.setDuration(Duration.Create(3).value);
    T8.connect(E4, E10);
    T8.setDuration(Duration.Create(5).value);
    T9.connect(E5, E6);
    T9.setDuration(Duration.Create(4).value);
    T10.connect(E6, E11);
    T10.setDuration(Duration.Create(12).value);
    T11.connect(E7, E12);
    T11.setDuration(Duration.Create(2).value);
    T12.connect(E3, E15);
    T12.setDuration(Duration.Create(4).value);
    T13.connect(E9, E13);
    T13.setDuration(Duration.Create(4).value);
    T14.connect(E10, E14);
    T14.setDuration(Duration.Create(12).value);
    T15.connect(E8, E16);
    T15.setDuration(Duration.Create(6).value);
    T16.connect(E13, E18);
    T16.setDuration(Duration.Create(16).value);
    T17.connect(E11, E12);
    T17.setDuration(Duration.Create(2).value);
    T18.connect(E12, E17);
    T18.setDuration(Duration.Create(3).value);
    T19.connect(E14, E21);
    T19.setDuration(Duration.Create(14).value);
    T20.connect(E15, E17);
    T20.setDuration(Duration.Create(3).value);
    T21.connect(E17, E22);
    T21.setDuration(Duration.Create(2).value);
    T22.connect(E21, E23);
    T22.setDuration(Duration.Create(12).value);
    T23.connect(E23, E25);
    T23.setDuration(Duration.Create(2).value);
    T24.connect(E25, E26);
    T24.setDuration(Duration.Create(1).value);
    T25.connect(E18, E23);
    T25.setDuration(Duration.Create(12).value);
    T26.connect(E16, E20);
    T26.setDuration(Duration.Create(12).value);
    T27.connect(E20, E22);
    T27.setDuration(Duration.Create(7).value);
    T28.connect(E2, E19);
    T28.setDuration(Duration.Create(4).value);
    T29.connect(E19, E24);
    T29.setDuration(Duration.Create(6).value);
    T30.connect(E24, E26);
    T30.setDuration(Duration.Create(2).value);
    T31.connect(E22, E25);
    T31.setDuration(Duration.Create(2).value);
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
    expect(E19.getReserveTime()!.getDurationOnMinutes()).toBe(35);
  });
});
