module.exports = function(grunt) {
    'use strict';

    /**
     * Task for creating a tsconfig.json file. The task will get all files in the project, and exclude all folders not specified in the includeDirectories array.
     *
     **/

    grunt.registerTask("create_ts_config_file", "A task for creating a ts-config file for the project. Excludes all files not in the include files property.", function () {
        var srcFiles,
            excludeArray,
            configObject,
            options = this.options({
                targetFile              : "tsconfig.json",
                templateSource          : "Grunt/files/templates/tsconfig.json.template",
                defaultProjectFolders   : [".dependency-cache", "Content", "Documentation", "Grunt", "Images", "node_modules", "release"],
                includeDirectories      : ["Scripts/ts", "Scripts/typings"]
            });

        if(typeof options.includeDirectories === "string"){
            options.includeDirectories = [options.includeDirectories];
        }

        //Get the tsconfig.json template file from the Grunt folder.
        configObject = grunt.file.readJSON(options.templateSource);

        //Produce the exclude file and folder array.
        excludeArray = _createDefaultFoldersExcludeArray(options.defaultProjectFolders.concat(options.includeDirectories));
        srcFiles = grunt.file.expand(["**/*.*"].concat(excludeArray));
        excludeArray = _filterFileArrayToExcludeArray(srcFiles, options.includeDirectories);
        excludeArray = options.defaultProjectFolders.concat(excludeArray.reverse());

        //Set the exclude file and folder array on the tsconfig.json object.
        configObject.exclude = excludeArray;
        //Write the configObject to disk as a file.
        grunt.file.write(options.targetFile, JSON.stringify(configObject, null, "\t"));
        grunt.log.ok("tsconfig.json file created."['yellow']);
    });

    /**
     * Task for creating a tsconfig.json file for the new Webpack build system.
     */
    
    grunt .registerTask("create_ts_config_webpack_file", "A task for creating a ts-config file for your project. Is meant for use with the Webpack build system,", function () {
        let options = this.options({
            targetFile              : "tsconfig.json",
            templateSource          : "Grunt/files/templates/tsconfig.json.webpack.template"
        });

        //Get the tsconfig.json template file from the Grunt folder.
        let configObject = grunt.file.readJSON(options.templateSource);

        //Write the configObject to disk as a file.
        grunt.file.write(options.targetFile, JSON.stringify(configObject, null, "\t"));
        grunt.log.ok("tsconfig.json file created."['yellow']);
    });


    /**
     * Method for creating a fileglob array for all the files we do not need to search for in the project, since we have specified them in the defaultProjectFolders array.
     * @param {Array<string>}   sourceArray
     * @returns {Array<string>}
     * @private
     **/

    function _createDefaultFoldersExcludeArray(sourceArray){
        var result;

        if(Array.isArray(sourceArray)){
            result = sourceArray.map(function(element){
                return "!" + element + "/**/*.*";
            });
        }

        return result;
    }


    /**
     * Method for taking the complete array of files found in the project, and extracting the
     * folders we want to exclude.
     * @param {Array<string>}   sourceArray
     * @param {Array<string>}   includedFolders
     * @returns {Array<string>}
     * @private
     */


    function _filterFileArrayToExcludeArray(sourceArray, includedFolders){
        var result;

        if(Array.isArray(sourceArray)){
            result = sourceArray.map(function(element){
                return _getFolderPathArrayFromFilePath(element);
            });

            result = _findUniqueFilesAndFoldersInArray(result, includedFolders);
        }

        return result;
    }

    /**
     * Method for getting an array from a file path. Splits the file path and
     * returns an array of strings.
     * @param {string}  path
     * @returns {Array<string>}
     * @private
     */

    function _getFolderPathArrayFromFilePath(path){
        var result = path.split("/");

        if(result.length > 1 && result[result.length - 1].indexOf(".") > -1){
            result.pop();
        }

        return result;
    }

    /**
     * Method for sorting an array, based on the length of the arrays contained in the array.
     * The shortest arrays are sorted first.
     * @param {Array}   array
     * @returns {Array}
     * @private
     */

    function _sortArrayAfterSubArrayLength(array){
        return array.sort(function(a, b){
            if(a.length > b.length){
                return 1;
            }
            else if(a.length < b.length){
                return -1;
            }
            return 0;
        });
    }

    /**
     * Method for looping through the array of path arrays, and finding all unique elements,
     * leaving an array of unique paths we want to include in the exclude array of the tsconfig.json file.
     * @param {Array<string>}   array
     * @param {Array<string>}   includedFolders
     * @returns {Array<Array<string>>}
     * @private
     */

    function _findUniqueFilesAndFoldersInArray(array, includedFolders){
        var pathsArray,
            returnValue,
            result = [];

        if(Array.isArray(includedFolders)){
            includedFolders = includedFolders.map(function(element){
                return _getFolderPathArrayFromFilePath(element);
            });

            if(Array.isArray(array)){
                array = array.filter(function(element){
                    return _checkExcludePathArray(element, includedFolders);
                });

                array = _sortArrayAfterSubArrayLength(array);

                while(array.length > 0){
                    pathsArray = array.shift();

                    array = array.filter(function(element){
                        returnValue = true;

                        for(var i = pathsArray.length -1; i > -1; --i){
                            if(!pathsArray[i] || !element[i] || pathsArray[i].trim().toLowerCase() !== element[i].trim().toLowerCase()){
                                break;
                            }

                            returnValue = false;
                        }

                        return returnValue;
                    });

                    result.push(pathsArray.join("/"));
                }
            }
        }

        return result;
    }

    /**
     * Method for checking if a excludePatArray is in the includedFolders. Sends a true/false
     * based on the result.
     * @param {Array<string>}           excludePathArray
     * @param {Array<Array<string>>}    includedFolders
     * @returns {boolean}
     * @private
     */

    function _checkExcludePathArray(excludePathArray, includedFolders){
        var returnValue;

        for(var i = excludePathArray.length - 1; i > -1; --i){
            returnValue = true;

            includedFolders.forEach(function(includeArray){
                if(!includeArray[i] || !excludePathArray[i] || includeArray[i].trim().toLowerCase() === excludePathArray[i].trim().toLowerCase()){
                    returnValue = false;
                }
            });

            if(returnValue){
                return true;
            }
        }

        return false;
    }
};