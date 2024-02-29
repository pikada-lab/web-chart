import { Result } from "../lib/result";
import { WebChartRepository } from "../model/web-chart.repository";
import { WebChartService } from "../model/web-chart.service";
import { Drawer } from "../drawer/drawer";
import { DocRepository } from "./doc.repository";
import { DocService } from "./doc.service";
import { Doc } from "./doc";

export class GraphService {
  constructor(
    private readonly drawer: Drawer,
    private readonly repository: WebChartRepository,
    private readonly webService: WebChartService,
    private readonly planRepository: DocRepository,
    private readonly planService: DocService,
  ) {}

  async createPlan(webChartId: number): Promise<Result<Doc>> {
    const web = await this.repository.get(webChartId);
    if (!web.isFailure) {
      return Result.reFailure(web);
    }
    const plan = new Doc(web.value);
    return Result.success(plan);
  }
}
