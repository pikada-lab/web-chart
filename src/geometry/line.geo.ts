import { Coordinate } from "./model";
import { Point } from "./point.geo";
import { Primitive } from "./primitive.geo";

export class Line extends Primitive {
  public p1: Point;
  public p2: Point;

  constructor(p1: Point, p2: Point) {
    super();
    this.p1 = p1 ?? new Point(0, 0);
    this.p2 = p2 ?? new Point(0, 0);
  }

  static from(coord: Line | Coordinate[]): Line;
  static from(coord: Point, azimuth: Point): Line;
  static from(center: Point, azimuth: number, length: number): Line;
  static from(
    coord: Coordinate[] | Point | Line,
    azimuth?: number | Point,
    length?: number,
  ): Line {
    if (coord instanceof Point && azimuth instanceof Point) {
      return new Line(coord, azimuth);
    }
    if (coord instanceof Point) {
      if (typeof azimuth === "number" && typeof length === "number") {
        return Line.fromAzimuth(coord, azimuth, length);
      }
      throw new Error(
        "Невозможно создать линию через азимут. Необходим азимут и длина с числовым типом.",
      );
    }
    if (coord instanceof Line) {
      return Line.from(coord.toCoordinate());
    }
    return Line.from(coord);
  }

  static fromCoordinate(coord: Coordinate[]): Line {
    const p1 = Point.createByCoordinate(coord[0]);
    const p2 = Point.createByCoordinate(coord[1]);
    return new Line(p1, p2);
  }

  static fromAzimuth(center: Point, azimuth: number, length: number): Line {
    const rad = Math.PI / 180;
    const p2 = center.clone();
    p2.x += length * Math.sin(azimuth * rad);
    p2.y += length * Math.cos(azimuth * rad);
    return new Line(center, p2);
  }

  public copy(): Line {
    return Line.from(this.p1, this.p2);
  }

  reverse(): this {
    const tmp = this.p1;
    this.p1 = this.p2;
    this.p2 = tmp;
    return this;
  }

  /**
   * Возвращает азимут отрезка в проекции экрана
   */
  getAzimuth(): number {
    try {
      const dx = this.p2.X - this.p1.X;
      const dy = this.p2.Y - this.p1.Y;
      let p = Math.abs(dx) / dx;
      if (Number.isNaN(p)) {
        p = 1;
      }
      return (180 * p * Math.acos(dy / Math.sqrt(dx ** 2 + dy ** 2))) / Math.PI;
    } catch (ex) {
      console.warn(ex);
      return 0;
    }
  }

  /**
   * Возвращает угол в радианах
   */
  getAngle(): number {
    try {
      const dx = this.p2.X - this.p1.X;
      const dy = this.p2.Y - this.p1.Y;
      let p = Math.abs(dx) / dx;
      if (Number.isNaN(p)) {
        p = 1;
      }
      return -Math.PI / 2 + p * Math.acos(dy / Math.sqrt(dx ** 2 + dy ** 2));
    } catch (ex) {
      console.warn(ex);
      return 0;
    }
  }

  /**
   * Возвращает азимут отрезка в проекции экрана
   */
  getGeoAzimuth(): number {
    try {
      const dx = this.p2.X - this.p1.X;
      const dy = this.p2.Y - this.p1.Y;
      let p = Math.abs(dx) / dx;
      if (Number.isNaN(p)) {
        p = 1;
      }
      return (180 * p * Math.acos(dy / Math.sqrt(dx ** 2 + dy ** 2))) / Math.PI;
    } catch (ex) {
      console.warn(ex);
      return 0;
    }
  }

  getProectionPoint(C: Point): Point | undefined {
    const CF = this.ortoProection(C);
    if (CF > 1 || CF < 0) {
      return undefined;
    }
    return this.getPointByProection(CF);
  }

  getPointByProection(CF: number): Point {
    const D = new Point(0, 0);
    const A = this.p1;
    const B = this.p2;
    D.x = A.X + (B.X - A.X) * CF;
    D.y = A.Y + (B.Y - A.Y) * CF;
    return D;
  }

  createProectionPointEnd(r: number): [Point, Point] {
    const C1 = new Point(0, 0);
    const C2 = new Point(0, 0);
    const A = this.p1;
    const B = this.p2;
    const D = this.getLength();
    C1.x = B.x + (r * (A.Y - B.Y)) / D;
    C1.y = B.y - (r * (A.X - B.X)) / D;

    C2.x = B.x - (r * (A.Y - B.Y)) / D;
    C2.y = B.y + (r * (A.X - B.X)) / D;
    return [C1, C2];
  }

  createProectionPointStart(r: number): [Point, Point] {
    const C1 = new Point(0, 0);
    const C2 = new Point(0, 0);
    const A = this.p2;
    const B = this.p1;
    const D = this.getLength();
    C1.x = B.x + (r * (A.Y - B.Y)) / D;
    C1.y = B.y - (r * (A.X - B.X)) / D;

    C2.x = B.x - (r * (A.Y - B.Y)) / D;
    C2.y = B.y + (r * (A.X - B.X)) / D;
    return [C1, C2];
  }

  /**
   * Вычисляет расстояние на карте, если координаты это градусы то значение получается в метрах
   */
  getSize(): number {
    const p1 = this.p1.toObject();
    const lat1 = p1.latitude;
    const lon1 = p1.longitude;
    const p2 = this.p2.toObject();
    const lat2 = p2.latitude;
    const lon2 = p2.longitude;
    const R = 6371; // km
    const dLat = Line.ToRad(lat2 - lat1);
    const dLon = Line.ToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(Line.ToRad(lat1)) *
        Math.cos(Line.ToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static ToRad(n: number): number {
    return (n * Math.PI) / 180;
  }

  /** Строит точку на прямой через промежуток d2 с начала */
  createPointOnLineStart(d2: number): Point {
    const A = this.getPointByProection(0);
    const B = this.getPointByProection(1);
    const d1 = this.getLength();
    const x = A.X + (d2 * (A.X - B.X)) / d1;
    const y = A.Y + (d2 * (A.Y - B.Y)) / d1;
    return new Point(x, y);
  }

  /** Строит точку на прямой через промежуток d2 с конца в градусах  */
  createPointOnLineEnd(d2: number): Point {
    const A = this.getPointByProection(1);
    const B = this.getPointByProection(2);
    const d1 = this.getLength();
    const x = A.X - (d2 * (A.X - B.X)) / d1;
    const y = A.Y - (d2 * (A.Y - B.Y)) / d1;
    return new Point(x, y);
  }

  getLength(): number {
    return Math.sqrt(
      (this.p1.x - this.p2.x) ** 2 + (this.p1.y - this.p2.y) ** 2,
    );
  }

  getCenter(): Point {
    return this.getPointByProection(0.5);
  }

  /**
   * Высчитывает каэффициэнт CF от 0 - 1 где 0 это начало линии, а 1 это конец,
   * если CF лежит вне предела 0,1 то проекция лежит за пределами отрезка
   */
  ortoProection(C: Point): number {
    const A = this.p1;
    const B = this.p2;
    const CF =
      ((B.X - A.X) * (C.X - A.X) + (B.Y - A.Y) * (C.Y - A.Y)) /
      ((B.X - A.X) ** 2 + (B.Y - A.Y) ** 2);
    return CF;
  }

  /**
   *
   */
  setCoordinate(p1: Point, p2: Point): this {
    this.p1.setCoordinate(p1);
    this.p2.setCoordinate(p2);
    return this;
  }

  toString(): string {
    return `L ${this.p1} -> ${this.p2}`;
  }

  toCoordinate(): Coordinate[] {
    return [this.p1.toCoordinate(), this.p2.toCoordinate()];
  }

  clone(): Line {
    return new Line(this.p1.clone(), this.p2.clone());
  }
}
