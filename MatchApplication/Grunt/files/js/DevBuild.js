/**
 * This is the dev grunt task file that you can use for your own tasks and build setup. This file will not
 * be overwritten on build system updates.
 */

/**
 * Module export of the options for the grunt task.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        //Add your own settings here. These will be loaded in last, and overwrite any default values found in the gruntfile.jd file.
        settings: {
            scssPartialFiles : [
                {expand: true, cwd: 'Content/css/scss', src: '_constants/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: '_scss.related/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'normalize/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'base/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'generated.partials/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'oxx.frontend/**/*.scss'}

            ],
            scssPartialFilePath : 'Content/css/scss/_partial_imports.scss'
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    //Create your own tasks here. The _devRelease task is just an example...
    grunt.registerTask('_devRelease',
        [
            'buildJSProd',
            'buildSCSS',
            'cleanAllSvgFiles',
            'convertImages',
            'minifyImages',
            'buildIconFont',
            'buildKnockoutTemplate',
            'buildSVGTemplate'
        ]);
};