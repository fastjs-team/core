# @fastjs/core

## Announcement

- [Fly again, 2024](https://github.com/fastjs-team/core/discussions/59)

## Important

**This project is in maintenance, we are working new version of fastjs. This version(@fastjs/core) is still in development, so it doesn't publish to npm or have a release yet.**

**The package name will be changed to @fastjs/core, and the package name fastjs-next will not be used anymore.**

## Getting Started

- https://fastjs.cc/
- https://docs.fastjs.cc/ (In maintenance - not ready yet)
- https://zh.docs.fastjs.cc/ (In maintenance - not ready yet)

## Description

@fastjs/core is a useful, lightweight JavaScript library for any types of project.

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
npm install @fastjs/core
```

```js
import { dom } from '@fastjs/core' // esm
const { request } = require('@fastjs/core') // cjs
```

### CDN (Global)

```html
<script src="https://unpkg.com/@fastjs/core/dist/fastjs.global.js"></script>
```

### Browser (ES Module)

```html
<script type="module">
  import { dom } from 'https://unpkg.com/@fastjs/core/dist/fastjs.esm.browser.js'
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
- License: MIT

## Sponsors

<div align="center">
  <img src="https://raw.githubusercontent.com/dy-xiaodong2022/sponsors/main/sponsors.wide.svg" />
</div>

## Contributors

<a href="https://github.com/fastjs-team/core/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fastjs-team/core" />
</a>