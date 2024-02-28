import { Duration } from "../../lib/duration";
import { StandardCalendar } from "./standard-calendar";

describe("Календарь", () => {
  var cld: StandardCalendar;
  beforeAll(() => {
    cld = new StandardCalendar();
  });
  it("Должен перемещать вперёд на 1 день", () => {
    const date = cld.forward(
      new Date("2024-02-26 9:00:00"),
      Duration.Create("1d").value
    );
    expect(date).toEqual(new Date("2024-02-27 9:00:00"));
  });
  it("Должен перемещать вперёд на 1 неделю", () => { 
    const date = cld.forward(
      new Date("2024-02-26 9:00:00"),
      Duration.Create("1w").value
    );
    expect(date).toEqual(new Date("2024-03-04 9:00:00"));
  });
  it("Должен перемещать вперёд на 1 день с учётом выходных", () => { 

    const date = cld.forward(
      new Date("2024-02-09 9:00:00"),
      Duration.Create("1d").value
    );
    expect(date).toEqual(new Date("2024-02-12 9:00:00"));
  });
  it("Должен перемещать вперёд на 10 минут", () => { 

    const date = cld.forward(
      new Date("2024-02-21 9:00:00"),
      Duration.Create("10m").value
    );
    expect(date).toEqual(new Date("2024-02-21 9:10:00"));
  });
  it("Должен перемещать вперёд на 15 минут c учётом конца дня в 18:00 и начала в 9:30", () => {
    const cld = new StandardCalendar();

    const date = cld.forward(
      new Date("2024-02-26 17:50:00"),
      Duration.Create("15m").value
    );
    expect(date).toEqual(new Date("2024-02-27 09:35:00"));
  });
  it("Должен перемещать вперёд на 15 минут c учётом перерыва на обед с 13:30 по 14:00", () => {
    const cld = new StandardCalendar();

    const date = cld.forward(
      new Date("2024-02-26 13:20:00"),
      Duration.Create("15m").value
    );
    expect(date).toEqual(new Date("2024-02-26 14:05:00"));
  });
  it("Должен перемещать вперёд на 4 час c учётом перерыва на обед с 13:30 по 14:00", () => {
    const cld = new StandardCalendar();

    const date = cld.forward(
      new Date("2024-02-26 13:00:00"),
      Duration.Create("4h").value
    );
    expect(date).toEqual(new Date("2024-02-26 17:30:00"));
  });
});
