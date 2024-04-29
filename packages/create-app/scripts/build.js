import { build } from "esbuild";
import fs from "fs";

build({
  entryPoints: ["./index.ts"],
  bundle: true,
  outfile: "./cli.cjs",
  platform: "node",
  plugins: [
    {
      name: "add-header",
      setup(build) {
        build.onEnd(() => {
          const cli = fs.readFileSync("./cli.cjs", "utf8");
          fs.writeFileSync("./cli.cjs", "#!/usr/bin/env node\n" + cli);
        });
      }
    }
  ]
});
