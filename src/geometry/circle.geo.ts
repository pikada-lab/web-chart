import { Point } from './point.geo';

export class Circle {
  constructor(public p1: Point, public r: number) {}

  static createByThreePoint(p1: Point, p2: Point, p3: Point): Circle {
    const A = p2.x - p1.x;
    const B = p2.y - p1.y;
    const C = p3.x - p1.x;
    const D = p3.y - p1.y;
    const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
    const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
    const G = 2 * (A * (p3.y - p2.y) - B * (p3.x - p2.x));
    if (G === 0) {
      throw new Error('Построение - Все точки на одной линии');
    }
    // координаты центра
    const Cx = (D * E - B * F) / G;
    const Cy = (A * F - C * E) / G;
    // радиус
    const R = Math.sqrt((p1.x - Cx) ** 2 + (p1.y - Cy) ** 2);
    // вернем параметры круга
    return new Circle(new Point(Cx, Cy), R);
  }

  getCenter(): Point {
    return this.p1;
  }

  /** Найти касательную к окружности по точке ( возвращает две точки ) */
  getTangent(p: Point): Point[] {
    const dx = this.p1.X - p.X;
    const dy = this.p1.Y - p.Y;
    const dd = Math.sqrt(dx * dx + dy * dy);
    const a = Math.asin(this.r / dd);
    const b = Math.atan2(dy, dx);
    const t1 = b - a;
    const t2 = b + a;
    const pR1 = new Point(0, 0);
    const pR2 = new Point(0, 0);
    pR1.x = this.p1.X + this.r * Math.sin(t1);
    pR1.y = this.p1.Y + this.r * -Math.cos(t1);

    pR2.x = this.p1.X + this.r * -Math.sin(t2);
    pR2.y = this.p1.Y + this.r * Math.cos(t2);

    return [pR1, pR2];
  }
}
