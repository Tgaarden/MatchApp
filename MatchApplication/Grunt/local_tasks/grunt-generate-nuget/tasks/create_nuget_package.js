module.exports = function(grunt) {
    'use strict';

    /**
     * Task for creating a nuget package from a set of project files.
     *
     * Available options for the task, with default values:
     *
     * fileNameProperty        : "nuGetFileName"                        - Field name used to set the nuget file name in the grunt config, used by the the upload-nuget task.
     * nuSpecDestinationFolder : "release"                              - Folder where the nuSpecc file is saved.
     * tempNuspecFile          : "nugetBuildFile.nuspec"                - Filename of the nuspec file.
     * nuGetTemplateFile       : "Grunt/templates/NugetTemplate.txt"    - Template file for the nuget xml config.
     * replaceValues           :                                        - Values to replace in the template, with actual values from the package.json file.
     *      {propertyName: "id", value: grunt.config.data.pkg.name}
     *      {propertyName: "version", value: grunt.config.data.pkg.version}
     *      {propertyName: "title", value: grunt.config.data.pkg.name}
     *      {propertyName: "author", value: grunt.config.data.pkg.author}
     *      {propertyName: "description", value: grunt.config.data.pkg.description}
     *      {propertyName: "releaseNotes", value: grunt.config.data.pkg.releaseNotes[grunt.config.data.pkg.releaseNotes.length -1]}
     *      {propertyName: "summary", value: grunt.config.data.pkg.summary}
     *      {propertyName: "copyright", value: grunt.config.data.pkg.license}
     *      {propertyName: "tags", value: grunt.config.data.pkg.keywords}
     */

    grunt.registerMultiTask("create_nuget", "Create a nuget package", function () {
        var template, regExp, i, length, nugetPackageFileName,
            fileNode,
            fileNodes = "",
            done = this.async(),
            options = this.options({
                fileNameProperty        : "nuGetFileName",
                nuSpecDestinationFolder : "release",
                tempNuspecFile          : "nugetBuildFile.nuspec",
                nuGetTemplateFile       : "Grunt/templates/NugetTemplate.txt",
                replaceValues           : [
                    {propertyName: "id", value: grunt.config.data.pkg.name},
                    {propertyName: "version", value: grunt.config.data.pkg.version},
                    {propertyName: "title", value: grunt.config.data.pkg.name},
                    {propertyName: "author", value: grunt.config.data.pkg.author},
                    {propertyName: "description", value: grunt.config.data.pkg.description},
                    {propertyName: "releaseNotes", value: grunt.config.data.pkg.releaseNotes[grunt.config.data.pkg.releaseNotes.length -1]},
                    {propertyName: "summary", value: grunt.config.data.pkg.summary},
                    {propertyName: "copyright", value: grunt.config.data.pkg.license},
                    {propertyName: "tags", value: grunt.config.data.pkg.keywords},
                    {propertyName: "dependencies", value: _createNugetDependencies()}
                ]
            });

        //add a slash to the destination folder, if this is missing from the option value.
        options.nuSpecDestinationFolder += (options.nuSpecDestinationFolder.search(/\/$/) === -1 ? "/" : "");
        //Load nuspec template file.
        template = grunt.file.read(options.nuGetTemplateFile);

        //Replace values in the nuspec template file with values from the options object.
        for(i = 0, length = options.replaceValues.length; i < length; ++i){
            regExp = new RegExp("\\{" + options.replaceValues[i].propertyName + "\\}", "g");
            template = template.replace(regExp, options.replaceValues[i].value);
        }

        this.files.forEach(function(fileObject){
            fileNode = '\t\t<file src="' + fileObject.src[0] + '"'; //Add source
            fileNode += ' target="' + fileObject.dest + '"'; //Add target
            fileNode += '/>' + '\n';
            fileNodes += fileNode;
        });

        //Remove the last return char in the files string.
        fileNodes = fileNodes.replace(/[\n]$/, "");

        //Add file nodes to the template.
        template = template.replace('{files}', fileNodes);

        //Save the template file to disk.
        grunt.file.write(options.tempNuspecFile, template);

        grunt.util.spawn({
            cmd: "nuget.exe",
            args: [
                "pack",
                options.tempNuspecFile
            ]
        }, function (error, result) {
            if (error) {
                grunt.log.error("nuget.exe pack failed : " + error);
            } else {
                grunt.log.write(result);

                grunt.file.delete(options.tempNuspecFile);
                //This is a massive hack parsing the return value from the nuget task to find the filename. This is
                //the place to look, if the nuget routing suddenly fails on a nuget update.
                nugetPackageFileName = result.toString().split("Successfully created package")[1].split("'")[1];
                nugetPackageFileName = nugetPackageFileName.substring(nugetPackageFileName.lastIndexOf("\\") + 1);

                if(typeof nugetPackageFileName === "string"){
                    grunt.config.set(options.fileNameProperty, nugetPackageFileName);
                    grunt.file.copy(nugetPackageFileName, options.nuSpecDestinationFolder + nugetPackageFileName);
                    grunt.file.delete(nugetPackageFileName);
                }
            }

            done();
        });
    });

    /**
     * Function creating the nuget dependencies part of the nuspec file.
     *
     * @private
     */

    function _createNugetDependencies(){
        var i, length,
            version,
            dependency,
            dependencyArray,
            dependencyNode,
            dependencyNodes = "",
            jsonFile,
            settings = grunt.config.get("settings");

        if(grunt.file.isFile(settings.dependencyFilePath)){
            jsonFile = grunt.file.readJSON(settings.dependencyFilePath);

            if(jsonFile){
                dependencyArray = jsonFile[settings.dependencyField];

                if(Array.isArray(dependencyArray)){
                    for(i = 0, length = dependencyArray.length; i < length; ++i){
                        dependency = dependencyArray[i];

                        if(typeof dependency[settings.isInternalDependencyField] === "boolean" && dependency[settings.isInternalDependencyField] === true){
                            continue;
                        }

                        var rootFolder = typeof dependency[settings.packageRootDirField] === "string" ? _formatUrl(dependency[settings.packageRootDirField]) : _formatUrl(settings.projectsRootFolder);

                        version = dependency[settings.minDependencyVersionField] || grunt.file.readJSON(rootFolder + dependency[settings.projectUrlField] + "/" + settings.packageFilePath).version;

                        dependencyNode = '\t\t\t\t<dependency id="' + dependency[settings.packageIdField] + '"'; //Add package id
                        dependencyNode += ' version="' + version + '"'; //Add minimum version
                        dependencyNode += '/>' + '\n';
                        dependencyNodes += dependencyNode;
                    }

                    dependencyNodes = dependencyNodes.replace(/[\n]$/, "") || "";
                }

                dependencyArray = jsonFile[settings.nugetDependencyField];

                if(Array.isArray(dependencyArray)){
                    for(i = 0, length = dependencyArray.length; i < length; ++i){
                        dependency = dependencyArray[i];
                        dependencyNode = '\t\t\t\t<dependency id="' + dependency[settings.packageIdField] + '"';
                        dependencyNode += ' version="' + dependency["version"] + '"';
                        dependencyNode += '/>' + '\n';
                        dependencyNodes += dependencyNode;
                    }
                }
            }
        }

        return dependencyNodes;
    }

    /**
     * Method for formatting an url. Making sure the last char of the url is a '/'.
     * @param target
     * @returns {string}
     * @private
     */

    function _formatUrl(target) {
        target += (target.lastIndexOf("/") !== target.length -1 ? "/" : "");

        return target;
    }
};