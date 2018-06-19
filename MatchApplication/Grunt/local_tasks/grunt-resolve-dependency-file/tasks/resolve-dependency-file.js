module.exports = function(grunt) {
    'use strict';

    /**
     * Task for creating an array of files we want to copy into the project as dependencies.
     *
     * Available options for the task, with default values:
     *
     * projectsRootFolder          : '',                                - Root folder of all dependency projects.
     * packageIdField              : 'packageId'                        - Field name for the package id in the dependency file.
     * projectUrlField             : 'projectFileUrl'                   - Field name for the project file url in the dependency file.
     * dependencyField             : 'dependencies'                     - Field name for the dependency array on the main object of the dependency object.
     * dependencyFolderName        : '.dependency-builds'               - The folder all dependency files will be stored in.
     * dependencySourceFile        : 'dependencies.json'                - File path to the dependency file.
     * dependencyFileArrayTarget   : ''                                 - A Holder property for the completed file array. Should not be set manually.
     */

    grunt.registerMultiTask("resolve_dependency_file", "A task for generating the dependency file array for the project.", function () {
        var done = this.async(),
            fileArray,
            dependency,
            includedPackageIds,
            dependenciesArray,
            options = this.options({
                packageInternalField        : 'isInternal',
                packageIdField              : 'packageId',

                packageRootDirField         : 'rootDir',


                projectUrlField             : 'projectFileUrl',
                dependencyField             : 'dependencies',
                dependencySourceFile        : 'dependency.json',
                dependencyFolderName        : '.dependency-builds',
                projectsRootFolder          : 'D:/webstorm/',
                dependencyFileArrayTarget   : null
            });

        options.projectsRootFolder += (options.projectsRootFolder.lastIndexOf("/") !== options.projectsRootFolder.length -1 ? "/" : "");

        dependenciesArray = _findAllDependencies(options);

        if(Array.isArray(dependenciesArray)){
            fileArray = [];
            includedPackageIds = [];

            //For each dependency object in the dependency file...
            for(var i = 0, length = dependenciesArray.length; i < length; ++i){
                dependency = dependenciesArray[i];

                if(includedPackageIds.indexOf(dependency[options.packageIdField]) > -1){
                    grunt.log.ok("Package " + dependency[options.packageIdField] + " is already included in project. Removed from dependency tree...."['yellow']);

                    continue;
                }

                //Check that the dependency listed is not the root project. If so, remove dependency.
                if(dependency[options.packageIdField].toLowerCase() === grunt.config.get("pkg").name.toLowerCase()){
                    grunt.log.ok("Dependency reference to self. Removed from dependency tree...."['yellow']);

                    continue;
                }

                //Check if the project url resolves to a folder. If not, fail!
                if(!grunt.file.isDir(dependency[options.projectUrlField])){
                    grunt.warn("The project url for the " + dependency[options.projectUrlField] + " project does not resolve to a valid folder. Are you sure the " + dependency[options.projectUrlField] + " url is correct?");

                    return done();
                }

                includedPackageIds.push(dependency[options.packageIdField]);


                //Check if the dependency folder exist in the project. If not..
                if(grunt.file.isDir(dependency[options.projectUrlField] + "/" + options.dependencyFolderName)){
                    fileArray.push({
                        expand: true,
                        cwd: dependency[options.projectUrlField] + options.dependencyFolderName + "/" + dependency[options.packageIdField],
                        src: "**/*.*",
                        dest: process.cwd().replace(/\\/g, "/")
                    });
                    grunt.log.ok("Creating dependency copy object for the " + dependency[options.packageIdField] + " package...");
                }
                else{
                    //Check if the project url exist.
                    if(typeof dependency[options.projectUrlField] === "string" && dependency[options.projectUrlField].length > 1){
                        grunt.log.ok("No dependency folder found in target project: " + dependency[options.projectUrlField] + ". Run a build of the project, and try again..");
                    }
                    //if not project url...
                    else{
                        grunt.log.ok("Empty dependency object. No actions taken...");
                    }
                }
            }

            grunt.config.set(options.dependencyFileArrayTarget.split("."), fileArray);
        }
        else{
            grunt.log.ok("No dependencies detected for this project...");
        }

        return done();
    });

    /**
     *
     * @param options
     * @param rootPath
     * @returns {*}
     * @private
     */

    function  _findAllDependencies(options, rootPath){
        var result,
            results,
            recursiveResults,
            dependencyObject;

        rootPath = rootPath || "";

        if(grunt.file.isFile(rootPath + options.dependencySourceFile)){
            dependencyObject = grunt.file.readJSON(rootPath + options.dependencySourceFile);

            if(dependencyObject && Array.isArray(dependencyObject[options.dependencyField])) {
                results = dependencyObject[options.dependencyField];

                for(var i = 0, length = results.length; i < length; ++i){
                    result = results[i];

                    var rootDirOnDependency = result[options.packageRootDirField];

                    if(typeof rootDirOnDependency === "string" && !(/\/$/.test(rootDirOnDependency))) {
                        rootDirOnDependency += "/";
                    }

                    result[options.projectUrlField] = (rootDirOnDependency || options.projectsRootFolder) + result[options.projectUrlField];

                    if(result[options.projectUrlField].lastIndexOf("/") !== rootPath.length - 1){
                        result[options.projectUrlField] += "/";
                    }

                    if(result[options.packageInternalField] || result[options.packageIdField].toLowerCase() === grunt.config.get("pkg").name.toLowerCase()){
                        grunt.log.ok("Dependency reference to self. Removed from dependency tree...."['yellow']);
                        continue;
                    }

                    recursiveResults = _findAllDependencies(options, result[options.projectUrlField]);

                    if(Array.isArray(recursiveResults)){
                        results = results.concat(recursiveResults);
                    }
                }
            }
        }

        return results;
    }
};