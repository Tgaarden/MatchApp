module.exports = function(grunt) {
    'use strict';

    /**
     * Task for creating a dependency file in the project.
     *
     * Available options for the task, with default values:
     *
     * includeUtilsPackage         : true                               - Should the utils library be included as default when creating the file.
     * utilsPackageId             : 'Oxx.Frontend.Utils'               - Utils package id
     * utilsProjectUrl             : 'UtilsLibrary'                     - Path to the project the utils package resides in.
     * packageIdField              : 'packageId'                        - Field name for the package id in the dependency file.
     * projectUrlField             : 'projectFileUrl'                   - Field name for the project file url in the dependency file.
     * dependencyField             : 'dependencies'                     - Field name for the dependency array on the main object of the dependency object.
     * dependencySourceFile        : 'dependencies.json'                - File path to the dependency file.

     */

    grunt.registerMultiTask("create_dependency_file", "A task for creating a dependency file for the project.", function () {
        var done = this.async(),
            fileObject,
            optionsObject,
            options = this.options({
                packageIdField          : 'packageId',
                projectUrlField         : 'projectFileUrl',
                dependencyField         : 'dependencies',
                dependencySourceFile    : 'dependencies.json'
            });

        if(!grunt.file.isFile(options.dependencySourceFile)){
            fileObject = {};

            fileObject[options.projectPackagesField] = [];
            fileObject[options.dependencyField] = [];

            optionsObject = {};
            optionsObject[options.packageIdField] = grunt.config.get('pkg').name;
            optionsObject[options.filesField] = [];
            optionsObject[options.filesField].push("Scripts/ts/Oxx/addFilesAndFoldersYouWantToInclude.*");
            optionsObject[options.filesField].push(_createDefaultJsPackage());
            optionsObject[options.filesField].push(_createDefaultCssPackage());
            optionsObject[options.filesField].push(_createDefaultScssDebugPackage());

            fileObject[options.projectPackagesField].push(optionsObject);

            if(options.includeBuildSystemPackage){
                optionsObject = {};
                optionsObject[options.internalField] = options.buildDependencyIsInternal;
                optionsObject[options.packageIdField] = options.buildPackageId;
                optionsObject[options.projectUrlField] = options.buildProjectName;

                fileObject[options.dependencyField].push(optionsObject);
            }

            if(options.includeUtilsPackage){
                optionsObject = {};
                optionsObject[options.packageIdField] = options.utilsPackageId;
                optionsObject[options.projectUrlField] = options.utilsProjectName;

                fileObject[options.dependencyField].push(optionsObject);
            }


            console.log(options.includeNugetDependencies);
            
            if(options.includeNugetDependencies){
                fileObject[options.nugetDependencyField] = [];
                optionsObject = {};
                optionsObject[options.packageIdField] = "jQuery";
                optionsObject.version = "2.2.3";

                fileObject[options.nugetDependencyField].push(optionsObject);
            }
            
            grunt.file.write(options.dependencySourceFile, JSON.stringify(fileObject, null, "\t"));
        }
        else{
            grunt.log.ok("A dependency file allready exists for this project..."['yellow']);
        }

        return done();
    });

    /**
     * Method for creating a default js copy object for the dependency build. Copies the built js file to the libraries folder of the
     * dependency folder.
     *
     * @returns {object}
     * @private
     */

    function _createDefaultJsPackage(){
        return {
            expand: true,
            flatten: true,
            src: "release/Scripts/*.js",
            dest: "Scripts/js/libraries/",
            renameToPackageName: true
        };
   }

    function _createDefaultCssPackage(){
        return {
            expand: true,
            flatten: true,
            src: "release/Content/css/*.css",
            dest: "Content/css/libraries/",
            renameToPackageName: true
        };
    }

    function _createDefaultScssDebugPackage(){
        return {
            expand: true,
            flatten: false,
            cwd: "release/content/organisms/",
            src: "**/*.scss",
            dest: "Content/css/scss/oxx.frontend/",
            renameToPackageName: false
        };
    }
};