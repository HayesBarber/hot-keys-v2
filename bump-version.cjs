let p = require("./package.json");

let version = p.version.split(".").at(0);

version = parseInt(version) + 1;

p.version = `${version}.0.0`;

require("fs").writeFileSync("package.json", JSON.stringify(p, null, 2));
