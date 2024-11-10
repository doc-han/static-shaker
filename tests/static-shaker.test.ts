import staticShaker from "../src/static-shaker";
import * as path from "path";

describe("example01.ts", () => {
  it("start function", () => {
    const output = staticShaker(
      path.join(__dirname, "./files/example01.ts"),
      "start"
    );
    expect(output).toMatchSnapshot();
  });
  it("someOtherFunc", () => {
    const output = staticShaker(
      path.join(__dirname, "./files/example01.ts"),
      "someOtherFunc"
    );
    expect(output).toMatchSnapshot();
  });
});

describe("example02.ts", () => {
  it("getConfig", () => {
    const output = staticShaker(
      path.join(__dirname, "./files/example02.tsx"),
      "getConfig"
    );
    expect(output).toMatchSnapshot();
  });
  it("BoxModal", () => {
    const output = staticShaker(
      path.join(__dirname, "./files/example02.tsx"),
      "BoxModal"
    );
    expect(output).toMatchSnapshot();
  });
});
