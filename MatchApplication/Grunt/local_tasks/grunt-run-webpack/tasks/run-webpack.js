module.exports = function(grunt) {
    'use strict';


    /**
     * Task for running a webpack build script. Meant for building prod code that the Grunt build system has a dependency on.
     */
    
    grunt.registerTask("run_webpack", "run webpack command.", function () {
        let done = this.async(),
            options = this.options({
                webpackArguments: ["run" ,"build.production.version"]
            });

        if(Array.isArray(options.webpackArguments) && options.webpackArguments.length > 0 && options.webpackArguments.every((argument) => typeof argument === "string")) {
            grunt.util.spawn({
                cmd: "npm",
                args: options.webpackArguments
            }, function (error, result) {
                if (error) {
                    grunt.log.error(error);
                } else {
                    grunt.log.write(result);
                }

                done();
            });
        }
        else{
            done();
        }
    });
};