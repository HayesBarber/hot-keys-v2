const p = require("./package.json");

const parts = p.version.split(".");

const getIndex = () => {
  if (process.env.MINOR) return 1;
  if (process.env.PATCH) return 2;
  return 0;
};

const i = getIndex();

parts[i] = parseInt(parts[i]) + 1;

if (i === 0) {
  for (let index = 1; index < parts.length; index++) {
    parts[index] = 0;
  }
}

p.version = parts.join(".");

require("fs").writeFileSync("package.json", JSON.stringify(p, null, 2));
