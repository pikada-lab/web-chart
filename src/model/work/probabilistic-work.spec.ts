import { Duration } from "../../lib/duration";
import { ProbabilisticWork } from "./probabilistic-work";

describe("Вероятностная работа", () => {
  it("Должна корректно создаваться", () => {
    const result = ProbabilisticWork.Create(
      Duration.Create("10m").value,
      Duration.Create("12m").value,
      Duration.Create("20m").value
    );
    expect(result.error).toBe("");
    expect(result.value).toBeInstanceOf(ProbabilisticWork);
    expect(result.value.valueOf()).toBe(13);
    expect(result.value.getDuration().getDurationOnMinutes()).toBe(13);
    expect(result.value.toJSON()).toStrictEqual({
      type: 2,
      min: "10m",
      max: "20m",
      real: "12m",
    });
  });
  it("Минимальное время должно быть меньше всех остальных", () => {
    const result = ProbabilisticWork.Create(
      Duration.Create("20m").value,
      Duration.Create("12m").value,
      Duration.Create("10m").value
    );
    expect(result.error).not.toBe("");
  });
  it("Наиболее вероятное время должно быть больше минимального", () => {
    const result = ProbabilisticWork.Create(
      Duration.Create("10m").value,
      Duration.Create("5m").value,
      Duration.Create("20m").value
    );
    expect(result.error).not.toBe("");
  });
  it("Наиболее вероятное время должно быть меньше максимального", () => {
    const result = ProbabilisticWork.Create(
      Duration.Create("10m").value,
      Duration.Create("25m").value,
      Duration.Create("20m").value
    );
    expect(result.error).not.toBe("");
  });
});
