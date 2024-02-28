export class Point {
  private x: number;
  private y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get X() {
    return this.x;
  }

  get Y() {
    return this.y;
  }

  static From(x: Point | number, y: number): Point {
    if (x instanceof Point) {
      return new Point(x.x, x.y);
    }
    return new Point(x, y);
  }

  static Empty(): Point {
    return new Point(0, 0);
  }
}
