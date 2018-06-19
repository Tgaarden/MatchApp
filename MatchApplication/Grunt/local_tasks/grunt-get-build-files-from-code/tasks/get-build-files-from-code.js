module.exports = function(grunt) {
    'use strict';

    /**
     * Task for setting the version strings in the AssemblyInfo.cs file of a VS project.
     */

    grunt.registerMultiTask("get_build_files_from_code", "Get files for a code build from a file via Regex", function () {
        let done = this.async(),
            packageObject = grunt.config.get("pkg"),
            options = this.options({
                buildFilesToMergeIntoResult : [],
                excludeFilesFromAutoBuild   : [],
                sourceFile                  : null,
                removeFileDuplicates        : true,
                searchRegExps               : ["\\.load\\(([^)]+)\\)"],
                targetBuildFile             : "Scripts/_build.json",
                packageId                   : packageObject.name.toLowerCase(),
                packageIdField              : "packageId",
                filesField                  : "files",
                packageField                : "packages",
                buildFileDestination        : null,
                buildFileDestinationField   : "processedFilesDestination"
            });
        
        // Sometimes the options.packageId ends up as an empty string. This fixes the problem.
        options.packageId = options.packageId.length > 0 ? options.packageId : packageObject.name.toLowerCase();
            
        if(options.sourceFile == null || options.sourceFile.length === 0) {
            console.log("\x1b[32m", "No source file set for the get-file-from-code task. Skipping....", "\x1b[0m");
            return done();
        }
        
        // Loop through all regexp options, and create an RegExp instance for each.
        let regExpArray = options.searchRegExps.map((regString) => new RegExp(regString, "gmi")),
        sourceFile = grunt.file.read(options.sourceFile),
        destFile = grunt.file.read(options.targetBuildFile);

        if(sourceFile != null && destFile != null) {
            let result = _getFileValuesFromSource(sourceFile, regExpArray, options),
                destinationAsObject = _convertDestinationToObject(destFile, options);

            if(result.length === 0) {
                grunt.log.warn("The get-file-from-code task was not able to get any file strings from the source file.");
            }
            else {
                _addPackageResultToDestination(result, destinationAsObject, options);

                if(Array.isArray(options.buildFilesToMergeIntoResult)) {
                    console.log("\x1b[32m", "There is merge build files specified in options set.");
                    _mergeExternalBuildFilesWithDestination(options.buildFilesToMergeIntoResult, destinationAsObject, options);
                }
                
                console.log("\x1b[32m", "The get-file-from-code task has found " + result.length + " files.");
                console.log("\x1b[32m", "The files will be added to the build file with the id " + options.packageId);
                

                grunt.file.write(options.targetBuildFile, JSON.stringify(destinationAsObject, null, "\t"));
                console.log("\x1b[32m", "New build object added to the build file.", "\x1b[0m");
            }
        }
        else throw new Error("get-build-files-from-code task - The source or destination file path does not resolve to a valid path.");
        
        done();
    });

    /**
     * Method for adding the result array of files to the build destination object. Creates a package object based
     * on settings in the options object.
     * @param result
     * @param destinationAsObject
     * @param options
     * @private
     */
    
    function _addPackageResultToDestination(result, destinationAsObject, options) {
        let buildArray = destinationAsObject[options.packageField],
            resultObject = {
            [options.packageIdField]: options.packageId,
            [options.filesField]: result
        };
        if(options.buildFileDestination) {
            resultObject[options.buildFileDestinationField] = options.buildFileDestination;
        }
        
        buildArray.push(resultObject);
    }

    /**
     * Method for merging in existing build.json files into the generated result.
     * @param externalFiles
     * @param destinationObject
     * @param options
     * @private
     */
    
    function _mergeExternalBuildFilesWithDestination(externalFiles, destinationObject, options) {
        let destinationPackageIds = destinationObject[options.packageField].map((packageObject) => packageObject[options.packageIdField]);
        
        externalFiles.forEach((fileName) => {
            let buildObject,
                file = grunt.file.read(fileName);

            try {
                buildObject = JSON.parse(file);
            }
            catch(e){console.log("Loading external build file failed. Error : ", e)}

            let packages = buildObject[options.packageField];

            if(Array.isArray(packages)) {
                packages.forEach((packageObject) => {
                    let key = packageObject[options.packageIdField],
                        files = packageObject[options.filesField];

                    if(key !== options.packageId) {
                        _deletePackagesWithPackageId(destinationObject, key, options);
                        let keyIndex = destinationPackageIds.indexOf(key);
                        
                        if(keyIndex > -1) {
                            destinationPackageIds.splice(keyIndex, 1);
                        }
                    }
                    
                    if(Array.isArray(files)) {
                        let destinationIndex = destinationPackageIds.indexOf(key);
                        if (destinationIndex > -1) {
                            let targetArray = destinationObject[options.packageField][destinationIndex][options.filesField];
                            if(Array.isArray(targetArray)) {
                                console.log("\x1b[34m", "Merging in files in existing data set for property: ", key, "\x1b[0m");
                                targetArray = targetArray.concat(files);    
                            } 

                            let set = new Set(targetArray);
                            destinationObject[options.packageField][destinationIndex][options.filesField] = Array.from(set);
                        }
                        else if(destinationPackageIds.indexOf(key) === -1) {
                            console.log("\x1b[34m", "Merging in new data set from external source with property: ", key, "\x1b[0m");
                            destinationObject[options.packageField].push(packageObject);
                        }
                    }
                });
            }
        });  
    }
    
    /**
     * Method for converting the destination json string to an object. Creates a default object if
     * no string is available.
     * @param dest
     * @param options
     * @returns {Object}
     * @private
     */
    
    function _convertDestinationToObject(dest, options) {
        let buildObject;
        
        try {
            buildObject = JSON.parse(dest);    
        }
        catch(e){}

        buildObject = buildObject != null ? buildObject : _createDefaultDestObject(options);
        buildObject[options.packageField] = buildObject[options.packageField]||[];
        _deletePackagesWithPackageId(buildObject, options.packageId, options);

        return buildObject;
    }

    /**
     * Method creating a default build.json object.
     * @param options
     * @returns {Object}
     * @private
     */
    
    function _createDefaultDestObject(options) {
        return {[options.packageField]: []};
    }

    /**
     * Method that checks if the build object contains a package with a given packageId. Deletes
     * the object if it exists.
     * @param buildObject
     * @param options
     * @private
     */
    
    function _deletePackagesWithPackageId(buildObject, packageId, options) {
        let buildArray = buildObject[options.packageField];

        buildArray.some((packageObject, index) => {
            if(packageObject[options.packageIdField] === packageId) {
                buildArray.splice(index, 1);
                
                return true;
            }
            return false;
        });
    }

    /**
     * Method for getting the file strings from a source, based on a regexp set in the options of the task.
     * @param {string}  source
     * @param {RegExp}  regExp
     * @param {Object}  options
     * @returns {Array}
     * @private
     */
    
    function _getFileValuesFromSource(source, regExpArray, options) {
        let groups,
            result = [];

        regExpArray.forEach((regExp) => {
            while((groups = regExp.exec(source)) != null) {
                let regExpResult = _formatStringBeforeJsonParse(groups[1]);

                if (typeof regExpResult === "string") {
                    let parsed;
                    try {
                        parsed = JSON.parse(regExpResult);
                    }
                    catch (e) {
                        throw new Error("get_build_files_from_code task - Not able to parse element found with regexp as JSON.\nIs the result an array with a trailing comma? \nResult string the task tried to parse: " + regExpResult);
                    }

                    result.push(parsed);
                }
            }
            
            source = source.replace(regExp, "");
        });
        
        result = result.reduce((flatten, values) => {
            if (Array.isArray(values)) {
                flatten = flatten.concat(values);
            }
            else if (typeof values === "string") {
                flatten.push(values);
            }

            return flatten;
        }, []);

        if (options.removeFileDuplicates) {
            let uniqueSet = new Set(result);
            result = Array.from(uniqueSet);
        }
        
        if(Array.isArray(options.excludeFilesFromAutoBuild)) {
            options.excludeFilesFromAutoBuild.forEach((value) => {
                let index = result.indexOf(value);

                if(index > -1) {
                    result.splice(index, 1);
                }
            });
        }
        
        return result;
    }

    /**
     * Method for formatting the target string. Will remove parts we don't want, and add missing quotes.
     * @param result
     * @returns {string}
     * @private
     */
    
    function _formatStringBeforeJsonParse(result) {
        result = result
            .trim()
            .replace(/\\/g, "/")
            .replace(/@Url.Content\("~\//gi, "")
            .replace(/"\)"\)/g, '"')
            .replace(/'\)'\)/g, "'");

        if(typeof result === "string" && !/^\[([\s\S]*)\]$/.test(result) && !/^["|'](.*)["|']$/.test(result)) {
            result = '"' + result + '"';
        }
        
        return result;
    }
};