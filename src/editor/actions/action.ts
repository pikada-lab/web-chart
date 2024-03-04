import { Point } from "../../lib/geometry/point.geo";

export interface Action {
  onMouseDown(point: Point): void;
  onMouseUp(point: Point): void;
  onMouseMove(point: Point): void;
  onKeyPress(event: KeyboardEvent): void;
}
