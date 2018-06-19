/**
 * Module for generating an icon font.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            svgSize                     : 512,
			fontDecent                  : 64,
            useHashInFontName           : true,
            wantedFontFormats           : 'eot,woff,ttf,svg',
            wantedFormatOrder           : 'eot,svg,woff,ttf',
            fontName                    : 'iconFont',
            scssPartialFolder           : 'Content/css/scss/generated.partials',
            fontFromCssFilePath         : '../../../fonts/IconFont',
            imageRootFolder             : 'Images/_buildSystem',
            convertImagesFolder         : '_convert',
            svgToIconFontFolder         : '_svg_to_icon_font',
            fontDestFolder              : 'Content/fonts/IconFont',
            webFontCodeStartPoint       : 0xF101,
            webFontCodePoints           : {}

        },

        /**
         * Settings for the icon font generator.
         */

        webfont: {
            icon_fonts: {
                options: {
                    font: '<%= settings.fontName %>',
                    styles: 'font,icon',
                    types: '<%= settings.wantedFontFormats %>',
                    order: '<%= settings.wantedFormatOrder %>',
                    stylesheet: 'scss',
                    syntax: 'bem',
                    relativeFontPath: '<%= settings.fontFromCssFilePath %>',
                    engine: 'node',
                    startCodepoint: '<%= settings.webFontCodeStartPoint %>',
                    htmlDemo: true,
                    autoHint: false,
                    fontHeight: '<%= settings.svgSize %>',
                    descent: '<%= settings.fontDecent %>',
                    hashes: '<%= settings.useHashInFontName %>',
                    //Use http://www.unicodemap.org/range/1/Basic_Latin/ for finding char values.
                    codepoints: '<%= settings.webFontCodePoints %>'
                },
                src: '<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.svgToIconFontFolder %>/**/*.svg',
                dest: '<%= settings.fontDestFolder %>',
                destCss: '<%= settings.scssPartialFolder %>'
            }
        },

        /**
         * File watch for watching icon font svg files.
         */

        watch: {
            icon_fonts: {
                files: ['<%= get_svg_file_content.svg_template.src %>'],
                tasks: ['buildIconFont'],
                options: {
                    spawn: false
                }
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks for the grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    grunt.task.loadTasks('Grunt/local_tasks/grunt-resolve-glob/tasks/');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('buildIconFont', ['resolve_glob:webfont:icon_fonts']);
    grunt.registerTask('startIconFontWatch', ['watch:icon_fonts']);
};