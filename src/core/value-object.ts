export abstract class ValueObject<T> {
  protected constructor(public readonly value: T) {}

  // static Create<T>(value: T): Result<ValueObject<T>> {
  //   throw new Error('Не реализован в объекте значения');
  // }

  public equal(vo: ValueObject<T>): boolean {
    if (!vo) {
      return false;
    }
    if (vo.constructor.name !== this.constructor.name) {
      return false;
    }
    return vo.value === this.value;
  }

  public notEqual(vo: ValueObject<T>): boolean {
    return !this.equal(vo);
  }
}
