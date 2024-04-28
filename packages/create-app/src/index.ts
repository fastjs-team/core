import pc from "picocolors";
import {
  projectName,
  projectPath,
  resolveTemplate,
  selectPackageManager,
  selectTemplate
} from "./config";
import { checkPath, setupProject } from "./project";

import pkg from "../package.json" assert { type: "json" };
import { detectPackageManager, installPackageManager } from "./pkg";

export default async function create(
  name: string | undefined,
  options: Record<string, string>
) {
  console.log();
  console.log(pc.cyan(`🛠️   Fastjs Cli ${pc.bold(pkg.version)}`));
  console.log("Author:", pc.bold("@xiaodong2008"));
  console.log();

  const pkgList = await detectPackageManager();

  if (!name) name = await projectName();
  const path = options.path || (await projectPath(name));
  await checkPath(path);

  const template = resolveTemplate(
    options.template || (await selectTemplate())
  );

  const pkgManager = await selectPackageManager(pkgList);
  if (!pkgList.includes(pkgManager)) await installPackageManager(pkgManager);

  console.log();
  console.log(`Creating project ${pc.bold(name)} in ${pc.bold(path)}`);
  setupProject(path, template, pkgManager);
}
