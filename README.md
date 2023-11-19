# Fastjs-next

## Announcement

- [Fly again, 2024](https://github.com/fastjs-team/fastjs-next/discussions/59)

## Important

**This readme is for v2.x, if you are coming for v1.x, please go to [v1.x branch](https://github.com/fastjs-team/fastjs-next/tree/old-version).**

## Getting Started

- https://fastjs.cc/
- https://docs.fastjs.cc/ (In maintenance - v2)
- https://zh.docs.fastjs.cc/ (In maintenance - v2)

## Description

Fastjs is a high availability, high performance JavaScript library.

It is designed to be easy to use. Fastjs can be used like a library with any framework.

Fastjs is a good choice for you to develop your project.

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
npm install fastjs-next
```

```js
import { dom } from 'fastjs-next' // esm
const { request } = require('fastjs-next') // cjs
```

### CDN (Global)

```html
<script src="https://unpkg.com/fastjs-next/dist/fastjs.global.js"></script>
```

### Browser (ES Module)

```html
<script type="module">
  import { dom } from 'https://unpkg.com/fastjs-next/dist/fastjs.esm.browser.js'
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

<a href="https://github.com/fastjs-team/fastjs-next/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=fastjs-team/fastjs-next" />
</a>