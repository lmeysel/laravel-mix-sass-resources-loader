"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var mix = require('laravel-mix'),
    path = require('path'),
    fs = require('fs');

var mixVersion = 0,
    sassVersion = 0;

(function () {
  var mixPackage = require('laravel-mix/package.json');

  mixVersion = parseInt(mixPackage['version'].match(/^(\d+)\./)[1]);

  try {
    require.resolve('sass-loader/package.json');
  } catch (x) {
    throw new Error('Cannot determine sass-loader\'s version');
  }

  var sassPackage = require('sass-loader/package.json');

  sassVersion = parseInt(sassPackage['version'].match(/^(\d+)\./)[1]);
})();

var ext = new (function () {
  function _class() {
    _classCallCheck(this, _class);
  }

  _createClass(_class, [{
    key: "register",
    value: function register() {
      var _this = this;

      if (!this.resources) this.resources = [];

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args.forEach(function (a) {
        return a instanceof Array ? _this.resources.push.apply(_this.resources, a.map(function (r) {
          return path.resolve(process.cwd(), r);
        })) : _this.resources.push(path.resolve(process.cwd(), a));
      });
    }
  }, {
    key: "dependencies",
    value: function dependencies() {
      return mixVersion >= 6 ? null : ['sass-resources-loader'];
    }
  }, {
    key: "webpackConfig",
    value: function webpackConfig(config) {
      var rules = config.module.rules.filter(function (rule) {
        return rule.test instanceof RegExp && (rule.test.test('asdf.scss') || rule.test.test('asdf.sass')) || typeof rule.test === 'string' && /\.s[ac]ss$/.test(rule.test);
      });
      var ldr = {
        loader: 'sass-resources-loader',
        options: {
          resources: this.resources
        }
      };

      if (mixVersion <= 5) {
        rules.forEach(function (rule) {
          if (rule.loaders) {
            rule.use = rule.loaders;
            delete rule.loaders;
          }

          rule.use.push(ldr);
        });
      }

      if (mixVersion >= 6) {
        var injectionKey = sassVersion <= 8 ? 'prependData' : 'additionalData';
        var prepend = this.resources.map(function (r) {
          return "@import '".concat(r.replace(/\\/g, '/'), "';");
        }).join('\n');

        var modify = function modify(loader) {
          if (typeof loader == 'string') {
            var obj = {
              loader: loader,
              options: {}
            };
            obj.options[injectionKey] = prepend;
            return obj;
          } else if (_typeof(loader) === 'object') {
            var _obj = loader.options || {};

            _obj[injectionKey] = prepend;
            loader.options = _obj;
            return loader;
          }
        };

        var injectRule = function injectRule(use) {
          var i = use.findIndex(function (l) {
            return l == 'sass-loader' || l.loader == 'sass-loader';
          });
          if (i !== -1) use[i] = modify(use[i]);
        };

        rules.forEach(function (rule) {
          if (rule.use) injectRule(rule.use instanceof Array ? rule.use : [rule.use]);else if (rule.oneOf) rule.oneOf.forEach(function (oneOf) {
            return injectRule(oneOf.use instanceof Array ? oneOf.use : [oneOf.use]);
          });
        });
      }

      if (mixVersion == 5) {
        var rule = config.module.rules.find(function (rule) {
          return rule.test instanceof RegExp && rule.test.test('asdf.vue');
        });
        ['sass', 'scss'].forEach(function (st) {
          if (!rule.options.loaders[st]) rule.options.loaders[st] = ['style-loader', 'css-loader', 'sass-loader', ldr];else rule.options.loaders[st].push(ldr);
        });
      }
    }
  }]);

  return _class;
}())();
mix.extend('sassResources', ext);

//# sourceMappingURL=plugin.js.map
