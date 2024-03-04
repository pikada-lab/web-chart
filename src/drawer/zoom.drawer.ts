import { Line } from "../lib/geometry/line.geo";
import { Point } from "../lib/geometry/point.geo";
import {
  CircleOptions,
  Drawer,
  LineOptions,
  RectOptions,
  TextOptions,
} from "./drawer";

export class ZoomDrawer implements Drawer {
  private zoom: number = 1;
  private pan: Point = Point.empty();
  constructor(private readonly drawer: Drawer) {}

  setPan(point: Point): void {
    this.pan = point;
  }

  setZoom(z: number): void {
    this.zoom = z;
  }

  plusZoom(z: number): void {
    this.zoom += z;
  }

  plusPan(offset: Point): void {
    this.pan = this.pan.offset(offset);
  }
  getId(): string {
    return this.drawer.getId();
  }

  clear(): void {
    this.drawer.clear();
  }

  circle(
    center: Point,
    radius: number,
    options: CircleOptions = {},
  ): void {
    
    if ((options as LineOptions)?.with) {
        (options as  LineOptions)!.with! *= this.zoom;
    } else {
        options.with = 1 * this.zoom;
    }
    this.drawer.circle(
      center.times(this.zoom).offset(this.pan),
      radius * this.zoom,
      options,
    );
  }

  line(point1: Point, point2: Point, options?: LineOptions | undefined): void;
  line(point1: Line, options?: LineOptions | undefined): void;
  line(point1: unknown, point2?: unknown, options?: unknown): void {
    if (point1 instanceof Line) {
        if (!point2) {
            point2 = {} as LineOptions;
        }
        if ((point2 as LineOptions)?.arrowSize) {
            (point2 as  LineOptions)!.arrowSize! *= this.zoom;
        } else {
            (point2 as LineOptions)!.arrowSize = 1 * this.zoom;
        }
        if ((point2 as LineOptions)?.with) {
            (point2 as  LineOptions)!.with! *= this.zoom;
        }  else {
            (point2 as LineOptions).with = 1 * this.zoom;
        }
        this.drawer.line(
            point1.p1.times(this.zoom).offset(this.pan) as Point,
            point1.p2.times(this.zoom).offset(this.pan) as Point,
            point2 as LineOptions,
          );
    } else if (point1 instanceof Point && point2 instanceof Point) {
        if (!options) {
            options = {} as LineOptions;
        }
        if ((options as LineOptions)?.arrowSize) {
            (options as  LineOptions)!.arrowSize! *= this.zoom;
        } else {
            (options as  LineOptions).arrowSize = 1 * this.zoom;
        }
        if ((options as LineOptions)?.with) {
            (options as  LineOptions)!.with! *= this.zoom;
        } else {
            (options as  LineOptions).with = 1 * this.zoom;
        }
      this.drawer.line(
        point1.times(this.zoom).offset(this.pan) as Point,
        point2.times(this.zoom).offset(this.pan) as Point,
        options as LineOptions,
      );
    }
  }

  text(text: string, point: Point, angle: number, options: TextOptions): void {
    if (options.fontSize) {
        options.fontSize = options.fontSize * this.zoom;
    }
    this.drawer.text(
      text,
      point.times(this.zoom).offset(this.pan),
      angle,
      options,
    );
  }

  rectangle(point1: Point, point2: Point, options: RectOptions): void {
    
    if ((options as RectOptions)?.with) {
        (options as  RectOptions)!.with! *= this.zoom;
    } else {
        (options as  RectOptions).with = 1 * this.zoom;
    }
    this.drawer.rectangle(
      point1.times(this.zoom).offset(this.pan),
      point2.times(this.zoom).offset(this.pan),
      options,
    );
  }

  setCursor(cursor: "default" | "pointer" | "move"): void {
    this.drawer.setCursor(cursor);
  }
}
