import { cmd } from "./utils";
import pc from "picocolors";
import ora from "ora";
import * as iq from "@inquirer/prompts";
import { TemplateType } from "../templates/config";
import { existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { installDependencies } from "./pkg";
import { resolve } from "node:path";

export async function checkPath(path: string) {
  if (existsSync(path)) {
    if (isDirEmpty(path)) return;
    const overwrite = await iq.select({
      message: "Directory already exists. Delete and Overwrite?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
      default: false
    });
    if (overwrite) {
      rmSync(path, { recursive: true });
      mkdirSync(path, { recursive: true });
    } else {
      process.exit(1);
    }
  } else {
    mkdirSync(path, { recursive: true });
  }

  function isDirEmpty(path: string) {
    return readdirSync(path).length === 0;
  }
}

export async function setupProject(
  path: string,
  template: TemplateType,
  pkg: string
) {
  const start = Date.now();

  console.log();
  const copy = ora("Copying files...").start();
  await copyFiles(template.path, path);
  copy.succeed();

  const install = ora("Installing dependencies...").start();
  await installDependencies(pkg, path, install, ["jsfast"]);
  install.succeed();

  console.log();
  console.log(
    pc.green(`Project created in ${pc.bold(Date.now() - start + "ms")}`)
  );
  console.log();
  console.log("Next steps:");
  console.log();
  if (path !== "./") console.log(pc.cyan(`cd ${path}`));
  console.log(pc.cyan(`${pkg} run dev`));
}

async function copyFiles(src: string, dest: string) {
  const templatePath = resolve(__dirname, src);
  const targetPath = resolve(process.cwd(), dest);
  await cmd(`cp -r ${templatePath}/* ${targetPath}`);
}
