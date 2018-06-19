module.exports = function(grunt) {
    'use strict';

    /**
     * Grunt task for checking if a glob resolves to a set of files or not. The task sent in as an parameter,
     * or the set of tasks sent in as an options object will run if the glob resolves to a set of files.
     *
     * Can be used as a standard task, or as a task witch takes other tasks as a parameter.
     *
     * Task as a parameter:
     *      resolve_glob:copy:css_build will check if the source files for the copy task resolves to a set of files, and
     *      if so run the copy task. The copy task will not run if the source files glob don't resolve to a set of files.
     *
     * Task used as a normal task, Available options:
     *
     * fileGlobToCheck: ''  - File/files we want to check if exists.
     * tasks: ['']          - Array of tasks we want to run, if the file globs resolves to a set of files.
     *
     */

    grunt.registerTask("resolve_glob", "Checks if a glob resolves to a set of files or not. Runs task based on result", function () {
        var fileArray,
            srcFiles,
            taskArray,
            originalConfig,
            done = this.async(),
            options = grunt.config.get(this.nameArgs.split(":"));

        options = options ? options.options : null;

        //If there is a set of options available.
        if(options && typeof options.fileGlobToCheck === "string" && Array.isArray(options.tasks)){
            srcFiles = grunt.file.expand(options.fileGlobToCheck);
            taskArray = options.tasks;
        }
        //Else the task is run with another task as a parameter.
        else{
            taskArray = [this.args.join(":")];
            originalConfig = grunt.config.get(this.args);

            //Finds the config of the parameter task and checks for file sources.
            if(originalConfig) {
                if (typeof originalConfig.src !== "undefined") {
                    srcFiles = grunt.file.expand(originalConfig.src);
                }
                else if (typeof originalConfig.files !== "undefined") {
                    srcFiles = [];
                    fileArray = grunt.task.normalizeMultiTaskFiles(originalConfig, taskArray);

                    for (var i = 0, length = fileArray.length; i < length; ++i) {
                        srcFiles = srcFiles.concat(fileArray[0].src);
                    }
                }
            }
        }

        //If file sources and length of sources are more than 0, run tasks on files.
        if(srcFiles && srcFiles.length > 0){
            grunt.log.ok("Files found. Starting tasks..."['yellow']);
            grunt.task.run(taskArray);

            return done();
        }
        else{
            grunt.log.ok("No Files found. Tasks skipped..."['yellow']);
            return done();
        }
    });
};