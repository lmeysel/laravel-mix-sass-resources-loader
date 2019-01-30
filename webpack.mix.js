const mix = require('laravel-mix');
require('./dist/plugin');

mix.setPublicPath('test')
	.js('test/app.vue', 'out.css')
	.sass('test/main.scss', 'out.css')
	.sassResources('test/resources.scss');