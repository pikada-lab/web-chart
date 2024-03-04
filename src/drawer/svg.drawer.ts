import { Line } from "../lib/geometry/line.geo";
import { Point } from "../lib/geometry/point.geo";
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
  constructor(private readonly id = "canvas") {
    this.svg = document.getElementById(id) as SVGElement | null;
    if (!this.svg) {
      this.status = "ERROR";
      return;
    }
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
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    if (options?.dashed) {
      circle.setAttribute("stroke-dasharray", "3, 3");
    }
    circle.setAttribute("cx", `${center.x}`);
    circle.setAttribute("cy", `${center.y}`);
    circle.setAttribute("r", `${radius}`);
    circle.setAttribute("stroke", options?.borderColor ?? "#000");
    circle.setAttribute("fill", `none`);
    circle.setAttribute("stroke-width", options?.with?.toString() ?? "1");
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
    const aSize = options.arrowSize ?? 1;
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    // else {
    //   this.ctx.setLineDash([0]);
    // }
    const specLine = line.createPointOnLineEnd(-16 * aSize);

    const svgLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line",
    );
    if (options?.dashed) {
      svgLine.setAttribute("stroke-dasharray", "5, 5");
    }
    // this.ctx.lineWidth = options.with ?? 1;
    svgLine.setAttribute("stroke", options.borderColor ?? "#000");
    svgLine.setAttribute("stroke-width", options?.with?.toString() ?? "1");
    svgLine.setAttribute("x1", `${line.p1.X}`);
    svgLine.setAttribute("y1", `${line.p1.Y}`);
    // this.ctx.lineJoin = "round";
    // this.ctx.lineCap = "butt";
    if (options?.arrowEnd) {
      svgLine.setAttribute("x2", `${specLine.X}`);
      svgLine.setAttribute("y2", `${specLine.Y}`);
    } else {
      svgLine.setAttribute("x2", `${line.p2.X}`);
      svgLine.setAttribute("y2", `${line.p2.Y}`);
    }
    g.appendChild(svgLine);
    this.svg!.appendChild(g);
    if (options.arrowEnd) {
      // this.ctx.setLineDash([0]); 
      const arrowPoint1 = line.createPointOnLineEnd(-20 * aSize );
      const arrowPoint2 = line.createPointOnLineEnd(-16 * aSize);
      const arrowLine = new Line(arrowPoint1, line.p2);
      const [left, right] = arrowLine.createProectionPointStart(6 * aSize);

      const svgArrow = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline",
      );

      svgArrow.setAttribute(
        "points",
        [
          line.p2.toSVG(),
          left.toSVG(),
          arrowPoint2.toSVG(),
          right.toSVG(),
          line.p2.toSVG(),
        ].join(" "),
      );
      svgArrow.setAttribute("fill", options.borderColor ?? "#000");
      g.appendChild(svgArrow);
    }
  }

  text(text: string, point: Point, angle: number, options: TextOptions): void {
    const svgText = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    svgText.innerHTML = text;
    const align = options.align ?? "center";
    const textAnchor =
      align === "center" ? "middle" : align === "left" ? "start" : "end";
    // svgText.setAttribute("rotate", `${angle}rad`);
    // svgText.style.transformOrigin = `50% 50%`;

    svgText.style.transform = `translate(${point.X}px, ${point.Y}px) rotate(${angle}rad)`;

    // svgText.style.rotate = `${angle}rad`;
    // svgText.setAttribute("x", `${point.X}`);
    // svgText.setAttribute("y", `${point.Y}`);
    svgText.setAttribute("text-anchor", textAnchor);
    svgText.setAttribute("alignment-baseline", "middle");
    svgText.setAttribute("font-size", `${options.fontSize ?? 12}px`);
    svgText.style.fontFamily = options.fotnFamily ?? "sans-serif";
    svgText.style.fontWeight = options.bold ? "bold" : "";
    svgText.style.fontStyle = options.italic ? "italic" : "";
    svgText.style.fill = options.color ?? "#222";
    this.svg!.appendChild(svgText);
  }

  rectangle(point1: Point, point2: Point, options: RectOptions): void {
    const svgRect = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );

    svgRect.setAttribute("x", `${point1.X}`);
    svgRect.setAttribute("y", `${point1.Y}`);
    svgRect.setAttribute("width", `${point2.x - point1.x}`);
    svgRect.setAttribute("height", `${point2.y - point1.y}`);
    svgRect.setAttribute("stroke", `${options?.borderColor ?? "#000"}`);
    svgRect.setAttribute("stroke-width", options?.with?.toString() ?? "1");
    if (options?.backgroundColor) {
      svgRect.setAttribute("fill", `${options.backgroundColor}`);
    } else {
      svgRect.setAttribute("fill", `transparent`);
    }
    this.svg?.appendChild(svgRect);
  }
  setCursor(cursor: "default" | "pointer" | "move"): void {
    if (this.svg) {
      this.svg!.style.cursor = cursor;
    }
  }

  private isReady(): boolean {
    return this.status === "READY";
  }

  public clear(): void {
    // this.canvas!.style.cursor = "default";
    // this.ctx.clearRect(0, 0, 1920, 1080);
    if (this.isReady()) {
      this.svg!.innerHTML = "";
    }
  }
}
