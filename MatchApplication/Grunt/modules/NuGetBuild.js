/**
 * Module export of the options for the grunt task.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    'use strict';

    return{
        /**
         * Settings for the Grunt job.
         */

        settings: {
            nugetFileNameProperty       : 'nuGetFileName',
            nugetTemplateFile           : 'Grunt/files/templates/NugetTemplate.txt',
            uploadPackageProptText      : 'Should the build system upload the created package to the nuGet server?',
            nugetBuildFolder            : 'release',
            nugetServer                 : 'Http://oxxNugetServer',
            nugetApiKey                 : '6CBB35F8-72EC-47D6-8B81-191C5D0F7AB9',
            dependencyField             : 'dependencies',
            nugetDependencyField        : 'nugetDependencies',
            minDependencyVersionField   : 'minVersion',
            isInternalDependencyField   : "isInternal",
            includeFilesInNugetPackage  : []
        },

        /**
         * Settings for the nuGet build script.
         */

        create_nuget: {
            build_nuget_package:{
                options: {
                    fileNameProperty        : '<%= settings.nugetFileNameProperty %>',
                    nuGetTemplateFile       : '<%= settings.nugetTemplateFile %>',
                    nuSpecDestinationFolder : '<%= settings.nugetBuildFolder %>'
                },
                files: '<%= settings.includeFilesInNugetPackage %>'
            }
        },

        upload_nuget: {
            options: {
                fileNameProperty    : '<%= settings.nugetFileNameProperty %>',
                nugetPackageDir     : '<%= settings.nugetBuildFolder %>',
                promptText          : '<%= settings.uploadPackageProptText %>',
                nugetServer         : '<%= settings.nugetServer %>',
                nugetApiKey         : '<%= settings.nugetApiKey %>'
            }
        },

        /**
         * Settings for the prompt task. Used for asking the user if they want to upload the nuGet file a server.
         */

        prompt: {
            uploadNuget: {
                options: {
                    questions:[{
                        config: 'upload_nuget.options.doUpload',
                        type: 'confirm',
                        message: '<%= settings.uploadPackageProptText %>'
                    }]
                }
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

    grunt.loadNpmTasks('grunt-prompt');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-generate-nuget/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-upload-nuget/tasks');

    grunt.registerTask('buildNuget', ['create_nuget:build_nuget_package', 'prompt:uploadNuget', 'upload_nuget']);
};