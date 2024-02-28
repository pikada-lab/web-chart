import { Coordinate, PointObject } from './model';
import { Primitive } from './primitive.geo';
 

export class Point extends Primitive {
  static degreePerMetr = 180 / (Math.PI * 6371000);
  public x: number;
  public y: number;

  get longitude(): number {
    return this.x;
  }

  get latitude(): number {
    return this.y;
  }

  static empty(): Point {
    return new Point(Infinity, Infinity);
  }

  static from(coor: Point | Coordinate | PointObject | number[] | undefined): Point {
    if (!coor) {
      return Point.empty();
    }
    if (coor instanceof Point) {
      return new Point(coor.X, coor.Y);
    }
    if (Point.isCoordinate(coor)) {
      return Point.createByCoordinate(coor);
    }
    if (Point.isArray(coor)) {
      return Point.createByCoordinate(coor as Coordinate);
    }
    return Point.fromObject(coor);
  }

  static isArray(coor: unknown): coor is number[] {
    return (
      Array.isArray(coor) &&
      coor.length >= 2 &&
      typeof coor[0] === 'number' &&
      typeof coor[1] === 'number'
    );
  }

  static isCoordinate(coor: unknown): coor is Coordinate {
    return (
      Array.isArray(coor) &&
      coor.length >= 2 &&
      typeof coor[0] === 'number' &&
      typeof coor[1] === 'number'
    );
  }

  static createByCoordinate(coor: Coordinate): Point {
    return new Point(coor[0], coor[1]);
  }

  static fromObject(coordinate: PointObject): Point {
    return new Point(coordinate.longitude, coordinate.latitude);
  }

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }

  isEmpty(): boolean {
    return !(this.X || this.Y);
  }

  toCoordinate(): Coordinate {
    return [this.x, this.y];
  }

  toObject(): PointObject {
    return { longitude: this.x, latitude: this.y };
  }

  normalize(): this {
    while (this.x < -360) {
      this.x += 360;
    }
    while (this.x > 360) {
      this.x -= 360;
    }
    while (this.y < -360) {
      this.y += 360;
    }
    while (this.y > 360) {
      this.y -= 360;
    }
    return this;
  }

  get X(): number {
    return this.x;
  }

  get Y(): number {
    return this.y;
  }

  equal(p2: Point): boolean {
    return p2.X === this.X && p2.Y === this.Y;
  }

  /**
   * Найти ближайшую из массива точку
   *
   */
  nearest(points: Point[]): Point {
    if (!Array.isArray(points)) {
      throw new Error('Point.nearest на вход должна получать массив точек');
    }
    if (points.length === 0) {
      throw new Error('Point.nearest на вход должна получать массив больше 0 значения');
    }
    if (points.length === 1) {
      return points[0];
    }
    return points
      .map((r) => ({ point: r, length: this.length(r) }))
      .reduce((acc, prev) => {
        if (!acc) {
          return prev;
        }
        return acc.length > prev.length ? prev : acc;
      }, null as any).point;
  }

  offsetX(X: number): this {
    this.x += X;
    return this;
  }

  offsetY(Y: number): this {
    this.y += Y;
    return this;
  }

  setCoordinate(p: Point): this {
    this.x = p.x;
    this.y = p.y;
    return this;
  }
 

  offsetMetrX(X: number): this {
    const R = 6371; // km
    const lat = this.toRad(this.y);
    const Rtop = R * Math.cos(lat);
    // const angle = 2 * this.toGrad(Math.asin(X / (2000 * Rtop)));
    this.x += (X * 180) / (Math.PI * Rtop);
    return this;
  }

  offsetMetrY(Y: number): this {
    this.y += Y * Point.degreePerMetr;
    return this;
  }

  toGrad(n: number): number {
    return (n * 180) / Math.PI;
  }

  toRad(n: number): number {
    return (n * Math.PI) / 180;
  } 

  length(point: Point): number {
    return Math.sqrt((this.x - point.x) ** 2 + (this.y - point.y) ** 2);
  }

  toString(): string {
    return `${Math.round(this.x)}x${Math.round(this.y)}`;
  }
 

  /**
   * Этот запрос влияет на сборку дерева флагов
   */
  toKey(): string {
    return `${this.x}x${this.y}`;
  }
 
  clone(): Point {
    return new Point(this.X, this.Y);
  }

  gtX(p2: Point): boolean {
    return this.X > p2.X;
  }

  ltX(p2: Point): boolean {
    return this.X < p2.X;
  }

  gtY(p2: Point): boolean {
    return this.Y > p2.Y;
  }

  ltY(p2: Point): boolean {
    return this.Y < p2.Y;
  }
}
