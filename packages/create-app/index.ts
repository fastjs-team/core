import { Command } from "commander";
import createProject from "./src/";
import pkg from "./package.json" assert { type: "json" };

const program = new Command();

program
  .version(pkg.version)
  .description(pkg.description)
  .arguments("<project-name>")
  .action(createProject)
  .parse(process.argv);
