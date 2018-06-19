/**
 * Module export of the options for the grunt task.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    'use strict';

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            tsConfigFilePath                : 'tsconfig.json',
            tsConfigTemplateSource          : 'Grunt/files/templates/tsconfig.json.template',
            tsConfigDefaultProjectFolders   : ['.dependency-cache', 'Content', 'Documentation', 'Grunt', 'Images', 'node_modules', 'release'],
            tsConfigScriptFolders           : ['Scripts/ts', 'Scripts/typings']
        },

        /**
         * Setting up dev files.
         */

        setup_dev: {
            options: {
                nodeLinkerExePath   : 'NodeLinker.exe',
                devTemplatePath     : 'Grunt/files/js/DevBuild.js',
                devTemplateTarget   : 'Scripts/dev-build/DevBuild.js'
            }
        },

        /**
         * Task for patching the packages.json, and grintfile.js file on build system update.
         */

        patch_grunt_files: {
            options: {
                targetFilePath      : '',
                sourceFilePath      : 'Grunt/files/grunt/'
            }
        },

        /**
         * Task for creating a tsconfig.json file for the grunt build system.
         */

        create_ts_config_file: {
            options: {
                targetFile              : '<%= settings.tsConfigFilePath %>',
                templateSource          : '<%= settings.tsConfigTemplateSource %>',
                defaultProjectFolders   : '<%= settings.tsConfigDefaultProjectFolders %>',
                includeDirectories      : '<%= settings.tsConfigScriptFolders %>'
            }
        },

        /**
         * Task for creating a tsconfig.json file for the new Webpack build system.
         */
        
        create_ts_config_webpack_file: {
            options: {
                targetFile              : '<%= settings.tsConfigFilePath %>',
                templateSource          : '<%= settings.tsConfigTemplateSource %>'
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    'use strict';

    grunt.task.loadTasks('Grunt/local_tasks/grunt-setup-dev/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-create-ts-config-file/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-patch-grunt-files/tasks');

    grunt.registerTask('_setupTsConfigWebpack', ['create_ts_config_webpack_file']);
    grunt.registerTask('_setupTsConfig', ['create_ts_config_file']);
    grunt.registerTask('_setupDevBuild', ['setup_dev']);
    grunt.registerTask('_patchBuildSystemFilesToLatestInstalledVersion', ['patch_grunt_files']);
};