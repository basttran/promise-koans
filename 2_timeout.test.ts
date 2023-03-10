// Your code below (Hint Promise.race)

import { waitForDelay } from "./1_await_or_wait.test";

// Should return a promise automatically rejected after the given timeout expressed in millisconds
const withTimeout = <T>(task: Promise<T>, timeOutInMs: number): Promise<T> =>
  Promise.race([
    task,
    new Promise<T>((_resolve, reject) =>
      setTimeout(() => reject("TimeOut!"), timeOutInMs)
    ),
  ]);

//////////////////////////////////////////////////

describe("Promise rejected after a timeout", () => {
  const advanceTimersByTime = (timeInMs: number) => {
    return new Promise((resolve) =>
      setImmediate(() => {
        jest.advanceTimersByTime(timeInMs);
        resolve(undefined);
      })
    );
  };
  it("should reject promise when time has run out", async () => {
    // given
    jest.useFakeTimers({ legacyFakeTimers: true });
    const longTask = new Promise((resolve) => setTimeout(resolve, 20_000));
    const longTaskWithTimeout = withTimeout(longTask, 10_000);
    // When
    await advanceTimersByTime(10_000);
    // then
    await expect(longTaskWithTimeout).rejects.toEqual("TimeOut!");
  });
});
