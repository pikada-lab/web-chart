import { Line } from "../geometry/line.geo";
import { Point } from "../geometry/point.geo";
import { Task } from "../model/task";
import { TaskEvent } from "../model/task-event";
import { TaskType } from "../model/task-type.enum";
import { Drawer } from "./drawer";
import { Plan } from "./plan";

export class CanvasDrawer implements Drawer {
  private status = "PENDING_CREATION";
  private ctx!: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement | null;
  private select: number = -1;
  private radius: number = 0;
  constructor(id: string, options: { radius?: number } = {}) {
    this.radius = options.radius ?? 25;
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
    if (!this.canvas) {
      this.status = "ERROR";
      return;
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.status = "READY";
  }

  onhover = (id: number) => {};
  onleave = (id: number) => {};

  interaction(plan: Plan): void {
    let leaveSelect = -1;
    this.canvas?.addEventListener("mousemove", (e) => {
      const point = new Point(e.offsetX, e.offsetY);
      const intersect = this.intersect(point, plan);

      console.log(intersect);

      if (this.select !== intersect) {
        if (this.select !== -1) {
          leaveSelect = this.select;
        }
        this.select = intersect;
        if (intersect !== -1) {
          this.onhover(this.select);
        }
        if (leaveSelect !== -1) {
          this.onleave(leaveSelect);
          leaveSelect = -1;
        }
      }
    });
  }

  intersect(point: Point, plan: Plan): number {
    for (let [id, center] of plan.getCenters()) {
      if (new Line(center, point).getLength() < this.radius) {
        return id;
      }
    }
    return -1;
  }

  private isReady(): boolean {
    return this.status === "READY";
  }

  clear(): void {
    this.canvas!.style.cursor = "default";
    this.ctx.clearRect(0, 0, 1920, 1080);
  }

  drawTask(plan: Plan, t: Task): void {
    if (!this.isReady()) {
      return;
    }
    const prev = t.prev();
    const next = t.next();
    if (!prev || !next) {
      return;
    }
    this.drawCanvasTask(
      plan.getCoordinates(prev.getId()),
      plan.getCoordinates(next.getId()),
      t.getDuration().value,
      t.isFiction(),
    );
  }
  drawEvent(plan: Plan, e: TaskEvent): void {
    if (!this.isReady()) {
      return;
    }

    this.drawCanvasEvent(plan.getCoordinates(e.getId()), e.getId().toString());
    if (e.getId() === this.select) {
      this.canvas!.style.cursor = "pointer";
      this.drawCanvasSelect(plan.getCoordinates(e.getId()));
    }
  }

  private drawCanvasText(
    point: Point,
    angle: number,
    text: string,
    options: {
      font?: string;
      color?: string;
    } = {},
  ) {
    this.ctx.save();
    this.ctx.translate(point.X, point.Y);
    this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.translate(-point.X, -point.Y);
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = options.font ?? "12px sans-serif";
    this.ctx.fillStyle = options.color ?? "#222";
    this.ctx.fillText(`${text}`, point.X, point.Y);
    this.ctx.restore();
  }

  private drawCanvasSelect(point: Point): void {

    this.ctx.setLineDash([2, 3]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 1;
    this.ctx.arc(point.x, point.y, this.radius - 4, 0, 2 * Math.PI, true);
    this.ctx.stroke();
    this.ctx.setLineDash([0]);
  }

  // Event
  private drawCanvasEvent(point: Point, num: string): void {
    this.ctx.beginPath();
    this.ctx.fillStyle = "#fff";
    this.ctx.strokeStyle = "#000";
    this.ctx.lineWidth = 2;
    this.ctx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI, true);
    this.ctx.stroke();
    // ctx.fill();
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${this.radius * 1.2}px sans-serif`;
    this.ctx.fillStyle = "#000";
    this.ctx.fillText(`${num}`, point.x, point.y);
  }

  private drawCanvasTask(
    p1: Point,
    p2: Point,
    name: string,
    dashed: boolean = false,
  ): void {
    const helpLine = new Line(p1, p2);
    const point1 = helpLine.createPointOnLineStart(-this.radius);
    const point2 = helpLine.createPointOnLineEnd(-this.radius - 1);

    const line = new Line(point1, point2);
    const arrowPoint1 = line.createPointOnLineEnd(-20);
    const arrowPoint2 = line.createPointOnLineEnd(-16);
    const arrowLine = new Line(arrowPoint1, point2);
    const [left, right] = arrowLine.createProectionPointStart(6);
    const center = line.getCenterPoint();
    const lineCenter = new Line(center, point1);
    const [bottom, top] = lineCenter.createProectionPointStart(14);
    const angle = 90 - line.getGeoAzimuth();

    if (dashed) {
      this.ctx.setLineDash([5, 5]);
    }
    this.ctx.beginPath();
    this.ctx.lineJoin = "round";
    this.ctx.strokeStyle = "#222";
    this.ctx.lineWidth = 1;
    this.ctx.lineCap = "round";

    this.ctx.moveTo(line.p1.x, line.p1.Y);
    this.ctx.lineTo(line.p2.X, line.p2.Y);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.lineJoin = "miter";
    this.ctx.setLineDash([0]);
    this.ctx.moveTo(line.p2.x, line.p2.Y);
    this.ctx.lineTo(left.x, left.Y);
    this.ctx.lineTo(arrowPoint2.x, arrowPoint2.Y);
    this.ctx.lineTo(right.x, right.Y);
    this.ctx.lineTo(line.p2.X, line.p2.Y);
    this.ctx.fill();
    this.drawCanvasText(top, angle, name, {
      font: "20px sans-serif",
      color: "#888",
    });
  }
}
