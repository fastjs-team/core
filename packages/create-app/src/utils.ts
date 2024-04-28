import { exec } from "node:child_process";

export async function cmd(command: string, cwd?: string) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (err) => {
      if (err) reject(err);
      resolve(true);
    });
  });
}
