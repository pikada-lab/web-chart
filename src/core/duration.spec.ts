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
});
