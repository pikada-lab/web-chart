import { Line } from "../geometry/line.geo";
import { Point } from "../geometry/point.geo";

export interface Shape {
  /**
   * умеет перемещать фигуру по холсту
   */
  move(point: Point): void;
  /**
   * Умеет рисовать эту фигуру на холсте
   */
  draw(drawer: Drawer): void;
}

export interface Selectable {
  /**
   * Выделяет объект для действий над ним
   */
  select(isSelect: boolean): void;
}

export interface Dragable {
  /**
   * Переносит мышью (Добавляет тень, мышь или ещё что)
   */
  drag(point: Point): void;
  /**
   * Оканчивает перемещение
   */
  drop(point: Point): void;
}

export interface CircleOptions {}
export interface LineOptions {}
export interface TextOptions {}

/**
 * Умеет рисовать абстрактные примитивы - линии, круги, и т.п.
 */
export interface Drawer {
  clear(): void;
  circle(center: Point, radius: number, options?: CircleOptions): void;
  line(point1: Point, point2: Point, options?: LineOptions): void;
  line(point1: Line, options?: LineOptions): void;
  text(text: string, point: Point, angle: number, options: TextOptions): void;
  rect(point1: Point, point2: Point, options: TextOptions): void;
  setCursor(cursor: "default" | "pointer" | "move"): void;
}
