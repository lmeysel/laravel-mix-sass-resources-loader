This extension utilizes the [sass-resources-loader](https://github.com/shakacode/sass-resources-loader) and plugs it into [laravel-mix](https://github.com/JeffreyWay/laravel-mix).

# Usage
Simply `require('laravel-mix-sass-resources-loader')` in your `webpack.mix.js`. Then you can apply your resources calling
```javascript
mix.sassResources('resources/sass/bootstrap-variables.scss')
// or
mix.sassResources(['file1.scss', 'file2.scss'])
```

The resources are applied in the same order you call the `sassResources`-function.

# Hints
The plugin tries to find all entry points of scss-files and adds the sass-resources-loader to the corresponding webpack rules, which is the entry-points for the sass-sources added via `mix.sass(...)` and the vue-loader. Therefore also scss/sass-files referenced from vue-components can access the resources.

Make sure your resource-files do not generate css code. It would be prefixed to all generated css.