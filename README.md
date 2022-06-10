# Grapesjs Quill

> It is important that you include `https://cdn.quilljs.com/1.3.7/quill.bubble.css` in your final output so that quill styles are applied outside the editor too.

Quill RTE intergration for `grapesjs`.

Sponsered by:

 [![templateto.com](https://cdn.dorik.com/605a2d8f4235520011809929/61d819e8cb11310011d0bb96/images/logo-wide_dark_bg-white_trimmed_lg-txt_l9gbqgx8.png)](https://templateto.com)

[DEMO](https://astounding-meerkat-d5a1ea.netlify.app)

> Setup as shown in `index.html`

### HTML
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet">
<script src="https://unpkg.com/grapesjs"></script>
<script src="https://unpkg.com/gjs-quill"></script>

<div id="gjs"></div>
```

### JS
```js
const editor = grapesjs.init({
	container: '#gjs',
  height: '100%',
  fromElement: true,
  storageManager: false,
  plugins: ['gjs-quill'],
});
```

### CSS
```css
body, html {
  margin: 0;
  height: 100%;
}
```


## Summary

* Plugin name: `gjs-quill`



## Options

| Option | Description | Default |
|-|-|-
| `quillOpts` | Options for configuring quill | `{}` |
| `clipboard` | Use custom clipboard | `true` |



## Download

* CDN
  * `https://unpkg.com/gjs-quill`
* NPM
  * `npm i gjs-quill`
* GIT
  * `git clone https://github.com/Ju99ernaut/gjs-quill.git`



## Usage

Directly in the browser
```html
<link href="https://unpkg.com/grapesjs/dist/css/grapes.min.css" rel="stylesheet"/>
<script src="https://unpkg.com/grapesjs"></script>
<script src="path/to/gjs-quill.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container: '#gjs',
      // ...
      plugins: ['gjs-quill'],
      pluginsOpts: {
        'gjs-quill': { /* options */ }
      }
  });
</script>
```

Modern javascript
```js
import grapesjs from 'grapesjs';
import plugin from 'gjs-quill';
import 'grapesjs/dist/css/grapes.min.css';

const editor = grapesjs.init({
  container : '#gjs',
  // ...
  plugins: [plugin],
  pluginsOpts: {
    [plugin]: { /* options */ }
  }
  // or
  plugins: [
    editor => plugin(editor, { /* options */ }),
  ],
});
```



## Development

Clone the repository

```sh
$ git clone https://github.com/Ju99ernaut/gjs-quill.git
$ cd gjs-quill
```

Install dependencies

```sh
$ npm i
```

Start the dev server

```sh
$ npm start
```

Build the source

```sh
$ npm run build
```



## License

MIT
