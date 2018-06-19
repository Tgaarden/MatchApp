//var cheerio = require('cheerio');
const Svgo = require("svgo");
const svgo = new Svgo({});

module.exports = function(grunt) {
    'use strict';

    /**
     * Task for converting a set of svg files into text strings in a Javascript class file, witch the SVGManager class
     * uses.
     *
     * Available options for the task, with default values not included since this is a modified task witch should not be
     * tampered with :)
     */

    grunt.registerMultiTask('get_svg_file_content', 'Get HTML template using Cheerio', function() {
        var promises = [],
            done = this.async(),
            options = this.options({
                output: 'oxx.read.svg'
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
            src.map(function(obj) {
                let promise = svgo.optimize(obj.html);
                promises.push(promise);
            });

            Promise.all(promises).then((arg) => {
                if(Array.isArray(arg)) {
                    let result = arg.map((value, index) => {
                        if(typeof value.error === "string") {
                            console.log("\x1b[31m", "Error in svg parsing of file:", obj.file, ". The error given: ", result.error);
                        }
                        else if(value.data != null) {
                            return {property: src[index].file.replace("-" ,"_"), svg: value.data}
                        }
                    });

                    grunt.config.set(options.output, result);
                    console.log("\x1b[0m", "All svg files converted.");

                }

                return done();
            });

        });
    });
};