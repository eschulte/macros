module.exports = {
	globDirectory: '_site/',
	globPatterns: [
		'**/*.{json,js,html,png}'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
	swDest: '_site/sw.js'
};