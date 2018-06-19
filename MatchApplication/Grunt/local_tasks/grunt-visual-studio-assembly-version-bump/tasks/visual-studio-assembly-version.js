module.exports = function(grunt) {
    'use strict';

    /**
     * Task for setting the version strings in the AssemblyInfo.cs file of a VS project.
     */

    grunt.registerTask("visual_studio_assembly_version", "Set the version in the assemblyInfo.cs file of a VS project", function () {
        var packageObject = grunt.config.get("pkg"),
            version = packageObject.version,
            options = this.options({
                assemblyFilePath                : null,
                assemblyVersionSearchString     : '\\[assembly: AssemblyVersion+\\(\\"[\\d.]+\\"\\)\\]',
                assemblyVersionReplaceString    : '[assembly: AssemblyVersion("{version}")]',
                assemblyFileVersionSearchString : '\\[assembly: AssemblyFileVersion+\\(\\"[\\d.]+\\"\\)\\]',
                assemblyFileVersionReplaceString: '[assembly: AssemblyFileVersion("{version}")]'
            });

        version = _makeFullAssemblyVersion(version);

        if(typeof options.assemblyFilePath === "string") {
            _replaceVersionInAssemblyFile(options.assemblyFilePath, version, options);
        }
        else if(Array.isArray(options.assemblyFilePath)) {
            options.assemblyFilePath.forEach(function(filePath) {
                _replaceVersionInAssemblyFile(filePath, version, options);
            });
        }
    });

    /**
     * Method for setting version in an AssemblyInfo file.
     * @param fileName
     * @param version
     * @param options
     * @private
     */

    function _replaceVersionInAssemblyFile(fileName, version, options) {
        var assemblyFile = grunt.file.read(fileName),
            assemblyFileVersionRegExp = new RegExp(options.assemblyFileVersionSearchString),
            assemblyVersionRegExp = new RegExp(options.assemblyVersionSearchString);

        assemblyFile = assemblyFile.replace(assemblyVersionRegExp, options.assemblyVersionReplaceString.replace("{version}", version));
        assemblyFile = assemblyFile.replace(assemblyFileVersionRegExp, options.assemblyFileVersionReplaceString.replace("{version}", version));

        grunt.log.ok("Replaced assembly versions in assemblyFile " + fileName);
        grunt.file.write(fileName, assemblyFile);
        grunt.log.ok("Assembly file written to disk " + fileName);

    }

    /**
     * Method for making sure that the version number set i the assembly file has 4 digits.
     * @param version
     * @returns {string}
     * @private
     */

    function _makeFullAssemblyVersion(version) {
        var versionSplitted = version.split(".");

        if(versionSplitted.length < 4) {
            versionSplitted.push("0");
        }

        return versionSplitted.join(".");
    }
};