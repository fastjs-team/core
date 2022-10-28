// typescript support
import typescript from '@rollup/plugin-typescript';


export default {
    input: "src/main.ts",
    output: [
        {
            format: "es",
            sourcemap: true,
            file: "dist/fastjs-next-runtime-esm.js",
        }
    ],
    plugins: [
        typescript({
            tsconfig: "tsconfig.json",
            target: "es2015",
            module: "esnext"
        })
    ]
}