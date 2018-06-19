module.exports = function(grunt) {
    'use strict';

    /**
     * Task for updating the package.json, and gruntfile.js files on build system update.
     * Runs a check on changes in the files, and updates the devDependencies in the package.json file,
     * and replaces thew gruntfile.js with a new file, if they do not match.
     */

    grunt.registerTask("patch_grunt_files", "Updates grunt files on build system update.", function () {
        let target,
            source,
            isChanged = false,
            options = this.options({
                targetFilePath      : "",
                sourceFilePath      : "Grunt/files/grunt/"
            });

        source = grunt.file.readJSON(options.sourceFilePath + "package.json");
        target = grunt.file.readJSON(options.targetFilePath + "package.json");

        //Check if there are changes in the devDependencies part of the package.json file. Updates on changes.
        if(source && target) {
            if(target.devDependencies) {
                let targetKeys = Object.keys(target.devDependencies);

                targetKeys.forEach((key) => {
                    if(target.devDependencies[key] !== source.devDependencies[key]) {
                        if(source.devDependencies[key] != null) {
                            isChanged = true;
                            console.log("updating dependency", key, "from", target.devDependencies[key], "to", source.devDependencies[key]);
                            target.devDependencies[key] = source.devDependencies[key];
                        }
                    }
                });
            }

            let sourceKeys = Object.keys(source.devDependencies);

            sourceKeys.forEach((key) => {
                if(target.devDependencies[key] == null) {
                    isChanged = true;
                    console.log("Adding new dependency", key, source.devDependencies[key]);
                    target.devDependencies[key] = source.devDependencies[key];
                }
            });

            if(isChanged) {
                grunt.file.write(options.targetFilePath + "package.json", JSON.stringify(target, null, "\t"));
                grunt.log.ok('Updated package.json file.'['yellow']);
            }
        }
    });
};