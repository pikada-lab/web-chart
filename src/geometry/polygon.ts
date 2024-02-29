import { Coordinate } from "./model";

/**
 * Функция определяет
 *
 * @param point проверяемая точка
 * @param polygon полигон, по отношению к которому проверяется точка
 */
export function pointInPolygon(
  point: Coordinate,
  polygon: Coordinate[],
): boolean {
  const [x, y] = point;
  let inPolygon = false;
  for (const i in polygon) {
    const [xp, yp] = polygon[i];
    const [xpPrev, ypPrev] =
      +i > 0 ? polygon[+i - 1] : polygon[polygon.length - 1];
    if (
      ((yp <= y && y < ypPrev) || (ypPrev <= y && y < yp)) &&
      x > ((xpPrev - xp) * (y - yp)) / (ypPrev - yp) + xp
    ) {
      inPolygon = !inPolygon;
    }
  }
  return inPolygon;
}
