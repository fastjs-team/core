import ora from "ora";
import pc from "picocolors";
import { cmd } from "./utils";

import type { Ora } from "ora";

export async function detectPackageManager(): Promise<string[]> {
  const pkgs = ["pnpm", "yarn", "bun", "npm"],
    detectedPkgs: string[] = [];

  const start = Date.now();
  console.log("Finding available package managers:");

  for (let i = 0; i < pkgs.length; i++) {
    const pkg = pkgs[i];
    const loader = ora(`Detecting package mangaer ${pkg}...`).start();
    try {
      await cmd(`${pkg} --version`);
      loader.text = `Detected package manager ${pc.bold(pc.green(pkg))}`;
      loader.succeed();
      detectedPkgs.push(pkg);
    } catch (e) {
      loader.text = `Package manager ${pc.bold(pc.red(pkg))} not found`;
      loader.fail();
    }
  }

  console.log(
    `Found ${pc.bold(detectedPkgs.length)} package managers in ${Date.now() - start}ms`
  );
  console.log();

  return detectedPkgs;
}

export async function installDependencies(
  pkg: string,
  path: string,
  loader: Ora,
  dependencies: string[]
) {
  const len = dependencies.length + 1;
  loader.text = `Installing dependencies...(0/${len})`;
  await cmd(`${pkg} install`, path);
  for (let i = 0; i < dependencies.length; i++) {
    loader.text = `Installing dependencies...(${i + 1}/${len})`;
    await cmd(`${pkg} add ${dependencies[i]}`, path);
  }
  loader.text = `Installing dependencies...(${len}/${len})`;
}

export async function installPackageManager(pkg: string) {
  const loader = ora(`Installing package manager ${pkg}...`).start();
  try {
    await cmd(`npm install -g ${pkg}`);
    loader.text = `Installed package manager ${pc.bold(pc.green(pkg))}`;
    loader.succeed();
  } catch (e) {
    loader.text = `Failed to install package manager ${pc.bold(pc.red(pkg))}`;
    loader.fail();
    process.exit(1);
  }
}
