/**
 * Module export of the options for the svg template grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            svgMainTemplateNameSpace    : 'Oxx',
            svgSubTemplateNameSpace     : 'Svg',
            svgTemplateClassName        : 'SvgTemplates',
            mainTemplateNameSpaceReplace: 'mainTemplateNameSpace',
            subTemplateNameSpaceReplace : 'subTemplateNameSpace',
            templateClassNameReplace    : 'templateName',
            templateContentReplace      : 'templateContent',
            imageRootFolder             : 'Images/_buildSystem',
            convertImagesFolder         : '_convert',
            svgToManagerFolder          : '_svg_to_manager',
            originalSvgFileDestination  : "Images/__original_svg_files/",
            sourceTemplateFile          : 'Grunt/files/templates/classTemplate.txt',
            targetTemplatePath          : 'Scripts/templates'
        },

        /**
         * Util object containing the logic for copying the template strings into the template file.
         */

        svg_template:{
            process: function(content){
                var result,
                    svgFile,
                    svgFiles = grunt.config.get('oxx.read.svg');


                if(Array.isArray(svgFiles)){
                    result = "";

                    for(var i = 0, length = svgFiles.length; i < length; ++i){
                        svgFile = svgFiles[i];

                        result += "\t\t" + svgFile.property + " : '" + svgFile.svg + "'";

                        if(i < length - 1){
                            result += ",\r\n";
                        }
                    }
                }

                return result ? content
                        .replace("{" + grunt.config.data.settings.templateContentReplace + "}", result)
                        .replace(new RegExp("{" + grunt.config.data.settings.templateClassNameReplace + "}", "g"), grunt.config.data.settings.svgTemplateClassName)
                        .replace(new RegExp("{" + grunt.config.data.settings.subTemplateNameSpaceReplace + "}", "g"), grunt.config.data.settings.svgSubTemplateNameSpace)
                        .replace(new RegExp("{" + grunt.config.data.settings.mainTemplateNameSpaceReplace + "}", "g"), grunt.config.data.settings.svgMainTemplateNameSpace) :
                    "/*No template data was found in the specified template files.*/";
            }
        },

        /**
         * Copy the template file and run the process function on the content.
         */

        copy:{
            svg_template:{
                src: '<%= settings.sourceTemplateFile %>',
                dest: '<%= settings.targetTemplatePath %>/<%= settings.svgTemplateClassName %>.js',
                options: {
                    processContent: '<%= svg_template.process %>',
                    process: '<%= svg_template.process %>'
                }
            }
        },

        /**
         * Gets the  HTML strings from the template html files. Modified version of DOM massager.
         */

        get_svg_file_content: {
            svg_template: {
                options: {
                    output: 'oxx.read.svg'
                },
                src:'<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.svgToManagerFolder %>/**/*.svg'
            }
        },

        /**
         * Checks if there are files that need to be converted. The svg tasks are not run, if not.
         */

        resolve_glob: {
            svg_template: {
                options: {
                    fileGlobToCheck: '<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.svgToManagerFolder %>/**/*.svg',
                    tasks: ['get_svg_file_content:svg_template', 'copy:svg_template']
                }
            }
        },

        /**
         * File watch for watching all svg files.
         */

        watch: {
            svg_template: {
                files: ['<%= get_svg_file_content.svg_template.src %>'],
                tasks: ['buildSVGTemplate'],
                options: {
                    spawn: false
                }
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks for the grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-resolve-glob/tasks/');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-get-svg/tasks');

    grunt.registerTask('buildSVGTemplate', ['resolve_glob:svg_template']);
    grunt.registerTask('startBuildSVGTemplateWatch', ['watch:svg_template']);
};