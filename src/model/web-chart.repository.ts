import { Result } from "../lib/result";
import { WebChart } from "./web-chart";

export class WebChartRepository {
  private store = new Map<number, WebChart>();
  async get(id: number): Promise<Result<WebChart>> {
    if (!this.store.has(id)) {
      return Result.failure("Сетевой график не найден");
    }
    return Result.success(this.store.get(id)!);
  }
  async save(chart: WebChart): Promise<void> {
    this.store.set(chart.getId(), chart);
  }
}
