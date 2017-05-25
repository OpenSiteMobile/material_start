// Copyright Notice:
//					site.js
//			Copyright©2012-2017 - OpenSiteMobile
//				All rights reserved
// ==========================================================================
//			http://opensitemobile.com and http://ngmomentum.com
// ==========================================================================
// Contact Information:
//			Author: Dwight Vietzke
//			Email:  dwight_vietzke@yahoo.com

/*

	Use 'site.js' to add site specific code for availability
	to many pages and apps. Note that here, as oppose to the 'config.js'
	file, UnderscoreJS, Modernizr, jQuery, etc. are now available for use.

	Also, add small jQuery plugin's here, (ie - jQuery FitText below).

	OpenSiteMobile MobileSiteOS site specific code:

	    Google Analytics,
	    Social site calls, etc.
	
	Plus:

	    Auto-Load Modules - based on dom elements
*/

/*global
	msos:false,
	jQuery: false
*/

msos.site = {};

msos.console.info('site -> start, (/material_start/site.js file).');
msos.console.time('site');


// --------------------------
// VisualEvent DOM3 Event Tracking
// --------------------------

// Add event debugging to "addEventListener", for DOM3 "VisualEvent"
if (msos.config.visualevent) {

	// Add event debugging to "addEventListener"
	Element.prototype.recorded_addEventListener = [];
	Element.prototype.org_addEventListener = Element.prototype.addEventListener;
	Element.prototype.addEventListener = function (a, b, c) {
		"use strict";

		this.org_addEventListener(a, b, c);

		// Exclude jQuery added event, (we get them later)
		if (typeof jQuery._data(jQuery(this)[0], 'events') !== 'object') {
			this.recorded_addEventListener.push(
				{
					"type" : a,
					"func" : b.toString(),
					"removed": false,
					"source": 'DOM 3 event'
				}
			);
		}
	};
}


// --------------------------
// Google Analytics Tracking Function
// --------------------------

msos.site.google_analytics = function () {
    "use strict";

    // Set to your website or remove if/else statment
    if (document.domain === msos.config.google.analytics_domain) {

		var url = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js',
			ga_loader = new msos.loader();

		// Use our loader for better debugging
		ga_loader.load('google_analytics_api', url, 'js');

    } else {
		msos.console.warn('msos.site.google_analytics -> please update msos.config.google.analytics_domain in config.js!');
      }
};


// --------------------------
// Site Specific Code
// --------------------------

msos.site.auto_init = function () {
    "use strict";

	var temp_ai = 'msos.site.auto_init -> ',
		cfg = msos.config,
		req = msos.require,
		bw_val = msos.config.storage.site_bdwd.value || '',
		bdwidth = bw_val ? parseInt(bw_val, 10) : 0;

	msos.console.debug(temp_ai + 'start.');

	// Run MobileSiteOS sizing (alt. would be: use media queries instead)
	if (cfg.run_size)		{ req("msos.size"); }

	// Add event debugging functions
    if (cfg.visualevent)	{ req("msos.visualevent"); }

    // If a mobile (touch) operating system
    if (cfg.mobile)			{ req("msos.mobile"); }

    // Add auto window.onerror alerting
    if (cfg.run_onerror)	{ req("msos.onerror"); }

	// Add debugging output (popup)
	if (cfg.debug_output)	{ req("msos.debug"); }

	// Add MSOS console output
	if (cfg.console)		{ req("msos.pyromane"); }

	// Or based on configuration settings
	if (cfg.run_analytics && bdwidth > 150)		{ msos.site.google_analytics(); }
	if (cfg.run_translate && bdwidth > 150)		{ req("msos.google.translate"); }

	msos.console.debug(temp_ai + 'done!');
};


// Load site specific setup code
msos.onload_func_pre.push(msos.site.auto_init);

msos.console.info('site -> done!');
msos.console.timeEnd('site');