import { Command } from "commander";
import createProject from "./src/";
import pkg from "./package.json" assert { type: "json" };

const program = new Command();

program
  .version(pkg.version)
  .description(pkg.description)
  .arguments("[project-name]")
  .option("-p, --path <path>", "The path to create the project in")
  .action(createProject);

program.parse(process.argv);
