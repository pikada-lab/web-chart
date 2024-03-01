import { Line } from "../geometry/line.geo";
import { Point } from "../geometry/point.geo";
import {
  CircleOptions,
  Drawer,
  LineOptions,
  RectOptions,
  TextOptions,
} from "./drawer";

export class SvgDrawer implements Drawer {
  private status = "PENDING_CREATION"; 
  private svg: SVGElement | null;
  constructor(id = "canvas") {
    this.svg = document.getElementById(id) as SVGElement | null;
    if (!this.svg) {
      this.status = "ERROR";
      return;
    } 
    this.status = "READY";  
  }

  circle(
    center: Point,
    radius: number,
    options?: CircleOptions | undefined,
  ): void {
    if (options?.dashed) {
      // this.ctx.setLineDash([2, 2]);
    }
    const g = document.createElement('g')
    const circle = document.createElement('circle') 
    circle.setAttribute('cx', `${center.x}`);
    circle.setAttribute('cy', `${center.y}`);
    circle.setAttribute('r', `${radius}`);
    circle.setAttribute('stroke', options?.borderColor ?? "#000");
    circle.setAttribute('fill', `none`); 
    // this.ctx.lineWidth = options?.with ?? 1; 
    // this.ctx.setLineDash([0]);
    g.appendChild(circle);
    this.svg?.appendChild(g);
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
    const g = document.createElement('g')
    // if (options.dashed) {
    //   this.ctx.setLineDash([3, 3]);
    // } else {
    //   this.ctx.setLineDash([0]);
    // } 
    const specLine = line.createPointOnLineEnd(-16);

    const svgLine = document.createElement('line') 
    // this.ctx.lineWidth = options.with ?? 1;
    svgLine.setAttribute('stroke', options.borderColor ?? '#000');
    svgLine.setAttribute('fill', options.borderColor ?? '#000'); 
    svgLine.setAttribute('x1', `${line.p1.X}`); 
    svgLine.setAttribute('y1', `${line.p1.Y}`);  
    // this.ctx.lineJoin = "round";
    // this.ctx.lineCap = "butt"; 
    if (options.arrowEnd) { 
      svgLine.setAttribute('x2', `${specLine.X}`); 
      svgLine.setAttribute('y2', `${specLine.Y}`);  
    } else {
      svgLine.setAttribute('x2', `${line.p2.X}`); 
      svgLine.setAttribute('y2', `${line.p2.Y}`);   
    } 
    g.appendChild(svgLine);
    this.svg!.appendChild(g);
    if (options.arrowEnd) {
      // this.ctx.setLineDash([0]);
      // const arrowPoint1 = line.createPointOnLineEnd(-20);
      // const arrowPoint2 = line.createPointOnLineEnd(-16);
      // const arrowLine = new Line(arrowPoint1, line.p2);
      // const [left, right] = arrowLine.createProectionPointStart(6);

      // this.ctx.beginPath();
      // this.ctx.lineWidth = 0;
      // this.ctx.lineJoin = "miter";
      // this.ctx.setLineDash([0]);
      // this.ctx.moveTo(line.p2.x, line.p2.Y);
      // this.ctx.lineTo(left.x, left.Y);
      // this.ctx.lineTo(arrowPoint2.x, arrowPoint2.Y);
      // this.ctx.lineTo(right.x, right.Y);
      // this.ctx.lineTo(line.p2.X, line.p2.Y);
      // this.ctx.fill();
    }
  }

  text(text: string, point: Point, angle: number, options: TextOptions): void {
    // this.ctx.textAlign = options?.align ?? "center";
    // this.ctx.textBaseline = "middle";
    // this.ctx.font = `${options.italic ? "italic" : ""} ${options.bold ? "bold" : ""} ${options.fontSize ?? 12}px ${options.fotnFamily ?? "sans-serif"}`;
    // this.ctx.fillStyle = options.color ?? "#222";
    // if (angle === 0) {
    //   this.ctx.fillText(`${text}`, point.X, point.Y);
    // } else {
    //   this.ctx.save();
    //   this.ctx.translate(point.X, point.Y);
    //   this.ctx.rotate(angle);
    //   this.ctx.translate(-point.X, -point.Y);
    //   this.ctx.fillText(`${text}`, point.X, point.Y);
    //   this.ctx.restore();
    // }
  }

  rectangle(point1: Point, point2: Point, options: RectOptions): void {
    // if (options?.backgroundColor) {
    //   this.ctx.fillStyle = options.backgroundColor;
    //   this.ctx.fillRect(
    //     point1.x,
    //     point1.y,
    //     point2.x - point1.x,
    //     point2.y - point1.y,
    //   );
    //   this.ctx.fill();
    // }

    // this.ctx.beginPath();
    // this.ctx.lineJoin = "miter";

    // this.ctx.strokeStyle = options?.borderColor ?? "#000";
    // this.ctx.lineWidth = options?.with ?? 1;
    // this.ctx.strokeRect(
    //   point1.x,
    //   point1.y,
    //   point2.x - point1.x,
    //   point2.y - point1.y,
    // );
    // this.ctx.stroke();
  }
  setCursor(cursor: "default" | "pointer" | "move"): void {
    // this.canvas!.style.cursor = cursor;
  }

  private isReady(): boolean {
    return this.status === "READY";
  }

  public clear(): void {
    // this.canvas!.style.cursor = "default";
    // this.ctx.clearRect(0, 0, 1920, 1080);
  }
}
