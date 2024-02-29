import { Duration } from "./duration";

describe("Продолжительность во времени", () => {
  it("Должен корректно создвавть 50m", () => {
    // Arrange
    const value = "50m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(50);
  });
  it("Должен корректно создвавть 50", () => {
    // Arrange
    const value = 50;

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(50);
  });
  it("Должен корректно создвавть 1h", () => {
    // Arrange
    const value = "1h";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(60);
    expect(sut.value.value).toBe(value);
  });
  it("Должен корректно создвавть 1d", () => {
    // Arrange
    const value = "1d";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(8 * 60);
    expect(sut.value.value).toBe(value);
  });
  it("Должен корректно создвавть 2w", () => {
    // Arrange
    const value = "2w";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(5 * 8 * 2 * 60);
    expect(sut.value.value).toBe(value);
  });
  it("Должен корректно создвавть 3w", () => {
    // Arrange
    const value = "2w";

    // Act
    const sut = Duration.Create(value).value.sum(Duration.Create("1w").value);

    // Assert
    expect(sut.getDurationOnMinutes()).toBe(5 * 8 * 3 * 60);
    expect(sut.value).toBe("3w");
  });
  it("Должен корректно пересчитывать временные характеристики", () => {
    const duration = Duration.Create(
      60 * 8 * 5 + 2 * 60 * 8 + 3 * 60 + 4,
    ).value;

    expect(duration.value).toBe("1w 2d 3h 4m");
  });
  it("Должен создавать только корректные значения", () => {
    // Arrange
    const value = "T_T";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.error).not.toEqual("");
    expect(sut.isFailure).toBeTruthy();
  });
  it("Должен создавать пустое значение", () => {
    // Arrange
    // Act
    const sut = Duration.Empty();

    // Assert
    expect(sut).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(0);
  });
  it("Должен складывать значение положительный велечин", () => {
    // Arrange
    const value1 = "50m";
    const value2 = "10m";
    const duration1 = Duration.Create(value1).value;
    const duration2 = Duration.Create(value2).value;

    // Act
    const sut = duration1.sum(duration2);

    // Assert
    expect(sut).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(60);
  });
  it("Должен складывать значение нулевых велечин", () => {
    // Arrange
    const value1 = "50m";
    const duration1 = Duration.Create(value1).value;
    const duration2 = Duration.Empty();

    // Act
    const sut = duration1.sum(duration2);

    // Assert
    expect(sut).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(50);
  });
  it("Продолжительность должна корректно умножаться", () => {
    // Arrange
    const value1 = "50m";
    const duration1 = Duration.Create(value1).value;

    // Act
    const sut = duration1.times(2);

    // Assert
    expect(sut).toBeInstanceOf(Duration);
    expect(sut.getDurationOnMinutes()).toBe(100);
  });
  it("Продолжительность должна корректно делиться", () => {
    // Arrange
    const value1 = "50m";
    const duration1 = Duration.Create(value1).value;

    // Act
    const sut = duration1.division(2);

    // Assert
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDurationOnMinutes()).toBe(25);
  });
  it("Продолжительность должна корректно сравнивать в меньшую сторону", () => {
    // Arrange
    const duration1 = Duration.Create("50m").value;
    const duration2 = Duration.Create("10m").value;

    // Act
    const sut = duration1.lt(duration2);

    // Assert
    expect(sut).toBeFalsy();
  });
  it("Продолжительность должна корректно сравнивать в меньшую сторону", () => {
    // Arrange
    const duration1 = Duration.Create("50m").value;
    const duration2 = Duration.Create("10m").value;

    // Act
    const sut = duration1.gt(duration2);

    // Assert
    expect(sut).toBeTruthy();
  });
  it("Должен корректно возвращать дни 3d", () => {
    // Arrange
    const value = "1w 3d 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDays()).toBe(3);
  });
  it("Должен корректно возвращать часы 6h", () => {
    // Arrange
    const value = "1w 3d 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getHours()).toBe(6);
  });
  it("Должен корректно возвращать минуты 12m", () => {
    // Arrange
    const value = "1w 3d 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getMinutes()).toBe(12);
  });
  it("Должен корректно возвращать минуты 1w", () => {
    // Arrange
    const value = "1w 3d 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getWeeks()).toBe(1);
  });

  it("Должен корректно возвращать дни 0d", () => {
    // Arrange
    const value = "1w 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getDays()).toBe(0);
  });
  it("Должен корректно возвращать часы 0h", () => {
    // Arrange
    const value = "1w 3d 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getHours()).toBe(0);
  });
  it("Должен корректно возвращать минуты 0m", () => {
    // Arrange
    const value = "1w 3d 6h";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getMinutes()).toBe(0);
  });
  it("Должен корректно возвращать минуты 0w", () => {
    // Arrange
    const value = "3d 6h 12m";

    // Act
    const sut = Duration.Create(value);

    // Assert
    expect(sut.isFailure).toBeFalsy();
    expect(sut.value).toBeInstanceOf(Duration);
    expect(sut.value.getWeeks()).toBe(0);
  });
});
