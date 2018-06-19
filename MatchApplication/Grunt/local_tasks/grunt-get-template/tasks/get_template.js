var cheerio = require('cheerio');

module.exports = function(grunt) {
	'use strict';

	/**
	 * Task for converting a folder of HTML documents to text templates stored in a Javascript class, sued by the KnockoutManager library.
	 */

	grunt.registerMultiTask('get_template', 'Get HTML template using Cheerio', function() {
		var resultArray = [],
			options = this.options({
				writeDom			: false,
				xmlMode				: false,
				normalizeWhitespace	: true,
				selectors			:{},
				cheerioHook			:null,
				wrapperClassName	: "knockout-template-wrapper"
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
					file: filepath.split("/").pop().split(".")[0]
				};
			});

			//Foreach actual file source.
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

						if (opts && opts.action) {
							output = $(selector)[opts.action](opts.input);

							if(output == null){
								grunt.log.error("No template data in file: " + obj.file);
							}

							if(/^<!--/.test(output.trim()) && typeof options.wrapperClassName === "string" && options.wrapperClassName.length > 0){
								output = '<div class="' + options.wrapperClassName + '">' + output + '</div>';
							}

							if (opts.output && output) {
								//Here's the magic. We add the filename and html to an array and save the array to the grunt config file.
								resultArray[index] = {property: obj.file.replace("-", "_"), html: formatter(output)};
								grunt.config.set(opts.output, resultArray);
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
	 * Method for formatting the HTML string we want as a template. Removes, whitespace and html comments.
	 * @param {String}  text - HTML string.
	 * @returns {XML|string}
	 */

	var formatter = function(text){
		//Fjernet løsning som fjerner kommentarer fra html: .replace(/<!--(?!(\s?ko\sif:)|(\s?\/ko)).*?-->/g, "") 16.02.16
		return text.replace(/\r?\n|\r/g, "").replace(/>\s+</g, "><").replace(/^\s+|\s+$/g, "").replace(/'/g, "&apos;");
	};

};