// typescript support
import typescript from '@rollup/plugin-typescript';
import packageInfo from "./package.json" assert { type: "json" };
const version = packageInfo.version;
const fileBaseName = "fastjs";
const packageConfig = []

const formatsExport = {
  cjs: {
    file: `dist/${fileBaseName}.cjs.js`,
    format: "cjs"
  },
  esm: {
    file: `dist/${fileBaseName}.esm.js`,
    format: "es"
  }
}

for (const key in formatsExport) {
  const format = formatsExport[key]
  const config = generateConfig(format)

  const prodFormat = formatsExport[key]
  prodFormat.file = prodFormat.file.replace(".js", ".prod.js")
  const prodConfig = generateConfig(prodFormat, true)

  packageConfig.push(config, prodConfig)
}

export default packageConfig

function generateConfig(format, prodFile = false) {
  const config = {
    input: "src/main.ts",
    output: {
      format: format.format,
      sourcemap: true,
      file: format.file,
      globals: resolveDefine(prodFile)
    },
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
        target: "es6",
        module: "esnext"
      })
    ]
  }
  return config
}

function resolveDefine(prodFile = false) {
  const resolves = {
    VERSION: version,
    DEV: !prodFile
  }
  return resolves
}