module.exports = {
	extends: [
		'eslint:recommended',
		'plugin:vue/recommended'
	],
	"env": {
		"commonjs": true,
		"browser": true,
		"jquery": true
	},
	parserOptions: {
		"parser": "babel-eslint",
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	globals: {
	},
	rules: {
		"one-var": "off",
		"semi": "off",
		"no-cond-assign": "warn",
		"quotes": ["warn", "single"],
		"indent": ["warn", "tab"],
		"no-unused-vars": "warn",
		"no-tabs": "off",
		"no-console": "warn",
		"eqeqeq": "warn",
		"curly": "off",
		"space-before-function-paren": "off"
	}
};