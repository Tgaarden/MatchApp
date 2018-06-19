module.exports = function(grunt) {
    'use strict';

    /**
     * Task for bumping the version string in the package.json file.
     * Can be used with a parameter value for the type of bump we want, or by setting the bumpType property in the options object.
     *
     * Available options for the task, with default values:
     *
     * bumpType                 : null              - The type of bump ve want. [build, minor, major]
     * documentationFolder     : 'Documentation'    - The documentation folder path.
     * changeLogFileName       : 'changelog.txt'    - The changelog file name
     * packageFilePath         : 'package.json'     - The package.json file path.
     */

    grunt.registerTask("version_bump", "Bump the version in the package.json file", function () {
        var version,
            index,
            releaseString,
            date = new Date(),
            packageObject = grunt.config.get("pkg"),
            updateValue = arguments[0],
            options = this.options({
                promptChoiceLocation    : "",
                documentationFolder     : "Documentation",
                changeLogFileName       : "changelog.txt",
                releaseNote             : "No release note.",
                bumpType                : null,
                packageFilePath         : "package.json"
            });

        //If bumpType exists in the options object, use this value.
        updateValue = typeof options.bumpType === "string" ? options.bumpType : updateValue;

        //Read the package json file.
        if(!packageObject){
            packageObject = grunt.file.readJSON(options.packageFilePath);
        }

        //Create a version array from the version string
        version = packageObject.version.split(".");

        index = (updateValue === "minor") ? 1 : updateValue === "major" ? 0 : 2;
        version[index] = (parseInt(version[index], 10) + 1).toString();

        for(var i = index + 1; i < version.length; ++i){
            version[i] = "0";
        }

        //Create a release string used in the change log.
        releaseString = "v" + version.join(".") + " - " + [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(".") + " : " + (options.releaseNote.length > 0 ? options.releaseNote : "No release note");

        //Add the release note string to the releaseNotes array in the package file.
        if(packageObject.releaseNotes){
            packageObject.releaseNotes.push(releaseString);
            options.documentationFolder += options.documentationFolder.search(/\/$/) === -1 ? "/" : "";
            grunt.file.write(options.documentationFolder + options.changeLogFileName, packageObject.releaseNotes.join('\n'));
        }

        packageObject.version =  version.join(".");

        //Update the package values in the config pkg object, and write the new packetObject to the package.json file.
        grunt.config.set("pkg", packageObject);
        grunt.file.write(options.packageFilePath, JSON.stringify(packageObject, null, "\t"));
    });
};