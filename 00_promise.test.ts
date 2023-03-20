class Promesse {
  private result: any;
  private reason: any;
  private completed: boolean = false;
  private rejected: boolean = false;
  private deferreds: any[] = [];
  private deferredRejects: any[] = [];

  constructor(initTask: (resolve: any, reject?: any) => any) {
    initTask(
      (result) => {
        if (result?.then) {
          result.then((value) => {
            this.completed = true;
            this.result = value;
            this.deferreds.forEach((fn) => fn(value));
          });
        } else {
          this.completed = true;
          this.result = result;
          this.deferreds.forEach((fn) => fn(result));
        }
      },
      (error) => {
        this.rejected = true;
        this.reason = error;
        this.deferredRejects.forEach((fn) => fn(error));
      }
    );
  }

  then = (
    onFulfilled: (value: any) => any,
    onRejected?: (reason: any) => any
  ): Promesse => {
    if (this.rejected) {
      onRejected && onRejected(this.reason);
      return new Promesse((resolve) => {
        resolve();
      });
    }
    if (this.completed) {
      return new Promesse((resolve) => resolve(onFulfilled(this.result)));
    }
    return new Promesse((resolve, _reject) => {
      this.deferreds.push((result) => resolve(onFulfilled(result)));
      this.deferredRejects.push((result) =>
        onRejected ? resolve(onRejected(result)) : resolve(result)
      );
    });
  };
}

describe("Promise from scratch", () => {
  it("should give back result when task was successful", async () => {
    // given
    const someValue = Math.random();
    const happyPathPromise = new Promesse((resolve) => {
      resolve(someValue);
    });
    // when
    const result = await happyPathPromise;
    // then
    expect(result).toEqual(someValue);
  });

  it("should be chainable (like map)", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then((value) => value * 2)
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });

  it("should be chainable (like flatMap)", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then((value) => new Promesse((resolve) => resolve(value * 2)))
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });

  it("should be chainable even when pending", async () => {
    // given
    const happyPathPromise = new Promesse((resolve) => {
      resolve(42);
    });
    // when
    const result = await happyPathPromise
      .then(
        (value) =>
          new Promesse((resolve) => setTimeout(() => resolve(value * 2), 100))
      )
      .then((value) => value * 2);
    // then
    expect(result).toEqual(168);
  });

  it("should raise an error when rejected", async () => {
    // given
    const errorPromise = new Promesse((_resolve, reject) => {
      reject("some error");
    });
    // when
    //then
    await expect(errorPromise).rejects.toEqual("some error");
  });
  it("should raise an error when rejected after a delay", async () => {
    // given
    const errorPromise = new Promesse((_resolve, reject) => {
      setTimeout(() => reject("some error"), 0);
    });
    // when
    //then
    await expect(errorPromise).rejects.toEqual("some error");
  });
});
