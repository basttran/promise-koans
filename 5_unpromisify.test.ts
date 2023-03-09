const unpromisify =
  (fn: Function) =>
  (...args: any[]): void => {
    const cb = args.pop();
    const promesse = fn(...args);
    promesse.then((val) => cb(null, val)).catch((err) => cb(err, null));
  };

describe("unpromisify", () => {
  it("should return a function that can take a callback", (done) => {
    // Given callback en erreur
    const functionReturningAPromise = () => Promise.reject("error");

    // When

    const functionThatCanTakeACallback = unpromisify(functionReturningAPromise);

    function callback(error, _data) {
      if (error) {
        expect(error).toEqual("error");
        done();
        return;
      }
    }
    functionThatCanTakeACallback(callback);

    //then
  });

  // it.skip("should return a function that can take a callback", (done) => {});
  it("should return a function that can take a callback", (done) => {
    const checkYoSelfFoo = async (name) => `Hey ${name}, checkYoSelfFoo!`;

    const checkYoSelfBar = unpromisify(checkYoSelfFoo);

    function callback(error, data) {
      if (error) {
        done();
        return;
      }
      try {
        expect(data).toBe("Hey @specialblend, checkYoSelfFoo!");
        done();
      } catch (error) {
        done();
      }
    }
    checkYoSelfBar("@specialblend", callback);
  });
});

// const unpromisify = (fn: Function) => (callback: Callback) => {
//   fn()
//     .then((value) => callback(null, value))
//     .catch((err) => callback(err, null));
// };

describe("unpromisify", () => {
  it("catch an error", (done) => {
    // Given callback en erreur
    const functionReturningAPromise = () => Promise.reject("error");

    // When

    const functionThatCanTakeACallback = unpromisify(functionReturningAPromise);

    function callback(error: any) {
      if (error) {
        console.log("error: ", error);
        expect(error).toEqual("error");
        done();
        return;
      }
    }
    functionThatCanTakeACallback(callback);
  });
  it("should return a function that can take a callback", (done) => {
    const checkYoSelfFoo = async () => `Hey, checkYoSelfFoo!`;

    const checkYoSelfBar = unpromisify(checkYoSelfFoo);

    function callback(err, data: any) {
      if (err) {
        console.log("error: ", err);
        expect(err).toEqual("error");
        done();
        return;
      }
      expect(data).toBe("Hey, checkYoSelfFoo!");
      done();
    }
    checkYoSelfBar(callback);
  });

  it("should return a function that can take a callback", (done) => {
    const checkYoSelfFoo = async () => `Hey, checkYoSelfFoo!`;

    const checkYoSelfBar = unpromisify(checkYoSelfFoo);

    function callback(err, data: any) {
      if (err) {
        console.log("error: ", err);
        expect(err).toEqual("error");
        done();
        return;
      }
      expect(data).toBe("Hey, checkYoSelfFoo!");
      done();
    }
    checkYoSelfBar(callback);
  });

  it("should return a function that can take a callback", (done) => {
    const checkYoSelfFoo = async (name) => `Hey, ${name} checkYoSelfFoo!`;

    const checkYoSelfBar = unpromisify(checkYoSelfFoo);

    function callback(err, data: any) {
      if (err) {
        console.log("error: ", err);
        expect(err).toEqual("error");
        done();
        return;
      }
      expect(data).toBe(`Hey, @specialblend checkYoSelfFoo!`);
      done();
    }
    checkYoSelfBar("@specialblend", callback);
  });
});
