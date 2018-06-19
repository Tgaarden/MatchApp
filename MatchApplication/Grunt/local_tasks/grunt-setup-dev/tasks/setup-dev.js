module.exports = function(grunt) {
    'use strict';

    grunt.registerTask("setup_dev", "A Task for setting up dev files for the build system.", function () {
        var options = this.options({
            nodeLinkerExePath: "NodeLinker.exe",
            devTemplatePath: "Grunt/templates/DevBuild.js",
            devTemplateTarget: "Scripts/build/DevBuild.js"
        });
        //Removes the NodeLinker.exe file, since you do not need it if you're able to run this task.

        if(grunt.file.isFile(options.nodeLinkerExePath)){
            grunt.file.delete(options.nodeLinkerExePath);
            grunt.log.ok('Deleting the NodeLinker.exe file. This is not needed anymore, since you are running Grunt.'['yellow']);
        }

        //Copy the dev file, if it does not exist allready.
        if(grunt.file.isFile(options.devTemplatePath)){
            if(!grunt.file.isFile(options.devTemplateTarget)){
                grunt.file.copy(options.devTemplatePath, options.devTemplateTarget);
                grunt.log.ok('Added dev config file for the build system to Scripts/build/'['yellow']);
            }
            else{
                grunt.log.error('The dev build file allready exists. This will not be overwritten. Delete this file, if you want to create a new dev file for the build system.');
            }

        }


    });
};