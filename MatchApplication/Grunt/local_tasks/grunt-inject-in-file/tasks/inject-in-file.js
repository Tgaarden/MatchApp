module.exports = function(grunt) {
    'use strict';

    /**
     * Task for injecting a string, or the content of a file into a loaded template, and then save the resulting file
     * to disk.
     */

    grunt.registerMultiTask("inject_in_file", "Inject content from a file, or a string into another file.", function () {
        var fileObject,
            sources,
            done = this.async(),
            options = this.options();

        if(Array.isArray(options.files)){
            for(var i = 0, iLength = options.files.length; i < iLength; ++i){
                fileObject = options.files[i];
                //Change a grunt glob, to an array of filenames.
                sources = grunt.file.expand(fileObject.source);

                if(Array.isArray(sources) && sources.length > 0){
                    for(var j = 0, jLength = sources.length; j < jLength; ++j) {
                        //For each source file, run a inject replace on file, and save it to the destination folder.
                        _injectIntoFile(sources[j], fileObject.destinationFolder, fileObject.replace, fileObject.flatten);
                    }
                }
                else{
                    grunt.log.ok("No files found in the specified glob."['yellow']);
                }
            }
        }

        return done();
  });

    /**
     * Method for injecting the elements defined in the replace array in the source file, and saving it
     * to the destination. The flatten property removes any path from the source before copying the file to the destination.
     * @param {string}          source
     * @param {string}          destinationFolder
     * @param {boolean}         flatten
     * @param {Array<object>}   replace
     * @private
     */

    function _injectIntoFile(source, destinationFolder, replace, flatten){
        var searchTerm,
            replaceWith,
            replaceObject,
            originalFile,
            destination,
            isFile = false,
            sourceFile = grunt.file.read(source);

        source = flatten ? _flattenFilePath(source) : source;
        destination = typeof destinationFolder === "string" && destinationFolder.length > 0 ? destinationFolder.replace(/\/$/, "") + "/" + source : source;
        originalFile = sourceFile;

        if(sourceFile && Array.isArray(replace)){
            for(var i = 0, length = replace.length; i < length; ++i){
                //Get object with the from and to properties, create regexp search term, check if the replace value is a string, or file, and if it is a file, load it.
                replaceObject = replace[i];
                searchTerm = new RegExp(replaceObject.from, "gi");
                isFile = grunt.file.isFile(replaceObject.to);
                replaceWith =  isFile ? grunt.file.read(replaceObject.to) : replaceObject.to;

                if(typeof replaceObject.toFormatFunction === "function"){
                    replaceWith = replaceObject.toFormatFunction(replaceWith);
                }

                grunt.log.ok("Injecting content into " + source['yellow'] + " --> Replacing " + replaceObject.from['yellow'] + " with " + (isFile ? "the content from the file " : "") + replaceObject.to['yellow']);
                sourceFile = sourceFile.replace(searchTerm, replaceWith);
            }

            if(sourceFile !== originalFile){
                //Delete the file, if it already exists in the destination folder.
                if(grunt.file.isFile(destination)){
                    grunt.file.delete(destination);
                }

                //Write to the destination.
                grunt.file.write(destination, sourceFile);
            }
            else{
                grunt.log.ok("No changes to file " + source['yellow'] + ", file not saved.");
            }
        }
    }

    /**
     * Method for flattening a file path.
     * @param {string}  path
     * @returns {string}
     * @private
     */

    function _flattenFilePath(path){
        return path.lastIndexOf("/") > -1 ? path.substring(path.lastIndexOf("/") + 1) : path;
    }
};