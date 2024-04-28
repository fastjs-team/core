import pc from "picocolors";
import * as iq from "@inquirer/prompts";
import { TemplateType, templates } from "../templates/config";

export async function projectName(): Promise<string> {
  return (await iq.input({
    message: "Enter the name of the app:",
    default: "fastjs-app"
  })) as any;
}

export async function projectPath(name: string): Promise<string> {
  const value = await iq.select({
    message: "Choose the init path for the app:",
    choices: [
      { name: "Create a new directory with the app name", value: `./${name}` },
      { name: "Current directory", value: "./" },
      { name: "Custom directory name", value: "custom" }
    ],
    default: true
  });
  if (value === "custom") {
    return (
      "./" +
      (await iq.input({
        message: "Enter the folder name for the app:",
        default: name,
        validate: (input: string) => {
          if (!/^[a-zA-Z0-9_-]+$/.test(input)) {
            return "Invalid folder name";
          }
          return true;
        }
      }))
    );
  }
  return value;
}

export async function selectTemplate(): Promise<string> {
  let template = await iq.select({
    message: "Choose a template:",
    choices: templates.map((template) => ({
      name: template.label || template.name,
      value: template.name
    })),
    default: "react"
  });
  if (templates.find((t) => t.name === template)?.types) {
    template = await iq.select({
      message: "Choose a template type:",
      choices: templates
        .find((t) => t.name === template)!
        .types!.map((type) => ({
          name: type.label || type.name,
          value: type.name
        }))
    });
  }
  return template;
}

export async function selectPackageManager(
  available: string[]
): Promise<string> {
  const managers = ["pnpm", "yarn", "npm", "bun"];

  return (await iq.select({
    message: "Choose a package manager:",
    choices: managers.map((manager) => {
      let managerLabel = pc.cyan(pc.bold(manager));
      if (manager === "pnpm") managerLabel += pc.green(" (recommended)");
      let label = `Use ${managerLabel}`;
      if (!available.includes(manager)) {
        label = `${pc.cyan(pc.bold("Install"))} and use ${managerLabel}`;
      }
      return {
        name: label,
        value: manager
      };
    }),
    default: "pnpm"
  })) as any;
}

export function resolveTemplate(name: string): TemplateType {
  for (let i = 0; i < templates.length; i++) {
    const t = templates[i];
    if (t.types) {
      const template = t.types.find((type) => type.name === name);
      if (template) {
        return template;
      }
    } else if (t.name === name) {
      return t as TemplateType;
    }
  }

  console.error(`Template ${name} not found`);
  process.exit(1);
}
