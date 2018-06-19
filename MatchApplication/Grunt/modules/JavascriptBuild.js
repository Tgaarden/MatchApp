/**
 * Module export of the options for the Javascript build grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    'use strict';

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            jsBuildFileUrl              : 'Scripts/_build.json',
            jsHtmlDocPath               : 'Documentation/htmlDoc/',
            sourceFilesArray            : [],
            typescriptSourceRoot        : 'Scripts/ts',
            javascriptSourceRoot        : 'Scripts',
            typescriptReferenceRoot     : 'Scripts',
            javascriptTempFolder        : 'Scripts/temp',
            javascriptDestFolder        : 'Scripts',
            javascriptPackageName       : null,

            buildFilesToMergeIntoResult : [],
            excludeFilesFromAutoBuild   : [],
            sourceFile                  : null,
            removeFileDuplicates        : true,
            searchRegExps               : ["\\.load\\(([^)]+)\\)"],
            targetBuildFile             : "Scripts/_build.json",
            packageId                   : null,
            packageIdField              : "packageId",
            filesField                  : "files",
            packageField                : "packages",
            buildFileDestination        : null,
            buildFileDestinationField   : "processedFilesDestination"
        },

        /**
         * Creates sets of files witch are run through the other tasks in this file.
         *
         */

        run_tasks_on_files: {
            javascript_build: {
                options: {
                    sourceFile: '<%= settings.jsBuildFileUrl %>',
                    fileArrayDestinationField: 'settings.sourceFilesArray',
                    filesDestinationField: 'settings.javascriptDestFolder',
                    packageNameDestinationField: 'settings.javascriptPackageName',
                    tasks: ['xx_internal_buildJS']
                }
            },
            javascript_prod: {
                options: {
                    sourceFile: '<%= settings.jsBuildFileUrl %>',
                    fileArrayDestinationField: 'settings.sourceFilesArray',
                    filesDestinationField: 'settings.javascriptDestFolder',
                    packageNameDestinationField: 'settings.javascriptPackageName',
                    tasks: ['xx_internal_buildJSProd']
                }
            }
        },

        /**
         * Documentation plugin for typescript.
         */

        typedoc: {
            javascript_build: {
                options: {
                    module: 'commonjs',
                    out: '<%= settings.jsHtmlDocPath %>',
                    name: '<%=pkg.name%>',
                    target: 'es5'
                },
                src: ['Scripts/ts/Oxx/**/*.ts']
            }
        },

        /**
         * TypeScript compiler.
         */

        ts: {
            typescript_build: {
                src: ['<%= settings.typescriptSourceRoot %>/**/*.ts'],
                reference: '<%= settings.typescriptSourceRoot %>/libraries/reference.ts',
                out: '<%= settings.javascriptTempFolder %>/typescriptCompiled.js',
                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    module: 'amd',
                    // true (default) | false
                    sourceMap: true,
                    // true | false (default)
                    declaration: false,
                    // true (default) | false
                    removeComments: true
                }
            }
        },

        /**
         * JSHint all JS files.
         */

        jshint: {
            javascript_build: {
                options: {
                    force: true,
                    '-W099': true,
                    '-W101': true,
                    reporter: require('jshint-stylish')
                },
                src: '<%= settings.sourceFilesArray %>'

            }
        },

        /**
         * Concatenate all JS files.
         */

        concat: {
            javascript_build: {
                src: '<%= settings.sourceFilesArray %>',
                dest: '<%= settings.javascriptTempFolder %>/concatBuild.js'
            }
        },

        /**
         * Uglify concatenated JS files.
         */

        uglify: {
            javascript_build:{
                options: {
                    compress:{
                        dead_code: true,
                        drop_console: true
                    }
                },

                files: [
                    {src: ['<%= concat.javascript_build.dest %>'], dest: '<%= settings.javascriptDestFolder %>/<%= settings.javascriptPackageName.toLowerCase() %>.min.js'}
                ]
            },
            typescript_build:{
                options: {
                    compress:{
                        dead_code: true,
                        drop_console: true
                    }
                },

                files: [
                    {src: ['<%= ts.typescript_build.out %>'], dest: '<%= settings.javascriptDestFolder %>/<%= settings.javascriptPackageName.toLowerCase() %>.min.js'}
                ]
            }
        },

        /**
         * Removes all console.log calls from the JS files.
         */

        removelogging: {
            javascript_build: {
                src: '<%= settings.javascriptTempFolder %>/concatBuild.js'
            },
            typescript_build: {
                src: '<%= settings.javascriptTempFolder %>/typescriptCompiled.js'
            }

        },

        /**
         * Setting up task for adding a version comment to the top of a concatenated and minified set of files.
         */

        usebanner: {
            javascript_build: {
                options: {
                    position: 'top',
                    banner: '// VERSION <%= pkg.version %>',
                    linebreak: true
                },
                files: {
                    src: [ '<%= settings.javascriptDestFolder %>/<%= settings.javascriptPackageName.toLowerCase() %>.min.js' ]
                }
            }
        },

        /**
         * Clean up after the build process.
         */

        clean: {
            javascript_build: ['<%= settings.javascriptTempFolder %>'],
            typedoc: ['<%= settings.jsHtmlDocPath %>']
        },

        /**gr
         * File watch for watching the javascript root folder for changes..
         */

        watch: {
            javascript_build: {
                files: ['<%= settings.javascriptSourceRoot %>/**/*.js'],
                tasks: ['buildJS'],
                options: {
                    spawn: false
                }
            }
        },

        get_build_files_from_code: {
            javascript_build: {
                options: {
                    buildFilesToMergeIntoResult : '<%= settings.buildFilesToMergeIntoResult %>',
                    excludeFilesFromAutoBuild   : '<%= settings.excludeFilesFromAutoBuild %>',
                    sourceFile                  : '<%= settings.sourceFile %>',
                    removeFileDuplicates        : '<%= settings.removeFileDuplicates %>',
                    searchRegExps               : '<%= settings.searchRegExps %>',
                    targetBuildFile             : '<%= settings.targetBuildFile %>',
                    packageId                   : '<%= settings.packageId %>',
                    packageIdField              : '<%= settings.packageIdField %>',
                    filesField                  : '<%= settings.filesField %>',
                    packageField                : '<%= settings.packageField %>',
                    buildFileDestination        : '<%= settings.buildFileDestination %>',
                    buildFileDestinationField   : '<%= settings.buildFileDestinationField %>'
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
    'use strict';

    grunt.task.loadTasks('Grunt/local_tasks/grunt-run-tasks-on-files/tasks/');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-get-build-files-from-code/tasks/');
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-typedoc');
    grunt.loadNpmTasks('grunt-banner');

    grunt.registerTask('getBuildFilesFromExternalSource', 'get_build_files_from_code:javascript_build');
    grunt.registerTask('buildJS', ['run_tasks_on_files:javascript_build']);
    grunt.registerTask('buildJSProd', ['run_tasks_on_files:javascript_prod']);
    grunt.registerTask('buildTSDocumentation', ['clean:typedoc', 'typedoc:javascript_build']);
    grunt.registerTask('xx_internal_buildJS', ['concat:javascript_build', 'removelogging:javascript_build', 'uglify:javascript_build', 'usebanner:javascript_build', 'clean:javascript_build']);
    grunt.registerTask('xx_internal_buildJSProd', ['newer:jshint:javascript_build', 'concat:javascript_build', 'removelogging:javascript_build', 'uglify:javascript_build', 'usebanner:javascript_build', 'clean:javascript_build']);
    grunt.registerTask('startBuildJSWatch', ['watch:javascript_build']);
};