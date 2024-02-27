import { Duration } from "../lib/duration";
import { DeterministicWork } from "./deterministic-work";
import { WorkType } from "./work.type";

describe("Детерменированное работа", () => {
  it("Должна корректно создаваться", () => {
    const result = DeterministicWork.Create(Duration.Create("10m").value);
    expect(result.error).toBe("");
    expect(result.value).toBeInstanceOf(DeterministicWork);
    expect(result.value.valueOf()).toBe(10);
    expect(result.value.getDuration().getDurationOnMinutes()).toBe(10);
    expect(result.value.toJSON()).toStrictEqual({
      type: WorkType.DETERMINISTIC,
      normal: "10m",
    });
  });
  it("Не должно быть равно нулю", () => {
    const result = DeterministicWork.Create(Duration.Create("0m").value);
    expect(result.error).not.toBe("");
  });
});
