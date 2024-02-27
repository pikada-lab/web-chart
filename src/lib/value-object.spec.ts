import { ValueObject } from "./value-object";
import { Result } from "./result";

class AnyValueObject extends ValueObject<string> {
  public static Create(value: any): Result<AnyValueObject> {
    if (typeof value !== "string") {
      return Result.failure("Не является строкой");
    }
    return Result.success(new AnyValueObject(value));
  }
}

class SomeValueObject extends ValueObject<string> {
  public static Create(value: any): Result<SomeValueObject> {
    if (typeof value !== "string") {
      return Result.failure("Не является строкой");
    }
    return Result.success(new SomeValueObject(value));
  }
}

describe("Проверка равенства объектов значения", () => {
  it("должен быть равен", () => {
    // Arrange
    const sut = AnyValueObject.Create("123").value;
    const vo = AnyValueObject.Create("123").value;

    // Act
    const result = sut.equal(vo);

    // Assert
    expect(result).toBeTruthy();
  });
  it("должен быть не равен", () => {
    // Arrange
    const sut = AnyValueObject.Create("123").value;
    const vo = AnyValueObject.Create("1234").value;

    // Act
    const result = sut.equal(vo);

    // Assert
    expect(result).toBeFalsy();
  });
  it("должен быть не равен", () => {
    // Arrange
    const sut = AnyValueObject.Create("123").value;
    const vo = SomeValueObject.Create("123").value;

    // Act
    const result = sut.equal(vo);

    // Assert
    expect(result).toBeFalsy();
  });
});
