import { CanvasDrawer } from "./graph/canvas.drawer";
import { GraphService } from "./graph/graph.service";
import { Plan } from "./graph/plan";
import { TaskEvent } from "./model/task-event";
import { dto } from "./model/testing/index.e2e.dto";
import { WebChart } from "./model/web-chart";
import { WebChartRepository } from "./model/web-chart.repository";

const drawer = new CanvasDrawer("canvas");

const graph = new GraphService(drawer, new WebChartRepository());
const wdto = structuredClone(dto);
wdto.tasks.forEach((t) => {
  t.work.normal = t.work.normal.replace(/(m)/, "w");
});
const sut = WebChart.Restore(wdto).value;

const plan = new Plan(sut);
plan.auto();
graph.drawPlan(plan);

drawer.interaction(plan);
drawer.onhover = (r) => {
  console.log("onhover", r);
  graph.drawPlan(plan);
};
drawer.onleave = (r) => {
  console.log("onleave", r);
  graph.drawPlan(plan);
};
