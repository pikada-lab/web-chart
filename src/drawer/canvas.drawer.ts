import { Line } from "../lib/geometry/line.geo";
import { Point } from "../lib/geometry/point.geo";
import {
  CircleOptions,
  Drawer,
  LineOptions,
  RectOptions,
  TextOptions,
} from "./drawer";

export class CanvasDrawer implements Drawer {
  private status = "PENDING_CREATION";
  private ctx!: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement | null;
  constructor(private readonly id = "canvas") {
    this.canvas = document.getElementById(id) as HTMLCanvasElement | null;
    if (!this.canvas) {
      this.status = "ERROR";
      return;
    }
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.status = "READY";
  }

  getId(): string {
    return this.id;
  }

  circle(
    center: Point,
    radius: number,
    options?: CircleOptions | undefined,
  ): void {
    if (options?.dashed) {
      this.ctx.setLineDash([2, 2]);
    }
    this.ctx.beginPath();
    this.ctx.strokeStyle = options?.borderColor ?? "#000";
    this.ctx.lineWidth = options?.with ?? 1;
    this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI, true);
    this.ctx.stroke();
    this.ctx.setLineDash([0]);
  }

  line(point1: Point, point2: Point, options?: LineOptions | undefined): void;
  line(point1: Line, options?: LineOptions | undefined): void;
  line(point1: unknown, point2?: unknown, options?: unknown): void {
    let line: Line | null = null;
    if (point1 instanceof Point) {
      if (point2 instanceof Point) {
        // line point -> point
        line = new Line(point1, point2);
      }
    } else if (point1 instanceof Line) {
      // line like line
      line = point1;
      options = point2;
    }

    if (!line) {
      return;
    }
    this.lineAsLine(line, options as LineOptions);

    // Отменить отрисовку пунктиром
  }

  private lineAsLine(line: Line, options: LineOptions = {}): void {
    const aSize = options.arrowSize ?? 1;
    if (options.dashed) {
      this.ctx.setLineDash([3 * aSize, 3 * aSize]);
    } else {
      this.ctx.setLineDash([0]);
    }
    const specLine = line.createPointOnLineEnd(-16 * aSize);
    this.ctx.lineWidth = options.with ?? 1;
    this.ctx.strokeStyle = options.borderColor ?? "#000";
    this.ctx.fillStyle = options.borderColor ?? "#000";
    this.ctx.beginPath();
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "butt";
    this.ctx.moveTo(line.p1.x, line.p1.Y);
    if (options.arrowEnd) {
      this.ctx.lineTo(specLine.X, specLine.Y);
    } else {
      this.ctx.lineTo(line.p2.X, line.p2.Y);
    }
    this.ctx.stroke();

    if (options.arrowEnd) {
      this.ctx.setLineDash([0]);
      const arrowPoint1 = line.createPointOnLineEnd(-20 * aSize);
      const arrowPoint2 = line.createPointOnLineEnd(-16 * aSize);
      const arrowLine = new Line(arrowPoint1, line.p2);
      const [left, right] = arrowLine.createProectionPointStart(6 * aSize);

      this.ctx.beginPath();
      this.ctx.lineWidth = 0;
      this.ctx.lineJoin = "miter";
      this.ctx.setLineDash([0]);
      this.ctx.moveTo(line.p2.x, line.p2.Y);
      this.ctx.lineTo(left.x, left.Y);
      this.ctx.lineTo(arrowPoint2.x, arrowPoint2.Y);
      this.ctx.lineTo(right.x, right.Y);
      this.ctx.lineTo(line.p2.X, line.p2.Y);
      this.ctx.fill();
    }
  }

  text(text: string, point: Point, angle: number, options: TextOptions): void {
    this.ctx.textAlign = options?.align ?? "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = `${options.italic ? "italic" : ""} ${options.bold ? "bold" : ""} ${options.fontSize ?? 12}px ${options.fotnFamily ?? "sans-serif"}`;
    this.ctx.fillStyle = options.color ?? "#222";
    if (angle === 0) {
      this.ctx.fillText(`${text}`, point.X, point.Y);
    } else {
      this.ctx.save();
      this.ctx.translate(point.X, point.Y);
      this.ctx.rotate(angle);
      this.ctx.translate(-point.X, -point.Y);
      this.ctx.fillText(`${text}`, point.X, point.Y);
      this.ctx.restore();
    }
  }

  rectangle(point1: Point, point2: Point, options: RectOptions): void {
    if (options?.backgroundColor) {
      this.ctx.fillStyle = options.backgroundColor;
      this.ctx.fillRect(
        point1.x,
        point1.y,
        point2.x - point1.x,
        point2.y - point1.y,
      );
      this.ctx.fill();
    }

    this.ctx.beginPath();
    this.ctx.lineJoin = "miter";

    this.ctx.strokeStyle = options?.borderColor ?? "#000";
    this.ctx.lineWidth = options?.with ?? 1;
    this.ctx.strokeRect(
      point1.x,
      point1.y,
      point2.x - point1.x,
      point2.y - point1.y,
    );
    this.ctx.stroke();
  }
  setCursor(cursor: "default" | "pointer" | "move"): void {
    this.canvas!.style.cursor = cursor;
  }

  private isReady(): boolean {
    return this.status === "READY";
  }

  public clear(): void {
    this.canvas!.style.cursor = "default";
    this.ctx.clearRect(0, 0, 1920, 1080);
  }
}
