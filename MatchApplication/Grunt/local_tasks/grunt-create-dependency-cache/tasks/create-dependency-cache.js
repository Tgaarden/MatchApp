module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('create_dependency_cache', 'A task for creating a dependency file cache for the project.', function () {
        var message,
            fileArray,
            fileObject,
            sourceArray,
            source,
            projectPackage,
            projectPackages,
            done = this.async(),
            options = this.options({
                packageIdField              : 'packagedId',
                filesField                  : 'files',
                projectPackagesField        : 'projectPackages',
                dependencyCacheFolder       : '.dependency-cache',
                dependencySourceFile        : 'dependencies.json',
                dependencyFileArrayTarget   : null
            }),
            dependencyObject = grunt.file.readJSON(options.dependencySourceFile);


        if(dependencyObject && Array.isArray(dependencyObject[options.projectPackagesField])){
            if(grunt.file.isDir(options.dependencyCacheFolder)){
                grunt.file.delete(options.dependencyCacheFolder);
            }

            projectPackages = dependencyObject[options.projectPackagesField];
            fileArray = [];

            for(var i = 0, iLength = projectPackages.length; i < iLength; ++i){
                projectPackage = projectPackages[i];

                if(Array.isArray(projectPackage[options.filesField]) && projectPackage[options.filesField].length > 0){
                    sourceArray = projectPackage[options.filesField];

                    for(var j = 0, jLength = sourceArray.length; j < jLength; ++j){
                        source = sourceArray[j];

                        if(typeof source === 'string'){
                            fileObject = {};
                            fileObject.src = source;
                            fileObject.dest = options.dependencyCacheFolder + '/' + projectPackage[options.packageIdField] + '/';
                        }
                        else if((Array.isArray(source.src) || typeof source.src === 'string') && typeof source.dest === 'string'){
                            if(source.dest.search(options.dependencyCacheFolder) === -1){
                                source.dest = options.dependencyCacheFolder + '/' + projectPackage[options.packageIdField] + '/' + source.dest;
                            }
                            if(typeof source.renameToPackageName === 'boolean' && source.renameToPackageName === true){
                                source.rename = (_renameFileToPackageName).bind(this);
                            }
                            else{
                                source.rename = (_removeVersionNumber).bind(this);
                            }

                            fileObject = source;
                        }
                        else if(source.hasOwnProperty("src")){
                            source.dest = options.dependencyCacheFolder + '/' + projectPackage[options.packageIdField] + '/';
                            fileObject = source;
                        }

                        fileArray.push(fileObject);
                    }
                }
                else{
                    grunt.log.ok('The files array of the project package is empty. Ignoring package....'['yellow']);
                }
            }

            message = 'Created dependency file object for ' + fileArray.length + ' sets of files...';
            grunt.log.ok(message['yellow']);

            grunt.config.set(options.dependencyFileArrayTarget.split('.'), fileArray);
        }
        else{
            grunt.log.ok('No projectPackages found. No dependency caches will be built...'['yellow']);
        }

        return done();
    });

    /**
     * Method for renaming a source file to the package name.
     * @param {string}  destination
     * @param {string}  name
     * @returns {string}
     * @private
     */

    function _renameFileToPackageName(destination, name){
        return destination + '/' + grunt.config.get("pkg").name.toLowerCase().replace(/(_\d+\.\d+\.\d+\.min)/, "") + name.substring(name.lastIndexOf("."));
    }

    /**
     * Method for removing the version number from the js files copied into the dependency cache.
     * @param {string}  destination
     * @param {string}  name
     * @returns {string}
     * @private
     */

    function _removeVersionNumber(destination, name){
        if(/(_\d+\.\d+\.\d+\.min)/.test(name)) {
            return destination + '/' + name.toLowerCase().replace(/(_\d+\.\d+\.\d+\.min)/, "");
        }
        else{
            return destination + '/' + name;
        }
    }
};