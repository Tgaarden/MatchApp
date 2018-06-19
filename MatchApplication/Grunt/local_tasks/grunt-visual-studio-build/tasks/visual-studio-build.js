var fs = require ("fs");

module.exports = function(grunt) {
    'use strict';


    /**
     * Task for using MSBuild for building a Visual Studio project solution. Uses the grunt spawn command for running the command.
     * Lets you configure your own set of arguments for the build.
     */

    grunt.registerTask("visual_studio_build", "Builds a release build from a Visual Studio solution project file.", function() {
        var done = done = this.async(),
            options = this.options({
                buildCommandSourceArguments     : [null, '/t:Clean,Build', '/p:Configuration=Release'],
                msBuildPath                     : 'C:/Program Files (x86)/Microsoft Visual Studio/2017/Professional/MSBuild/15.0/Bin/MSBuild.exe',
                solutionFilePath                : ''
            }),
            buildCommandArguments = options.buildCommandSourceArguments.slice();

        buildCommandArguments[0] = options.solutionFilePath;

        //Sanity check if solution file and msbuild exist.
        checkIfFileExists(options.solutionFilePath, "error", "The solution path does not resolve to a valid file");
        checkIfFileExists(options.msBuildPath, "warn", "The ms build path options does not resolve to a valid file. Make sure ms build is added to the PATH variable if you want this to work.");

        //Check if the msbuild path is set, we assume that the user has set up the msbuild path in the PATH variable if this is not set, and run the msbuild.exe command directly.
        var command = typeof options.msBuildPath === "string" && options.msBuildPath.length > 0 ? options.msBuildPath : "msbuild.exe";

        grunt.util.spawn({
            cmd: command,
            args: buildCommandArguments
        }, function (error, result) {
            if (error) {
                grunt.log.error("Visual Studio build failed. Check that the solution builds without errors when using Visual Studio.");
            } else {
                if(/Build succeeded/.test(result) && /0 Error/.test(result)) {
                    grunt.log.ok("The " + options.solutionFilePath + " solution file built successfully.\n" + result);
                }
                else {
                    grunt.log.error("The Visual Studio solution contains errors.\n" + result);
                }
            }

            done();
        });
    });

    /**
     * Method for checking if a file exists.
     * @param filePath
     * @param type
     * @param message
     */

    function checkIfFileExists(filePath, type, message) {
        try {
            fs.lstatSync(filePath).isFile();
        }
        catch(e) {
            if(e.code === "ENOENT") {
                grunt.log[type](message);
            }
        }
    }
};