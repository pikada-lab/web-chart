import { Result } from "../lib/result";
import { WebChartRepository } from "../model/web-chart.repository";
import { WebChartService } from "../model/web-chart.service";
import { Drawer } from "./drawer";
import { Plan } from "./plan";
import { PlanRepository } from "./plan.repository";
import { PlanService } from "./plan.service";

export class GraphService {
  constructor(
    private readonly drawer: Drawer,
    private readonly repository: WebChartRepository,
    // private readonly webService: WebChartService,
    // private readonly planRepository: PlanRepository,
    // private readonly planService: PlanService,
  ) {}

  async createPlan(webChartId: number): Promise<Result<Plan>> {
    const web = await this.repository.get(webChartId);
    if (!web.isFailure) {
      return Result.reFailure(web);
    }
    const plan = new Plan(web.value);
    return Result.success(plan);
  }

  drawPlan(plan: Plan) {
    this.drawer.clear();
    for (let e of plan.getEvents()) {
      this.drawer.drawEvent(plan, e);
    }
    for (let e of plan.getTasks()) {
      this.drawer.drawTask(plan, e);
    }
  }
}
