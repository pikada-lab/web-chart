import { NotSetWork } from "./not-set-work";
import { WorkType } from "./work.type";

describe("Не установленная работа", () => {
  it("Должна корректно создаваться", () => {
    const result = NotSetWork.Create();
    expect(result.error).toBe("");
    expect(result.value).toBeInstanceOf(NotSetWork);
    expect(result.value.valueOf()).toBe(0);
    expect(result.value.getDuration().getDurationOnMinutes()).toBe(0);
    expect(result.value.toJSON()).toStrictEqual({
      type: WorkType.NOT_SET,
    });
  });
});
