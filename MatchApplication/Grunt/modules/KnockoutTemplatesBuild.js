/**
 * Module export of the options for the knockout template grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function(grunt){
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            knockoutMainTemplateNameSpace       : 'Oxx',
            knockoutSubTemplateNameSpace        : 'Knockout',
            knockoutTemplateClassName           : 'KnockoutTemplates',
            mainTemplateNameSpaceReplace        : 'mainTemplateNameSpace',
            subTemplateNameSpaceReplace         : 'subTemplateNameSpace',
            templateClassNameReplace            : 'templateName',
            templateContentReplace              : 'templateContent',
            templatesSourceDir                  : 'Templates/**/*.html',
            sourceTemplateFile                  : 'Grunt/files/templates/classTemplate.txt',
            sourceTemplateNoSubNamespaceFile    : 'Grunt/files/templates/classTemplateNoSubNamespace.txt',
            targetTemplatePath                  : 'Scripts/templates',
            templateWrapperClassName            : 'knockout-template-wrapper'
        },

        /**
         * Util object containing the logic for copying the template strings into the template file.
         */

        knockout_template:{
            //Function for processing the template data when copying the template file. Called by the copy task.
            process: function(content){
                var result,
                    template,
                    templates = grunt.config.get('oxx.read.templates'),

                //Not the best place for a method :) Checks for duplicates among the templates.
                    checkForDuplicates = function(templates){
                        var template,
                            nameIndex = {};
                        for(var i = 0, length = templates.length; i < length; ++i){
                            template = templates[i];

                            if(typeof nameIndex[template.property] === "undefined"){
                                nameIndex[template.property] = i;
                            }
                            else{
                                templates.splice(nameIndex[template.property], 1);
                                template.html = '<strong>You are trying to add two template files with the same filename. Name: ' + template.property + '</strong>';

                                return templates;
                            }
                        }

                        return templates;
                    };

                if(Array.isArray(templates)){
                    templates = checkForDuplicates(templates);

                    result = "";

                    for(var i = 0, length = templates.length; i < length; ++i){
                        template = templates[i];

                        result += "\t\t" + template.property + " : '" + template.html + "'";

                        if(i < length - 1){
                            result += ",\r\n";
                        }
                    }
                }

                return result ? content
                    .replace("{" + grunt.config.data.settings.templateContentReplace + "}", result)
                    .replace(new RegExp("{" + grunt.config.data.settings.templateClassNameReplace + "}", "g"), grunt.config.data.settings.knockoutTemplateClassName)
                    .replace(new RegExp("{" + grunt.config.data.settings.subTemplateNameSpaceReplace + "}", "g"), grunt.config.data.settings.knockoutSubTemplateNameSpace)
                    .replace(new RegExp("{" + grunt.config.data.settings.mainTemplateNameSpaceReplace + "}", "g"), grunt.config.data.settings.knockoutMainTemplateNameSpace) :
                    "/*No template data was found in the specified template files.*/";
            }
        },

        /**
         * Copy the template file and run th process function on the content.
         */

        copy:{
            knockout_template:{
                src: '<%= settings.knockoutSubTemplateNameSpace != null ? settings.sourceTemplateFile : settings.sourceTemplateNoSubNamespaceFile %>',
                dest: '<%= settings.targetTemplatePath %>/<%= settings.knockoutTemplateClassName %>.js',
                options: {
                    processContent: '<%= knockout_template.process %>',
                    process: '<%= knockout_template.process %>'
                }
            }
        },

        /**
         * Gets the  HTML strings from the template html files. Modified version of DOM massager.
         */

        get_template: {
            knockout_template: {
                options: {
                    writeDom: false,
                    wrapperClassName: '<%= settings.templateWrapperClassName %>',
                    selectors: {
                        '#template': {
                            action: 'html',
                            output: 'oxx.read.templates'
                        }
                    }
                },
                src:'<%= settings.templatesSourceDir %>'
            }
        },

        /**
         * Checks if there are files that need to be converted. The svg tasks are not run, if not.
         */

        resolve_glob: {
            knockout_template: {
                options: {
                    fileGlobToCheck: '<%= settings.templatesSourceDir %>',
                    tasks: ['get_template:knockout_template', 'copy:knockout_template']
                }
            }
        },

        /**
         * File watch for watching all templates and running the buildTemplates on changes.
         */

        watch: {
            knockout_template: {
                files: ['<%= settings.templatesSourceDir %>'],
                tasks: ['buildKnockoutTemplate'],
                options: {
                    spawn: false
                }
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks for the knockout template grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function(grunt){
    "use strict";

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-resolve-glob/tasks/');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-get-template/tasks');

    grunt.registerTask('buildKnockoutTemplate', ['resolve_glob:knockout_template']);
    grunt.registerTask('startBuildKnockoutTemplatesWatch', ['watch:knockout_template']);
};