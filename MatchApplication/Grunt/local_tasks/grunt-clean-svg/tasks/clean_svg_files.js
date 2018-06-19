var cheerio = require('cheerio');

module.exports = function(grunt) {
	'use strict';

	/**
	 * Task for converting a set of svg files into text strings in a Javascript class file, witch the SVGManager class
	 * uses.
	 *
	 * Available options for the task, with default values not included since this is a modified task witch should not be
	 * tampered with :)
	 */

	grunt.registerMultiTask('clean_svg_files', 'Streamline svg files with Svgo.', function() {
		var attributes,
			resultArray = [],
			options = this.options({
				writeDom: false,
				xmlMode: true,
				normalizeWhitespace: true,
				selectors:{},
				cheerioHook:null
			});

		//Foreach file object specified for the plugin.
		this.files.forEach(function(f) {
			var src = f.src.filter(function(filepath) {

				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}

			}).map(function(filepath) {
				return {
					html: grunt.file.read(filepath),
					filePath: filepath
				};
			});

			// //Foreach actual file source.
			src.map(function(obj, index) {
				var selector,
					opts,
					output,
					$ = cheerio.load(obj.html, {
						xmlMode: options.xmlMode,
						normalizeWhitespace: options.normalizeWhitespace
					});

				//For each html selector specified for the files.
				for(selector in options.selectors) {
					if(Object.prototype.hasOwnProperty.call(options.selectors, selector)){
						opts = options.selectors[selector];

						if (opts) {
							attributes = $("svg")[0].attribs;

							if(attributes){
								if(!attributes.viewBox){
									attributes.viewBox = "0 0 ";
									attributes.viewBox += (attributes.width ? attributes.width : "100") + " ";
									attributes.viewBox += (attributes.height ? attributes.height : "100");
								}

								delete attributes.x;
								delete attributes.y;
								delete attributes.version;
								delete attributes.enableBackground;
								delete attributes["enable-background"];
								delete attributes["xmlns:xlink"];
								delete attributes["xml:space"];
								delete attributes.id;

								attributes.width = "100%"; //Changed from delete to 100% 05.03.2015
								attributes.height = "100%";//Changed from delete to 100% 05.03.2015
							}

							output = cheerio.xml($(selector));

							if(output){
								grunt.file.write(obj.filePath, output.replace(/\t/g, ""));
							}

						} else {
							grunt.log.warn('Could not find an action for selector:' + selector);
						}
					}
				}

				if (options.cheerioHook) {
					options.cheerioHook($, obj.html, grunt);
				}

				if (options.writeDom) {
					grunt.file.write(f.dest + obj.file, $.html());
					grunt.log.writeln("Wrote file:" + f.dest + obj.file);
				}
			});
		});
	});

	/**
	 * Method for formatting the XML string we want as a template. Removes, whitespace and replaces ' with ".
	 * @param {String}  text - XML string.
	 * @returns {XML|string}
	 */

	var formatter = function(text){
		return text.replace(/\r?\n|\r/g, "").replace(/'/g, "\"");
	};
};