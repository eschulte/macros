// npx workbox generateSW workbox-config.js
module.exports = {
	globDirectory: '_site/',
	// globPatterns: [
	// 	'**/*.{json,js,html,png}'
	// ],
	globPatterns: [
		'**/*'
	],
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	],
        swDest: '_site/sw.js',

  // Define runtime caching rules.
  runtimeCaching: [{
    // Match requests to try the cache first.
    // urlPattern: /\.(?:js|json|html|css|png)$/,
    urlPattern: /.*/,

    // handler: 'CacheFirst',
    handler: 'StaleWhileRevalidate',

    options: {
      // Use a custom cache name.
      cacheName: 'images',

      // Only cache 10 images.
      expiration: {
        maxEntries: 10,
      },
    },
  }],

};
