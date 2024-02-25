type Resulted<T> = T extends null | undefined
  ? T // special case for `null | undefined` when not in `--strictNullChecks` mode
  : T extends object & { map(onfulfilled: infer F, ...args: infer _): any } // `await` only unwraps object types with a callable `then`. Non-object types are not unwrapped
    ? F extends (value: infer V, ...args: infer _) => any // if the argument to `then` is callable, extracts the first argument
      ? Resulted<V> // recursively unwrap the value
      : never // the argument to `then` was not callable
    : T; // non-object or non-thenable

export class Result<T> {
  readonly isFailure: boolean;
  readonly error: string;

  private result: T;

  get value(): T {
    if (this.isFailure) {
      throw new Error(
        "Обращение к заведомо некорректному значению; " + this.error
      );
    }
    return this.result;
  }

  private constructor(value: T, isFailure = false, error = "") {
    this.result = value;
    this.isFailure = isFailure;
    this.error = error;
  }

  static success<T>(value: T): Result<T> {
    return new Result(value);
  }

  static failure<T>(error: string): Result<T> {
    return new Result<any>(null, true, error);
  }

  static reFailure<A, B>(result: Result<A>): Result<B> {
    if (Result.isResultNoType<B>(result)) {
      return result;
    }
    throw new Error(
      "Неправильное использование функции, функция может оборачивать только неудачный результат"
    );
  }

  private static isResultNoType<T>(
    result: Result<unknown>
  ): result is Result<T> {
    if (!result.isFailure) {
      return false;
    }
    return true;
  }

  map<S>(fn: (r: T) => Result<S> | S): Result<S> {
    if (this.isFailure) {
      return Result.failure(this.error);
    }
    if (typeof fn !== "function") {
      return Result.failure(
        "Ошибка аргумента Result::map(fn) - fn должна быть функцией"
      );
    }
     
    const result = fn(this.value);
    if (result instanceof Result) {
      return result;
    }
    return Result.success(result);
  }
}
