import { resolvePlugin } from "@babel/core";
import { access } from "fs";

// Your code below
// Should adapt access function, which is an old school asynchronous function relying on callbacks to a function returning Promise.
// See NodeJs doc archive: https://nodejs.org/docs/v0.1.101/api.html
const exists = (path: string): Promise<void> => {
  return new Promise((resolve, reject) =>
    access(path, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    })
  );
};

//////////////////////////////////////////////////

describe("Promisify a legacy api", () => {
  it("should promisify access (Happy path)", async () => {
    // given
    const file = "./package.json";
    // When
    // then
    await exists(file);
  });

  it("should promisify access (Error path)", async () => {
    // given
    const file = "./packaaage.json";
    // When
    // then
    await expect(exists(file)).rejects.toBeDefined();
  });
});
