<br/>
<br/>
<div align="center">
    <img src="./logoDisplay.svg" width="190" />
</div>
<h3 align="center"><b>Fastjs / Powerful JavaScript Library</b></h3>
<p align="center">
    <img alt="Stars" src="https://img.shields.io/github/stars/fastjs-team?style=flat-square&logo=github&cacheSeconds=600&color=yellow&label=Team%20Stars">
    <img alt="GitHub commit activity (branch)" src="https://img.shields.io/github/commit-activity/w/fastjs-team/core?style=flat-square&logo=github&cacheSeconds=600&label=Commit%20Activity">
    <img alt="Last Action Status" src="https://img.shields.io/github/actions/workflow/status/fastjs-team/core/ci.yml?style=flat-square&logo=githubactions&cacheSeconds=60&logoColor=white&label=CI Check">
    <img alt="Sponsors" src="https://img.shields.io/github/sponsors/dy-xiaodong2022?style=flat-square&logo=githubsponsors&cacheSeconds=600&label=Sponsors&color=ea4aaa&labelColor=d1beca">
</p>


## Announcement

- [Fly again, 2024](https://github.com/fastjs-team/core/discussions/59)

## Important

**This project is in maintenance, we are working new version of fastjs. This version(@fastjs-next/core) is still in development, so it doesn't publish to npm or have a release yet.**

**The package name will be changed to @fastjs-next/core, and the package name fastjs-next will not be used anymore.**

## Getting Started

- https://fastjs.dev/
- https://docs.fastjs.dev/ (In maintenance - not ready yet)
- https://zh.docs.fastjs.dev/ (In maintenance - not ready yet)

## Description

@fastjs-next/core is a useful, lightweight JavaScript library for any types of project.

It is designed to be easy to use. Fastjs can be with any framework or just pure JavaScript.

## How to use

We have many versions, including:
- CommonJS (dist/fastjs.cjs.js)
- CommonJS Production (dist/fastjs.cjs.prod.js)
- ES Module (dist/fastjs.esm.js)
- ES Module Production (dist/fastjs.esm.prod.js)
- ES Module Browser (dist/fastjs.esm.browser.js)
- ES Module Browser Production (dist/fastjs.esm.browser.prod.js)
- Bundler (dist/fastjs.esm-bundler.js)
- Global (dist/fastjs.global.js)
- Global Production (dist/fastjs.global.prod.js)

## Start Using

### Bundler/CommonJS

```bash
npm install @fastjs-next/core
```

```js
import { dom } from '@fastjs-next/core' // esm
const { request } = require('@fastjs-next/core') // cjs
```

### CDN (Global)

```html
<script src="https://unpkg.com/@fastjs-next/core/dist/fastjs.global.js"></script>
```

### Browser (ES Module)

```html
<script type="module">
  import { dom } from 'https://unpkg.com/@fastjs-next/core/dist/fastjs.esm.browser.js'
</script>
```

## Cli

**Warning: Fastjs-cli is in maintenance cause of updating to v2, we don't suggest use it for now.**

```bash
npm install -g fastjs-cli

fastjs create <project-name>
```

## Info

- Author: dy-xiaodong2022
- License: [MIT](https://opensource.org/licenses/MIT)

## Sponsors

<div align="center">
  <img src="https://raw.githubusercontent.com/dy-xiaodong2022/sponsors/main/sponsors.wide.svg" />
</div>

## Contributors

<a href="https://github.com/fastjs-team/core/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fastjs-team/core" />
</a>
