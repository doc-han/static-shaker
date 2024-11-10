import path from "path";
import fs from "fs";

const GLOBAL_VAR = "some-global-var";

function someOtherFunc() {
  const fPath = path.join(__dirname, GLOBAL_VAR);
  fs.readFileSync(fPath);
}

function genConfig() {
  return {
    name: GLOBAL_VAR,
    path,
  };
}

const start = () => {
  const config = genConfig();
  console.log(config);
};

console.log(someOtherFunc());
export default start;
