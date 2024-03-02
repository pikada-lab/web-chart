import { Task } from "./task/task";
import { TaskEvent } from "./task-event/task-event";
import { TypeEvent } from "./task-event/type-event.enum";
import { WebChart } from "./web-chart/web-chart";
import { WebChartRepository } from "./web-chart.repository";

describe("Репозиторий сетевых графиков", () => {
  it("Должен извлекать несуществующий объект с синхронной ошибкой", async () => {
    const repo = new WebChartRepository();

    const result = await repo.get(1);

    expect(result.isFailure).toBeTruthy();
  });
  it("Должен извлекать несуществующий объект с синхронной ошибкой", async () => {
    const repo = new WebChartRepository();
    const sut = new WebChart(201, "Сетевой график");
    const start = new TaskEvent(TypeEvent.START);
    const end = new TaskEvent(TypeEvent.END);
    const task = new Task("Работа 1");
    task.connect(start, end);
    sut.addBulk([start, end, task]);

    await repo.save(sut);
    const result = await repo.get(201);

    expect(result.error).toBe("");
    expect(result.value).toBeInstanceOf(WebChart);
    expect(result.value.getId()).toBe(201);
  });
});
