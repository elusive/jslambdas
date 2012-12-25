/**
 * This plugin also includes a extension to
 * jQuery that allows the injection of your
 * plugin's required css declarations into
 * the page the plugin js file is sourced into
 * thus preventing the need for an external
 * css file to be included by the user.
 *
 * @author John Gilliland <johngilliland@outlook.com>
 * @version 0.9.1
 * @requires jquery-latest.js
 */
;
(function($) {
    /**
     * Credits: The code for the stylesheet creation
     * was found in a forum post on http://nabble.com
     * originally posted by Danny Wachsstock.
     * Thank you Danny.
     */
    $.extend($, {
        style   :   function(selector, options) {
	    options = $.extend ({type: 'text/css', media: 'all'}, options);
	    var sheet = $.style.sheets[options.media];
	    if (!sheet) {
	        var style = $(document.createElement('style'))
		    .attr(options)
		    .appendTo('head')[0];
		    if (style.styleSheet) {
		        // IE
			$.style.sheets[options.media] = sheet = style.styleSheet;
		    } else if (style.sheet) {
		        // Firefox
			$.style.sheets[options.media] = sheet = style.sheet;
			sheet.rules = [];
		    }
	    }

	    if (sheet.rules[selector])
	        return $(sheet.rules[selector]);

	    if (sheet.cssRules) {
	        // Firefox
		sheet.insertRule(selector+' {}', sheet.cssRules.length);
		return $(sheet.rules[selector] =
		    sheet.cssRules[sheet.cssRules.length - 1]);
            } else {
	        // IE
		sheet.addRule(selector, null);
		return $(sheet.rules[selector] = 
		    sheet.rules(sheet.rules.length - 1]);
            }
	}
    });

    // cache for sheets
    $.style.sheets = [];
})(jQuery);

// END style plugin code
// ============================================================================




/**
 * 03 FEB 2009
 * Image viewing zoom effect plugin that
 * converts a set of anchor thumbnail elements
 * into a gallery of zommable images.  A.href 
 * is linked to a larger image used to fill a 
 * view pane with an image zoomable via the 
 * mouse wheel turns and/or via a slide out
 * toolbar.
 * @author John Gilliland <johngilliland@outlook.com>
 * @version 0.9.1
 * @requires jquery.latest.js
 */
;
(function($) {

    // current gallery item
    var current = {
        thumb        :    {},
	fullsize     :    {}
    },

    // for a reference to the gallery instance
    self = this,

    // settings reference
    settings,

    // IE 5.5 or 6
    IE = $.browser.msie && /MSIE\s(5\.5|6\.)/
    	     .test(navigator.userAgent);



    /**
     * @constructor
     * Constructs the galleried plugin, by extending
     * the jQuery.fn object with the galleried function.
     */
    $.fn.extend({

        galleried : function(options) {
	    /*
	     *  Settings: extends default settings
	     *      collection to overwrite those that
	     *      are passed and leave those that
	     *      were not at their default values.
	     */
	settings = $.extend({},
		$.fn.galleried.defaults,
		options);

	// css for the plugin is generated by the 
	// plugin and injected into the page.
	GenerateCSS();

	// gallery variable holds references to 
	// all of the structural elements of the
	// gallery, most are jQuery instances...
	self = GenerateGallery(this);

	// main iteration call for each thumbnail
	// image in the original document...
	self.list.items.each(function() {

	    // get link
	    var a = $(this);
	    var aPath = a.attr('href');
	    a.click(function()) {
	        return false;
	    });

	    // get the index of this item in the list
	    var idx = $('.zoom').index(a);
	    
	    // get img
	    var img = $('img', this);

	    // create thumb object and its click
	    current.thumb = new Thumbnail(img);

