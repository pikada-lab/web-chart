import { Line } from "../lib/geometry/line.geo";
import { Point } from "../lib/geometry/point.geo";

export interface CircleOptions {
  dashed?: boolean;
  borderColor?: string;
  with?: number;
}
export interface LineOptions {
  arrowEnd?: boolean;
  arrowSize?: number;
  dashed?: boolean;
  borderColor?: string;
  with?: number;
}
export interface TextOptions {
  color?: string;
  fontSize?: number;
  fotnFamily?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "right" | "center";
}
export interface RectOptions {
  borderColor?: string;
  with?: number;
  backgroundColor?: string;
}

/**
 * Умеет рисовать абстрактные примитивы - линии, круги, и т.п.
 */
export interface Drawer {
  getId(): string;
  clear(): void;
  circle(center: Point, radius: number, options?: CircleOptions): void;
  line(point1: Point, point2: Point, options?: LineOptions): void;
  line(point1: Line, options?: LineOptions): void;
  text(text: string, point: Point, angle: number, options: TextOptions): void;
  rectangle(point1: Point, point2: Point, options: RectOptions): void;
  setCursor(cursor: "default" | "pointer" | "move"): void;
}
