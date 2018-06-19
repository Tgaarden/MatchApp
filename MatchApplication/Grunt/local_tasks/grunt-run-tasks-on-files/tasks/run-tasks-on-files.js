module.exports = function(grunt) {
    'use strict';

    /**
     * Grunt task for creating sets of files based on a json build file, and run tasks on these filesets.
     * Used for building more than 1 JS and CSS file, for the dependency solution keeping code over projects in sync,
     * and in the documentation solution, for creating documentation from a set of files.
     *
     * Available options for the task, with default values:
     *
     *  sourceFile                  : 'Scripts/_build.json'             - The source build file url.
     *  fileArrayDestinationField   : 'settings.sourceFilesArray'       - The settings field the file array is saved to.
     *  filesDestinationField       : 'settings.javascriptDestFolder'   - The settings field the finished javascript file is saved to.
     *  packageNameDestinationField : 'settings.javascriptPackageName'  - The settings field
     *  tasks                       : ['']                              - Array of tasks to run on the file set.
     *
     *
     */

    grunt.registerMultiTask("run_tasks_on_files", "A task loading in an JSON file with sets of files, letting you run tasks on the filesets", function () {
        var done = this.async(),
            sourceObject,
            taskArray = [],
            options = this.options({
                packageIdField      : "packageId",
                filesField          : "files",
                packageField        : "packages",
                buildFileUrlField   : "buildFileUrl",
                destinationField    : "processedFilesDestination"
            }),
            source = grunt.file.readJSON(options.sourceFile);

        //Check if a source file was downloaded, and that is contains a package array.
        if(source && Array.isArray(source[options.packageField])){
            //Loop through all packages in the array, and create a internal task for each set of files.
            for(var i = 0, length = source[options.packageField].length; i < length; ++i){
                sourceObject = source[options.packageField][i];
                taskArray.push('internal_run_task:'+_createSerialisedObject(sourceObject) + ":" + _createSerialisedObject(options));
            }
        }
        else{
            grunt.log.warn("The sourceFile path did not resolve to a recognisable source object. Make sure the content of the file is valid JSON.");
        }

        //Run all internal tasks created.
        grunt.task.run(taskArray);

        return done();
    });

    /**
     * An internal Grunt task used by the run_tasks_on_files task. Makes each set of files it's own task.
     */

    grunt.registerTask("internal_run_task", "An internal task used by the run_tasks_on_files", function(sourceObject, options) {
        var message,
            taskArray,
            sourceFiles,
            packageName,
            done = this.async();

        sourceObject = _createObjectFromSerialised(sourceObject);
        options = _createObjectFromSerialised(options);
        sourceFiles = sourceObject[options.filesField];

        if(Array.isArray(sourceFiles)) {
            sourceFiles = grunt.file.expand(sourceFiles);
            grunt.config.set(options.fileArrayDestinationField.split("."), sourceFiles);

            //Set the files array tho its field in the settings object.
            if (typeof sourceObject[options.destinationField] === "string" && sourceObject[options.destinationField].length > 0) {
                grunt.config.set(options.filesDestinationField.split("."), sourceObject[options.destinationField]);
            }

            //Set the package name to its field in the settings object.
            packageName = (typeof sourceObject[options.packageIdField] === "string" && sourceObject[options.packageIdField].length > 0) ? sourceObject[options.packageIdField] : grunt.config.get("pkg").name;

            if (packageName && packageName.length > 0) {
                grunt.config.set(options.packageNameDestinationField.split("."), packageName);
            }
            else{
                grunt.log.error("The current JS build task does not have a valid packageId.");
            }

            //Run tasks on the set of files.
            if (Array.isArray(grunt.config.get(options.fileArrayDestinationField.split(".")))) {
                taskArray = options.tasks;

                if (Array.isArray(taskArray)) {
                    message = "Running tasks on " + (sourceObject[options.packageIdField]||"default") + " file set. The set contains " + sourceFiles.length + " file(s).";

                    grunt.log.ok("\x1b[32m", message, "\x1b[30m");
                    grunt.task.run(taskArray);
                }
            }
        }

        return done();
    });

    /**
     * Helper method for converting an object to a string. A dirty hack used for passing objects from one task to another.
     *
     * @param {object}  asObject
     * @returns {string}
     * @private
     */

    function _createSerialisedObject(asObject){
        return JSON.stringify(asObject).replace(/"/g, "'").replace(/:/g, "¤");
    }

    /**
     * Helper method for converting a string to an object. A dirty hack used for passing objects from one task to another.
     * @param {string}  asSerialised
     * @returns {object}
     * @private
     */

    function _createObjectFromSerialised(asSerialised){
        return JSON.parse(asSerialised.replace(/¤/g, ":").replace(/'/g, "\""));
    }
};