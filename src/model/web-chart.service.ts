import { WebChart } from "./web-chart/web-chart";

interface Repository {
  get(id: number): Promise<WebChart>;
  save(chart: WebChart): Promise<void>;
}
export class WebChartService {
  constructor(repository: Repository) {}
}
