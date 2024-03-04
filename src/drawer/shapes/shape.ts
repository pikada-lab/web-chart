import { Point } from "../../lib/geometry/point.geo";
import { Drawer } from "../drawer";

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

  intersect(point: Point): boolean;
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

export function isSelectable(shape: unknown): shape is Selectable {
  return (
    typeof shape === "object" &&
    !!shape &&
    "select" in shape &&
    typeof shape.select === "function" &&
    shape.select.length >= 1 &&
    "intersect" in shape &&
    typeof shape.intersect === "function" &&
    shape.intersect.length >= 1
  );
}

export function isDragable(shape: unknown): shape is Dragable {
  return (
    typeof shape === "object" &&
    !!shape &&
    "drag" in shape &&
    typeof shape.drag === "function" &&
    shape.drag.length >= 1 &&
    "drop" in shape &&
    typeof shape.drop === "function" &&
    shape.drop.length >= 1
  );
}
