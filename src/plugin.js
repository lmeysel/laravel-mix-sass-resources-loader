const mix = require('laravel-mix'),
	path = require('path'),
	fs = require('fs');

let mixVersion = 0, sassVersion = 0;
(function () {
	const mixPackage = require('laravel-mix/package.json');
	mixVersion = parseInt(mixPackage['version'].match(/^(\d+)\./)[1]);

	try {
		require.resolve('sass-loader/package.json');
	} catch (x) {
		throw new Error('Cannot determine sass-loader\'s version');
	}
	const sassPackage = require('sass-loader/package.json');
	sassVersion = parseInt(sassPackage['version'].match(/^(\d+)\./)[1]);
})();

const ext = new class {
	register(...args) {
		if (!this.resources) this.resources = [];
		args.forEach(a => a instanceof Array ?
			this.resources.push.apply(this.resources, a.map(r => path.resolve(process.cwd(), r))) :
			this.resources.push(path.resolve(process.cwd(), a)));

		// if (mixVersion >= 6 && this.resources.length > 1)
		// 	console.warn('laravel-mix-sass-resources-loader can only handle one resource file as of laravel-mix@6');
	}
	dependencies() { return mixVersion >= 6 ? null : ['sass-resources-loader']; }

	webpackConfig(config) {
		const rules = config.module.rules.filter(rule =>
			((rule.test instanceof RegExp) && (rule.test.test('asdf.scss') || rule.test.test('asdf.sass')))
			|| (typeof (rule.test) === 'string' && /\.s[ac]ss$/.test(rule.test)));

		const ldr = { loader: 'sass-resources-loader', options: { resources: this.resources } };
		if (mixVersion <= 5) {
			rules.forEach(rule => {
				if (rule.loaders) {
					rule.use = rule.loaders;
					delete rule.loaders;
				}
				rule.use.push(ldr)
			});
		}
		if (mixVersion >= 6) {
			const injectionKey = sassVersion <= 8 ? 'prependData' : 'additionalData';
			const prepend = this.resources.map(r => `@import '${r.replace(/\\/g, '/')}';`).join('\n');
			const modify = loader => {
				if (typeof loader == 'string') {
					const obj = { loader, options: {} };
					obj.options[injectionKey] = prepend;
					return obj;
				} else if (typeof loader === 'object') {
					const obj = loader.options || {};
					obj[injectionKey] = prepend;
					loader.options = obj;
					return loader;
				}
			}
			const injectRule = use => {
				const i = use.findIndex(l => l == 'sass-loader' || l.loader == 'sass-loader');
				if (i !== -1)
					use[i] = modify(use[i]);

			}
			rules.forEach(rule => {
				if (rule.use)
					injectRule(rule.use instanceof Array ? rule.use : [rule.use]);
				else if (rule.oneOf)
					rule.oneOf.forEach(oneOf => injectRule(oneOf.use instanceof Array ? oneOf.use : [oneOf.use]));
			});
		}
		if (mixVersion == 5) {
			// vue loader
			const rule = config.module.rules.find(rule => (rule.test instanceof RegExp && rule.test.test('asdf.vue')));
			['sass', 'scss'].forEach(st => {
				if (!rule.options.loaders[st])
					rule.options.loaders[st] = ['style-loader', 'css-loader', 'sass-loader', ldr];
				else rule.options.loaders[st].push(ldr);
			});

		}
	}
}();

mix.extend('sassResources', ext);
