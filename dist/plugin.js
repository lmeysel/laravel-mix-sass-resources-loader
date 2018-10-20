'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var mix = require('laravel-mix');
var path = require('path');

var ext = new (function () {
	function _class() {
		_classCallCheck(this, _class);
	}

	_createClass(_class, [{
		key: 'register',
		value: function register() {
			var _this = this;

			if (!this.resources) this.resources = [];

			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			args.forEach(function (a) {
				return a instanceof Array ? _this.resources.push.apply(_this.resources, a.map(function (r) {
					return path.resolve(__dirname, '../../../' + r);
				})) : _this.resources.push(path.resolve(__dirname, '../../../' + a));
			});
		}
	}, {
		key: 'dependencies',
		value: function dependencies() {
			return ['sass-resources-loader'];
		}
	}, {
		key: 'webpackConfig',
		value: function webpackConfig(config) {
			var rules = config.module.rules.filter(function (rule) {
				return rule.test instanceof RegExp && rule.test.test('asdf.scss') || typeof rule.test === 'string' && /\.s[ac]ss$/.test(rule.test);
			});

			var ldr = { loader: 'sass-resources-loader', options: { resources: this.resources } };
			rules.forEach(function (rule) {
				if (rule.loaders) {
					rule.use = rule.loaders.map(function (loader) {
						return { loader: loader };
					});
					delete rule.loaders;
				}
				rule.use.push(ldr);
			});

			var rule = config.module.rules.find(function (rule) {
				return rule.test instanceof RegExp && rule.test.test('asdf.vue');
			});
			['sass', 'scss'].forEach(function (st) {
				if (!rule.options.loaders[st]) rule.options.loaders[st] = ['style-loader', 'css-loader', 'sass-loader', ldr];else rule.options.loaders[st].push(ldr);
			});
		}
	}]);

	return _class;
}())();

mix.extend('sassResources', ext);

//# sourceMappingURL=plugin.js.map