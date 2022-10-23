export default {
    input: "src/main.js",
    output: [
        {
            dir: "dist",
            format: "esm",
            name: "fastjs-next",
            file: "dist/fastjs-next-runtime-esm.js",
        }
    ]
}