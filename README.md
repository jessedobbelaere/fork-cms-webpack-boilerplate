<div align="center">
  <!-- replace with accurate logo e.g from https://worldvectorlogo.com/ -->
  <a href="https://github.com/forkcms/forkcms">
      <img width="200" height="200" src="https://i.imgur.com/oh7i1rX.png">
  </a>
  <a href="https://webpack.js.org/">
    <img width="200" height="200" vspace="" hspace="25" src="https://cdn.rawgit.com/webpack/media/e7485eb2/logo/icon-square-big.svg">
  </a>
  <h1>Fork CMS theme boilerplate using Webpack 5</h1>
</div>

[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=jessedobbelaere/fork-cms-webpack-boilerplate)](https://dependabot.com)
[![Dependency Status](http://img.shields.io/david/jessedobbelaere/fork-cms-webpack-boilerplate.svg?style=flat)](https://david-dm.org/jessedobbelaere/fork-cms-webpack-boilerplate#info=dependencies)
[![DevDependency Status](http://img.shields.io/david/dev/jessedobbelaere/fork-cms-webpack-boilerplate.svg?style=flat)](https://david-dm.org/jessedobbelaere/fork-cms-webpack-boilerplate#info=devDependencies)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)

Simple, opiniated and performance-optimized boilerplate for Fork CMS themes supporting Typescript, React, ESNext, TailwindCSS, PostCSS, Dynamic Imports and Hot Module replacement using Webpack 5.

---

## ✨ Opiniated list of features I want webpack to do

-   [x] [Code splitting with Dynamic Imports](https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234) support aka lazy loading. Load only the code/resources needed when they are needed, without render blocking.
-   [x] Development/Production. In local dev I want fast builds via in-memory webpack-dev-server, and for production builds I want every possible optimization. Thus, separate `dev` and `prod` config and builds.
-   [x] Hot Module Replacement (HMR) during local dev. As I make changes to my Javascript, CSS or templates I want the webpage to seamlessly refresh. This speeds development tremendously: just say no to the Reload button.
-   [x] Dynamic Code Splitting. I don't want to manually define Javascript chunks in a config file. Webpack needs to sort that out for me.
-   [x] Cache busting via manifest.json. This allows us to set a long expiry date for static assets, while also ensuring that they are automatically cache busted if they change.
-   [x] Image optimization. Images are by far the largest thing on most web­pages, so it makes sense to opti­mize them via auto­mat­ed tools like mozjpeg, optipng, svgo, etc.
-   [x] [Typescript](https://www.typescriptlang.org/) support.
-   [x] ES2017/ES2018/.../ESNext support using Babel.
-   [x] [React](https://reactjs.org/) support. jQuery is so 2010. React is my frontend framework of choice. I use it for highly interactive interfaces, while using vanilla JS for standard behaviour.
-   [x] [PostCSS](https://postcss.org/). Think of it as the Babel of CSS, to add advanced features to CSS, or use upcoming CSS features now.
-   [x] [Tailwind CSS](https://tailwindcss.com/). While I have used BEM/ITCSS for years, I started to love the advantages of utility-css and rapidly building UI's without leaving your html code, without naming things, and without browsing endless files of css to find conflicting rules. Very opiniated though ;-)
-   [x] [PurgeCSS](http://github.com/FullHuman/purgecss) scans the theme folder for classnames that are actually used, and removes the unused styles, causing a very small css file to be generated! Perfect for tailwind css.
-   [x] [Prettier](https://prettier.io/) 💄 to automatically format js/css/html code.
-   [x] [ESLint](https://eslint.org/) to statically analyze and help find problems in the js/ts code.
-   [x] [Jest](https://jestjs.io) as a js test runner.
-   [x] Automatic .webp creation. Chrome, Edge, and Fire­fox all are sup­port­ing .webp, a for­mat that is more effi­cient than JPEG.
-   [x] Offline Com­pres­sion of sta­t­ic resources.  We can pre-com­press our sta­t­ic resources into .gz files that our web­serv­er can auto­mat­i­cal­ly serve up to clients that accept them

Todo:

-   [] Critical CSS. This makes your initial page loads significantly faster.
-   [] Workbox Service Worker. We can leverage Google's Workbox project to generate a Service Worker that will know about our project's assets.
-   [] Modern & Legacy JS Bundles. I want to deploy modern ES2015+ JS modules to the 75%+ of browsers that support it, while gracefully providing a fallback legacy bundle for legacy browsers (with transpiled code and polyfills). Not implemented yet.

Why? You need some basic tooling to get started with a current-generation frontend web development project. You may,
or may not, be sure if you need all the bells and whistles but you'd much rather have a setup that is easily extensible
and does the basics (build a distribution package, bundle JS, transpile ES2019 into ES5) than starting from zero.

## 🔧 Installation

Just clone or download this repository into your Fork CMS Themes directory and start hacking away!

1. Copy this boilerplate to your `src/Frontend/Themes/MyThemeName` folder in your new Fork CMS project.
2. Install dependencies by running `npm install` in your theme directory.
3. Run `npm run build` and browse to your website.
4. When doing local development, run `npm run start` to start a dev server which you can visit on http://localhost:3000. It proxies your local fork cms website (assuming its running on http://localhost:80, but you can change that in `webpack.development.js`.

### 📦 Available commands

-   `npm run build` - create a production-ready build in the `dist` folder.
-   `npm run build:dev` - create a development build.
-   `npm run start` - start the webpack-dev-server with HMR.
-   `npm run prettier` - Execute [Prettier](https://prettier.io/) on your JS/CSS files.
-   `npm run prettier-check` - Check for [Prettier](https://prettier.io/) on your JS/CSS files.
-   `npm run test` - Test Javascript code using [Jest](https://jestjs.io/)
-   `npm run lint` - Lint your code using [ESLint](https://eslint.org/)
-   `npm run test` - Run js unit tests with Jest

The `build` operation will clear the `dist` folder and compile/transpile and place fresh files in the `dist` folder.

The `npm run start` command will use webpack-dev-server to start the dev server at `0.0.0.0:3000`. Webpack will use
`Core/Js/app.ts` as the entrypoint and from there it will import the `app.css` file and other components and dependencies. With the server active, any files you work on and update will trigger a live update using Hot Module Replacement (no refreshing!).

## 🔨 Fork CMS changes needed

### Manifest-based asset versioning in Symfony & Fork CMS

<details>
Each file generated by Webpack contains a chunkhash for [long-term caching](https://webpack.js.org/guides/caching/). Webpack generates a `dist/manifest.json` file, mapping all source file names to their corresponding output file. For example:

```
{
  "app.css": "/src/Frontend/Themes/MyTheme/dist/app.89b2d31313389a466bb524e9051378bc.css",
  "app.js": "/src/Frontend/Themes/MyTheme/dist/app.7532415ade478926494f.js",
  "vendor.js": "/src/Frontend/Themes/MyTheme/dist/vendor.a607ffefbb3865c31743.js"
}
```

The random-looking part of the paths is called "chunk hash" in Webpack and it's a hash of the file contents.
This is the best strategy for long-term asset caching, because the hash, and therefore the asset path, will change
as soon as you make any change in the asset file, busting any existing cache. If we do not change our css or vendor code, the hash will stay the same after a rebuild and no cache busting is needed.

To be able to include your `.js` and `.css` files in your `Head.html.twig` regardless of the version, you can use the
[Asset component](https://symfony.com/components/Asset) of Symfony to manage the assets. Define a new `json_manifest_path` asset config option:

```
# app/config/config.yml
framework:
    # ...
    assets:
        json_manifest_path: '%kernel.root_dir%/../src/Frontend/Themes/MyTheme/dist/manifest.json'
```

Then, use the `asset()` function in your Twig files:

```
<link rel="stylesheet" type="text/css" href="{{ asset('app.css') }}">

<script defer src="{{ asset('vendor.js') }}"></script>
<script defer src="{{ asset('app.js') }}"></script>
```

The new version strategy will turn that link into `<link href="/src/Frontend/Themes/MyTheme/dist/app.89b2d31313389a466bb524e9051378bc.css">` and it will update it as soon as you change the original asset file and rebuild using Webpack.

</details>

## Learn more about Webpack?

-   https://webpack.academy
-   https://egghead.io/courses/using-webpack-for-production-javascript-applications
-   https://survivejs.com/webpack/appendices/hmr/
-   https://codeburst.io/long-term-caching-of-static-assets-with-webpack-1ecb139adb95
-   https://hackernoon.com/a-tale-of-webpack-4-and-how-to-finally-configure-it-in-the-right-way-4e94c8e7e5c1
-   https://medium.com/front-end-weekly/webpack-and-dynamic-imports-doing-it-right-72549ff49234
-   https://nystudio107.com/blog/an-annotated-webpack-4-config-for-frontend-web-development
