    const AutoPrefixer = require('autoprefixer');
    const CssNano = require('cssnano');

/**
 * Module export of the options for the knockout template grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            sourceFilesArray                : [],
            cssBuildFileUrl                 : 'Content/css/_build.json',
            scssRootFolder                  : 'Content/css/scss',
            scssMainFileName                : 'main',
            cssTempFolder                   : 'buildsystem_temp',
            cssMinResultFolder              : 'Content/css',
            oxxComponentsCssFolder          : 'Content/css/scss/oxx.frontend',
            cssPackageName                  : null,
            scssPartialFiles                : [
                {expand: true, cwd: 'Content/css/scss', src: '_constants/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: '_scss.related/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'normalize/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'base/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'generated.partials/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/atoms/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/molecules/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/organisms/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/templates/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/pages/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'oxx.frontend/**/*.scss'}
            ],
            scssPartialFilePath             : 'Content/css/scss/_partial_imports.scss',
            autoPrefixBrowserCheckArray     : ['> 1%', 'last 2 versions']
        },

        /**
         * Automatically add all partial scss files to the scss partial file, for easy import in main.scss.
         */

        sass_compile_imports: {
            css_build: {
                options: {
                    replacePath: {
                        pattern: '<%= settings.scssRootFolder %>/',
                        replace: ''
                    }
                },
                target: '<%= settings.scssPartialFilePath %>',
                files: '<%= settings.scssPartialFiles %>'
            }
        },

        /**
         * Compile all scss files.
         */
        sass: {
            css_build: {
                options: {
                    precision: 5
                },
                files: [
                    {expand: true, cwd: '<%= settings.scssRootFolder %>', src: ['**/*.scss', '!**/_*.scss'], dest: '<%= settings.scssRootFolder %>', ext: '.css'}
                ]
            },
            css_build_debug: {
                options: {
                    sourceMap: true,
                    precision: 5,
                    sourceComments: true,
                    sourceMapContents: true,
                    sourceMapEmbed: true
                },
                files: [
                    {expand: true, cwd: '<%= settings.scssRootFolder %>', src: ['*.scss', '!_*.scss'], dest: '<%= settings.scssRootFolder %>', ext: '.css'}
                ]
            }
        },

        /**
         * The settings for the task creating the file arrays of packages defined in the build.json file. Runs the tasks defined in the
         * tasks property on the file sets.
         */

        run_tasks_on_files: {
            css_build: {
                options: {
                    sourceFile: "<%= settings.cssBuildFileUrl %>",
                    fileArrayDestinationField: "settings.sourceFilesArray",
                    filesDestinationField: "settings.cssMinResultFolder",
                    packageNameDestinationField: 'settings.cssPackageName',
                    tasks: ['xx_internal_buildCSS']
                }
            },
            css_build_debug: {
                options: {
                    sourceFile: "<%= settings.cssBuildFileUrl %>",
                    fileArrayDestinationField: "settings.sourceFilesArray",
                    filesDestinationField: "settings.cssMinResultFolder",
                    packageNameDestinationField: 'settings.cssPackageName',
                    tasks: ['xx_internal_buildDebugCSS']
                }
            }
        },

        /**
         * Concatenate all css specified in _inc file files.
         */

        concat: {
            css_build: {
                src: '<%= settings.sourceFilesArray %>',
                dest: '<%= settings.cssTempFolder %>/<%= settings.scssMainFileName %>.css'
            }
        },

        /**
         * Run postCSS plugins on the css. Includes auto prefix, and minifying css.
         */

        postcss: {
            css_build: {
                options: {
                    map: false,
                    failOnError: true,
                    processors: ()=> {
                        return [
                            AutoPrefixer({browsers: grunt.config.data.settings.autoPrefixBrowserCheckArray}), // add vendor prefixes
                            CssNano({discardComments: {removeAll: true}})
                        ]
                    }
                },
                src: '<%= settings.cssTempFolder %>/<%= settings.scssMainFileName %>.css'
            },
            css_build_debug: {
                options: {
                    map: true, // inline sourcemaps
                    failOnError: true,
                    processors: ()=> {
                        return [
                            AutoPrefixer({browsers: grunt.config.data.settings.autoPrefixBrowserCheckArray}) // add vendor prefixes
                        ]
                    }
                },
                src: '<%= settings.cssTempFolder %>/<%= settings.scssMainFileName %>.css'
            }

        },
        
        /**
         * Clean up after the build process.
         */

        clean: {
            css_build: ['<%= settings.cssTempFolder %>']
        },

        copy: {
            css_build:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.cssTempFolder %>',
                        src: '<%= settings.scssMainFileName %>.css',
                        flatten: true,
                        dest: '<%= settings.cssMinResultFolder %>',
                        rename: function(dest, src){
                            dest = dest.lastIndexOf("/") === dest.length ? dest : dest + "/";

                            return dest + grunt.config.data.settings.cssPackageName.toLowerCase() + ".min.css";
                        }
                    }
                ]
            },
            css_build_debug:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.cssTempFolder %>',
                        src: '<%= settings.scssMainFileName %>.css',
                        flatten: true,
                        dest: '<%= settings.cssMinResultFolder %>',
                        rename: function(dest, src){
                            dest = dest.lastIndexOf("/") === dest.length ? dest : dest + "/";

                            return dest + grunt.config.data.settings.cssPackageName.toLowerCase() + ".debug.css";
                        }
                    }
                ]
            }
        },

        /**
         * Setting up task for adding a version comment to the top of a concatenated and minified set of files.
         */

        usebanner: {
            css_build: {
                options: {
                    position: 'top',
                    banner: '/* VERSION <%= pkg.version %>*/',
                    linebreak: true
                },
                files: {
                    src: [ '<%= settings.cssMinResultFolder %>/<%= settings.cssPackageName.toLowerCase() %>.min.css' ]
                }
            }
        },

        /**
         * File watch for watching the css root folder for changes..
         */

        watch: {
            css_build: {
                files: ['<%= settings.scssRootFolder %>/**/*.scss'],
                tasks: ['buildSCSS'],
                options: {
                    spawn: false
                }
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks for the knockout template grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    grunt.task.loadTasks('Grunt/local_tasks/grunt-run-tasks-on-files/tasks/');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-sass-compile-imports');

    grunt.registerTask('buildSCSS', ['sass_compile_imports:css_build', 'sass:css_build', 'run_tasks_on_files:css_build']);
    grunt.registerTask('buildSCSSDebug', ['sass_compile_imports:css_build', 'sass:css_build_debug', 'run_tasks_on_files:css_build_debug']);
    grunt.registerTask('xx_internal_buildCSS', [
        'concat:css_build',
        'postcss:css_build',
        'copy:css_build',
        'usebanner:css_build',
        'clean:css_build'
    ]);
    grunt.registerTask('xx_internal_buildDebugCSS', [
        'concat:css_build',
        'postcss:css_build_debug',
        'copy:css_build_debug',
        'clean:css_build'
    ]);
    grunt.registerTask('startSCSSWatch', ['watch:css_build']);
};