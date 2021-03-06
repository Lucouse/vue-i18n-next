# Single file components

## Basic Usage

If you are building Vue component or Vue application using single file components, you can manage the locale messages with using i18n custom block.

The following in [single file components example](https://github.com/kazupon/vue-i18n/tree/dev/examples/sfc):

```html
<script>
export default {
  name: 'App'
}
</script>

<template>
  <label for="locale">locale</label>
  <select v-model="$i18n.locale">
    <option>en</option>
    <option>ja</option>
  </select>
  <p>message: {{ $t('hello') }}</p>
</template>

<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
```

In i18n custom blocks, the format of the locale messages resource is **json** format by default.

The locale messages defined by i18n custom blocks are used as the  local scope in single file components.

If `$t('hello')` is used in the template, the `hello` key defined by `i18n` custom blocks is referred to.

:::tip NOTE
The Composition API requires `useI18n` to return the `setup` context in order to localize with reference to locale messages defined in the i18n custom blocks.

About how to usage of `useI18n` , see the [Composition API](/advanced/composition)
:::

To use i18n custom blocks, you need to use the following plugins for bundler.

## Bundling with webpack

### vue-i18n-loader

[vue-i18n-loader](https://github.com/intlify/vue-i18n-loader) is loader plugin for [webpack](https://webpack.js.org/). Since single file components is bundled with [vue-loader](https://github.com/vuejs/vue-loader), you need to setting webpack config with vue-i18n-loader.

:::tip Support Version
- webpack: **v4 or later**
- vue-loader: **v16 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/vue-i18n-loader
```

#### Configuration

Webpack config for example:

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        resourceQuery: /blockType=i18n/,
        type: 'javascript/auto',
        loader: '@intlify/vue-i18n-loader'
      }
      // ...
    ]
  },
  // ...
}
```


## Bundling with Rollup

### rollup-plugin-vue-i18n

[rollup-plugin-vue-i18n](https://github.com/intlify/rollup-plugin-vue-i18n) is rollup plugin for [rollup](https://rollupjs.org). Since single-file components is bundled with [rollup-plugin-vue](https://github.com/vuejs/rollup-plugin-vue), you need to setting rollup config with rollup-plugin-vue

:::tip Support Version
- rollup: **v2.32 or later**
- rollup-plugin-vue: **v6 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/rollup-plugin-vue-i18n
```

#### Configuration

Rollup config for example:

```js
import vue from 'rollup-plugin-vue'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import i18n from '@intlify/rollup-plugin-vue-i18n'
import path from 'path'

export default [
  {
    input: path.resolve(__dirname, `./path/to/main.js`),
    output: {
      file: path.resolve(__dirname, `./path/to/dist/index.js`),
      format: 'cjs'
    },
    plugins: [
      commonjs(),
      resolve(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),
      i18n(),
      vue({ customBlocks: ['i18n'] })
    ]
  }
]
```

## Bundling with Vite

### vite-plugin-vue-i18n

[vite-plugin-vue-i18n](https://github.com/intlify/vite-plugin-vue-i18n) is vite plugin for [Vite](https://github.com/vitejs/vite).

:::tip Support Version
- vite: **v1 or later**.
:::

#### Installation

```sh
npm i --save-dev @intlify/vite-plugin-vue-i18n
```

#### Configuration

vite config for example:

```ts
import type { UserConfig } from 'vite'
import i18n from '@intlify/vite-plugin-vue-i18n'

const config: UserConfig = {
  vueCustomBlockTransforms: {
    i18n
  }
}

export default config
```

## Define Locale Messages Importing

You can use `src` attribute:

```html
<i18n src="./myLang.json"></i18n>
```

```json
// ./myLang.json
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界!"
  }
}
```

In the above example, `src` attribute is set to `./myLang.json`, so the path of the component with the `i18n` custom blocks is the base directory, and `./myLang.json` is  defined as the resource for locale messages.

## Define Locale Messages each Locales

You can use `locale` attribute:

```html
<i18n locale="en">
{
  "hello": "hello world!"
}
</i18n>
```

In the above example, since the `locale` attribute is set to `en`, the locale messages defined in `i18n` custom blocks can be used as a resource for locale messages of `en`.

## Define Multiple Locale Messages

You can use locale messages with multiple `i18n` custom blocks.

```html
<i18n src="./common/locales.json"></i18n>
<i18n>
{
  "en": {
    "hello": "hello world!"
  },
  "ja": {
    "hello": "こんにちは、世界！"
  }
}
</i18n>
```

In the above, first custom block load the common locale message with `src` attribute, second custom block load the locale message that is defined only at single file component. These locale messages will be merged as locale message of component.

In this way, multiple custom blocks useful when want to be used as module.

## Locale Messages Other Formats

`i18n` custom blocks supports resource formats other than `json`.

### YAML

You can load `yaml` format.

The `i18n` custom blocks below of `yaml` format:

```html
<i18n lang="yaml">
en:
  hello: "hello world!"
ja:
  hello: "こんにちは、世界！"
</i18n>
```

### JSON5

You can load `json5` format.

The `i18n` custom blocks below of `json5` format:

```html
<i18n lang="json5">
{
  // for english
  en: {
    hello: "hello world!"
  },
  // for japanese
  ja: {
    hello: "こんにちは、世界！"
  }
}
</i18n>
```

## Vue CLI

[Vue CLI](https://github.com/vuejs/vue-cli) hides the webpack configuration, so, if we want to add support to the `<i18n>` tag inside a single file component we need to modify the existing configuration.

In order to do that we have to create a `vue.config.js` at the root of our project. Once we have done that, we have to include the following:

```js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
        .loader('@intlify/vue-i18n-loader')
        .end();
  }
}
```
