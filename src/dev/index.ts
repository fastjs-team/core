import { rand } from "../utils/index";

function browserCheck(module: string): void {
  const isBrowser: boolean = typeof window !== "undefined";
  if (!isBrowser) {
    throw error(
      `${module}/browserCheck`,
      "This module is only available in browser environments."
    );
  }
}

enum style {
  "fastjs.bold" = "\u001b[1m",
  "fastjs.reverse" = "\u001b[7m",
  "fastjs.red" = "\u001b[31m",
  "fastjs.green" = "\u001b[32m",
  "fastjs.yellow" = "\u001b[33m",
  "fastjs.blue" = "\u001b[34m",
  "fastjs.magenta" = "\u001b[35m",
  "fastjs.cyan" = "\u001b[36m",
  "fastjs.white" = "\u001b[37m",
  "fastjs.gray" = "\u001b[90m",
  "fastjs.bgRed" = "\u001b[41m",
  "fastjs.bgGreen" = "\u001b[42m",
  "fastjs.bgYellow" = "\u001b[43m",
  "fastjs.bgBlue" = "\u001b[44m",
  "fastjs.bgMagenta" = "\u001b[45m",
  "fastjs.bgCyan" = "\u001b[46m",
  "fastjs.bgWhite" = "\u001b[47m",
  "fastjs.bgGray" = "\u001b[100m",
  "fastjs.wrong" = "\u001b[41m\u001b[37m\u001b[1m",
  "fastjs.right" = "\u001b[42m\u001b[37m\u001b[1m",
  "fastjs.warn" = "\u001b[43m\u001b[90m\u001b[1m"
}

function warn(
  module: string,
  message: string,
  args: Array<any> = [],
  styleArgs: Array<keyof typeof style | Array<keyof typeof style>> = []
): void {
  args = args.filter((arg) => arg !== "");
  args = args.map((arg, k) =>
    typeof arg === "string" &&
    arg[0] !== "&" &&
    args[k - 1]?.[args[k - 1].length - 1] !== "&"
      ? "\n    > " + arg
      : arg
  );
  args = args.map((arg) => {
    if (typeof arg !== "string") return arg;
    if (arg[0] === "&") arg = ` ${arg.slice(1)} `;
    if (arg[arg.length - 1] === "&") arg = `${arg.slice(0, -1)} `;
    return arg;
  });
  let styleKey = 0;
  let outputMessage = "";
  let outputObjects: any[] = [];
  let lastStyle = styleArgs.length
    ? getStyle(styleArgs[styleArgs.length - 1])
    : "";

  args.unshift(`[Fastjs warn] ${module}: ${message}`);
  args.forEach((arg) => {
    if (typeof arg !== "string") {
      outputMessage += "%o";
      outputObjects.push(arg);
      return;
    }
    if (arg.includes("> *") && !arg.includes("> **")) {
      let style = styleArgs[styleKey];
      arg = arg.replace("*", "");
      arg = arg.replace("  >", getStyle(style) + "-->\u001b[0m");
      styleKey++;
    }
    if (arg.includes("***")) {
      let style = styleArgs[styleKey];
      arg = arg.replace("***", "");
      arg =
        arg.split("> ")[0] +
        "> " +
        getStyle(style) +
        arg.split("> ").slice(1).join("> ") +
        "\u001b[0m";
      styleKey++;
    }
    while (arg.includes(`**`)) {
      let style = styleArgs[styleKey];
      arg = arg.replace(`**`, getStyle(style));
      arg = arg.replace(`**`, "\u001b[0m");
      styleKey++;
    }
    outputMessage += arg;
  });
  console.warn(outputMessage, ...outputObjects);

  function getStyle(
    key: keyof typeof style | Array<keyof typeof style>
  ): string {
    if (!key) return lastStyle;
    if (Array.isArray(key)) {
      return key.map((e) => style[e]).join("");
    }
    return style[key] || "";
  }
}

function error(
  module: string,
  message: string,
  args: Array<any> = [],
  styleArgs: Array<keyof typeof style | Array<keyof typeof style>> = []
): Error {
  // Note: Called utils.rand, but it should be tree-shaked after build(prod mode)
  const eid = rand(1e7, 1e8 - 1);
  args.push(`Trace: ${eid}`);
  warn(module, message, args, styleArgs);
  return new Error(
    `[Fastjs error] ${module}: ${message.replace(/[*&]/g, "")}\n    > Trace: ${eid}`
  );
}

function experimentFeatureWarning(id: string, name: string, call: string) {
  warn(
    "fastjs/experiment-feature-" + id,
    `${name} is an experimental feature, it may be removed or changed in the future.`,
    [`call: `, call],
    ["fastjs.warn"]
  );
}

export default {
  browserCheck,
  experimentFeatureWarning,
  warn,
  error
};
