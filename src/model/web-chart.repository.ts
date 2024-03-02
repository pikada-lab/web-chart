import { Result } from "../lib/result";
import { WebChart } from "./web-chart/web-chart";
import { WebChartDTO } from "./web-chart/web-chart.dto";

export class WebChartRepository {
  private store = new Map<number, WebChartDTO>();

  async get(id: number): Promise<Result<WebChart>> {
    if (!this.store.has(id)) {
      return Result.failure("Сетевой график не найден");
    }
    return WebChart.Restore(this.store.get(id)!);
  }

  async save(chart: WebChart): Promise<void> {
    this.store.set(chart.getId(), chart.toJSON());
  }
}
