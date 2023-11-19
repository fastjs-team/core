import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import terser from "@rollup/plugin-terser";
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
  },
  'esm-bundler': {
    file: `dist/${fileBaseName}.esm-bundler.js`,
    format: "es"
  },
  'esm-browser': {
    file: `dist/${fileBaseName}.esm-browser.js`,
    format: "es"
  },
  global: {
    file: `dist/${fileBaseName}.global.js`,
    format: "iife",
  }
}

Object.keys(formatsExport).forEach(formatName => {
  const format = formatsExport[formatName]
  packageConfig.push(generateConfig(formatName, format))
  if (['global', 'cjs'].includes(formatName)) {
    packageConfig.push(generateMinifiedConfig(formatName))
  } else if (formatName !== 'esm-bundler') {
    packageConfig.push(generateProductionConfig(formatName))
  }
})

export default packageConfig

function generateConfig(formatName, rollupOutput, plugins = []) {
  console.log(formatName, rollupOutput, plugins)
  const isBundlerESMBuild = /esm-bundler/.test(formatsExport[formatName].file)
  const isBrowserESMBuild = /esm-browser/.test(formatsExport[formatName].file)
  const isProductionBuild = process.env.__DEV__ === 'false' || /\.prod\.js$/.test(rollupOutput.file)
  const isGlobalBuild = /global/.test(rollupOutput.file)
  const isCJSBuild = /cjs/.test(rollupOutput.file)

  if (isGlobalBuild || isBrowserESMBuild) {
    rollupOutput.name = "fastjs"
  }

  return {
    input: "src/main.ts",
    plugins: [
      typescript({
        tsconfig: "tsconfig.json",
        target: "es2022",
        module: "esnext"
      }),
      resolveReplace(),
      ...plugins
    ],
    output: rollupOutput,
    treeshake: {
      moduleSideEffects: false
    }
  }

  function resolveReplace() {
    const resolves = {
      __VERSION__: version,
      __BROWSER__: isBrowserESMBuild,
      __GLOBAL__: isGlobalBuild,
      __ESM_BUNDLER__: isBundlerESMBuild,
      __ESM_BROWSER__: isBrowserESMBuild,
      __NODE_JS__: isCJSBuild
    }

    if (isBundlerESMBuild) {
      Object.assign(resolves, {
        // preserve to be handled by bundlers
        __DEV__: `!!(process.env.NODE_ENV !== 'production')`
      })
    }
    if (!isBundlerESMBuild) {
      resolves.__DEV__ = String(!isProductionBuild)
    }

    // for compiler-sfc browser build inlined deps
    if (isBrowserESMBuild) {
      Object.assign(resolves, {
        'process.env': '({})',
        'process.platform': '""',
        'process.stdout': 'null'
      })
    }

    return replace({
      preventAssignment: true,
      values: resolves
    })
  }
}

/** @param format {string} */
function generateProductionConfig(format) {
  return generateConfig(format, {
    file: formatsExport[format].file.replace(/\.js$/, '.prod.js'),
    format: formatsExport[format].format
  })
}

/** @param format {string} */
function generateMinifiedConfig(format) {
  return generateConfig(format, {
    file: formatsExport[format].file.replace(/\.js$/, '.prod.js'),
    format: formatsExport[format].format
  },[
    terser({
      module: true,
      compress: {
        ecma: 2021,
        pure_getters: true
      }
    })
  ])
}