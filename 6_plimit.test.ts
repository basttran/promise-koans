import pLimit from "p-limit";
// const pLimit = require('p-limit');

// https://www.npmjs.com/package/p-limit

// const limit = pLimit(1);

// const input = [
//   limit(() => testPromise("1", logger)),
//   limit(() => testPromise("2", logger)),
//   limit(() => testPromise("3", logger)),
//   limit(() => testPromise("4", logger)),
// ];

// Only one promise is run at once
// const result = await Promise.all(input);
// console.log(result);

//   if (!runningPromises.length) {
//     runningPromises.push(await fn());
//   }
//   return Promise.all(runningPromises).then(async (values) => {
//     runningPromises.length = 0;
//     await runningPromises.push(fn);
//   });

const testPromise = (id: string, logs: any[]) => {
  logs.push(`started task: ${id}`);
  Promise.resolve(id).then(() => {
    logs.push(`ended task: ${id}`);
  });
  return `value task: ${id}`;
};

let logs: any[] = [];

type Limit = Function & { promiseCount?: number };

describe("pLimit", () => {
  beforeEach(() => {
    logs = [];
  });
  it("should keep track of tasks", async () => {
    // given
    const limit = pLimit(CONCURRENCY);
    // when
    const limitInput = [
      limit(() => testPromise("1", logs)),
      limit(() => testPromise("2", logs)),
      limit(() => testPromise("3", logs)),
      limit(() => testPromise("4", logs)),
      limit(() => testPromise("5", logs)),
      limit(() => testPromise("6", logs)),
      limit(() => testPromise("7", logs)),
      limit(() => testPromise("8", logs)),
    ];
    const result = await Promise.all(limitInput);
    console.log("result: ", result);
    // then
    console.log("pLimit logs: ", logs);
    expect(logs[0]).toEqual("started task: 1");
    // expect(logs[1]).toEqual("started task: 2");
    // expect(logs[2]).toEqual("started task: 3");
    // expect(logs[3]).toBeUndefined();
  });
});

describe("pLimite", () => {
  const pLimite = (concurrency: number) => {
    const queuedTask: any[] = [];
    let count: number = 0;
    const runAndNext = async (fn: Function) => {
      count += 1;
      const result = await Promise.resolve(fn()).then(async (val) => {
        count -= 1;
        if (queuedTask.length) {
          runAndNext(queuedTask.shift());
        }
        return val;
      });
      return result;
    };
    const limit: Limit = async (fn: () => Promise<any>) => {
      if (count < concurrency) {
        return runAndNext(fn);
      } else {
        queuedTask.push(fn);
      }
    };

    Object.defineProperties(limit, {
      activeCount: {
        get: () => count,
      },
      pendingCount: {
        get: () => queuedTask.length,
      },
    });

    return limit;
  };

  beforeEach(() => {
    logs = [];
  });
  it("should keep track of tasks", async () => {
    // given
    const limite = pLimite(CONCURRENCY);
    const limiteInput = [
      limite(() => testPromise("1", logs)),
      limite(() => testPromise("2", logs)),
      limite(() => testPromise("3", logs)),
      limite(() => testPromise("4", logs)),
      limite(() => testPromise("5", logs)),
      limite(() => testPromise("6", logs)),
      limite(() => testPromise("7", logs)),
      limite(() => testPromise("8", logs)),
    ];
    // when
    const result = await Promise.all(limiteInput);
    console.log("result: ", result);

    // then
    console.log("pLimite logs: ", logs);
    expect(logs[0]).toEqual("started task: 1");
    // expect(logs[1]).toEqual("started task: 2");
    // expect(logs[2]).toEqual("started task: 3");
    // expect(logs[3]).toBeUndefined();
  });
});

const CONCURRENCY = 5;
