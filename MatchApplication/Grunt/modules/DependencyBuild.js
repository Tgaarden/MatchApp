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

        settings: {
            projectsRootFolder          : 'C:/webstorm/.oxx_components',
            utilsPackageId              : 'Oxx.Frontend.Utils',
            utilsProjectName            : 'UtilsLibrary',
            buildPackageId              : 'Oxx.Frontend.Buildsystem',
            buildProjectName            : 'GruntBuildSystem',
            packageIdField              : 'packageId',
            projectUrlField             : 'projectFileUrl',
            packageRootDirField         : 'rootDir',
            dependencyField             : 'dependencies',
            nugetDependencyField        : 'nugetDependencies',
            projectPackagesField        : 'projectPackages',
            filesField                  : 'files',
            internalField               : 'isInternal',
            buildDependencyIsInternal   : true,
            dependencyFilePath          : 'dependencies.json',
            dependencyCacheFolder       : '.dependency-cache',
            dependencyFileArray         : null
        },

        /**
         * Settings for creating the dependency file cache.
         */

        create_dependency_cache: {
            build_dependencies: {
                options: {
                    packageIdField              : '<%= settings.packageIdField %>',
                    projectPackagesField        : '<%= settings.projectPackagesField %>',
                    dependencyCacheFolder       : '<%= settings.dependencyCacheFolder %>',
                    dependencySourceFile        : '<%= settings.dependencyFilePath %>',
                    dependencyFileArrayTarget   : 'settings.dependencyFileArray',
                    filesField                  : '<%= settings.filesField %>'
                }
            }
        },

        /**
         * Settings for the task creating the dependency file, if not present in the project.
         */

        create_dependency_file: {
            build_dependencies: {
                options: {
                    includeUtilsPackage         : true,
                    includeBuildSystemPackage   : true,
                    includeNugetDependencies    : true,
                    nugetDependencyField        : '<%= settings.nugetDependencyField %>',
                    internalField               : '<%= settings.internalField %>',
                    buildDependencyIsInternal   : '<%= settings.buildDependencyIsInternal %>',

                    utilsProjectName            : '<%= settings.utilsProjectName %>',
                    utilsPackageId              : '<%= settings.utilsPackageId %>',
                    buildProjectName            : '<%= settings.buildProjectName %>',
                    buildPackageId              : '<%= settings.buildPackageId %>',
                    packageIdField              : '<%= settings.packageIdField %>',
                    projectUrlField             : '<%= settings.projectUrlField %>',
                    dependencyField             : '<%= settings.dependencyField %>',
                    projectPackagesField        : '<%= settings.projectPackagesField %>',
                    dependencySourceFile        : '<%= settings.dependencyFilePath %>',
                    filesField                  : '<%= settings.filesField %>'
                }
            }
        },

        /**
         * Settings for the task resolving dependencies, and copying needed files into project.
         */

        resolve_dependency_file: {
            build_dependencies: {
                options: {
                    projectsRootFolder          : '<%= settings.projectsRootFolder %>',
                    packageIdField              : '<%= settings.packageIdField %>',
                    projectUrlField             : '<%= settings.projectUrlField %>',
                    dependencyField             : '<%= settings.dependencyField %>',
                    dependencyFolderName        : '<%= settings.dependencyCacheFolder %>',
                    dependencySourceFile        : '<%= settings.dependencyFilePath %>',
                    dependencyFileArrayTarget   : 'settings.dependencyFileArray'
                }
            }
        },

        /**
         * Settings for the copy task witch copies all needed files from their respective project folders, to the dependant project.
         */

        copy: {
            build_dependencies: {
                files: '<%= settings.dependencyFileArray %>'
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    grunt.task.loadTasks('Grunt/local_tasks/grunt-resolve-dependency-file/tasks/');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-create-dependency-file/tasks/');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-create-dependency-cache/tasks/');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('createDependencyCache', ['create_dependency_cache:build_dependencies', 'copy:build_dependencies']);
    grunt.registerTask('createDependencyFile', ['create_dependency_file:build_dependencies']);
    grunt.registerTask('copyDependencies', ['resolve_dependency_file:build_dependencies', 'copy:build_dependencies']);
};