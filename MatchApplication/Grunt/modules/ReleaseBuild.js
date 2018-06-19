/**
 * Module export of the options for the grunt task.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            injectVersionPath           : [],
            injectVersionDestinationPath: "",
            injectVersionFlattenDestPath: false,
            releaseFolder               : 'release',
            documentationFolder         : "Documentation/project",
            componentScssSourceFolder   : 'content/organisms/',
            changeLogFileName           : "changelog.txt",
            packageFilePath             : "package.json",
            releaseNoteMessage          : "Skriv inn en kort release note for denne versjonen:",
            bumpVersionMessage          : "Hva slags endring av versjon ønskes:",
            webpackArguments            : ["run" ,"build.production.version"]
        },

        /**
         * Copy files from the project to the build folder.
         */

        copy: {
            component_scss_files:{
                files: [
                    {
                        expand: true,
                        cwd: '<%= settings.scssRootFolder %>/<%= settings.componentScssSourceFolder %>/',
                        src: ['**/*.scss', '!**/_all.scss'],
                        dest: '<%= settings.releaseFolder %>/<%= settings.componentScssSourceFolder %>/'
                    }
                ]
            },
            build_release: {
                files: [
                    {expand: true, src: ['Images/*.*'], flatten: true, dest: '<%= settings.releaseFolder %>/Images/'},
                    {expand: true, cwd: 'Scripts/', src: ['**', '!*.js', '!templates/**'], dest: '<%= settings.releaseFolder %>/Scripts/nonCompiled/'},
                    {expand: true, src: 'Scripts/*.js', dest: '<%= settings.releaseFolder %>/'},
                    {expand: true, src: 'Scripts/templates/**', dest: '<%= settings.releaseFolder %>/'},
                    {expand: true, cwd: 'Content/', src: ['css/scss/**/', '!css/*.css'], dest: '<%= settings.releaseFolder %>/Content/css/nonCompiled/'},
                    {expand: true, cwd: 'Content/', src: ['css/*.css', 'css/*.scss'], flatten: true, dest: '<%= settings.releaseFolder %>/Content/css/'},
                    {expand: true, cwd: 'Content/', src: ['fonts/**'], dest: '<%= settings.releaseFolder %>/Content/'},
                    {expand: true, cwd: 'Documentation/', src: ['*.*'], flatten: true, dest: '<%= settings.releaseFolder %>/Documentation/'}
                ]
            }
        },

        /**
         * Setting up task for adding a version comment to the top of a concatenated and minified set of files.
         */

        usebanner: {
            component_scss_files:{
                options: {
                    position: 'top',
                    banner: '/* VERSION <%= pkg.version %>*/',
                    linebreak: true
                },
                files: {
                    src: [ '<%= settings.releaseFolder %>/<%= settings.componentScssSourceFolder %>/**/*.scss' ]
                }
            }
        },

        /**
         * Settings for the Version bump task.
         */

        version_bump: {
            options: {
                documentationFolder     : '<%= settings.documentationFolder %>',
                changeLogFileName       : '<%= settings.changeLogFileName %>',
                packageFilePath         : '<%= settings.packageFilePath %>'
            }
        },

        /**
         * Settings for the visual studio assembly info versioning task.
         */

        visual_studio_assembly_version: {
            options: {
                assemblyFilePath                : '<%= settings.assemblyFilePath %>',
                assemblyVersionSearchString     : '<%= settings.assemblyVersionSearchString %>',
                assemblyVersionReplaceString    : '<%= settings.assemblyVersionReplaceString %>',
                assemblyFileVersionSearchString : '<%= settings.assemblyFileVersionSearchString %>',
                assemblyFileVersionReplaceString: '<%= settings.assemblyFileVersionReplaceString %>'
            }    
        },

        /**
         * Settings for the visual studio build task.
         */
        
        visual_studio_build: {
            options: {
                buildCommandSourceArguments     : '<%= settings.buildCommandSourceArguments %>',
                msBuildPath                     : '<%= settings.msBuildPath %>',
                solutionFilePath                : '<%= settings.solutionFilePath %>'
            }
        },

        /**
         * Settings for the inject in file task, for injecting the version of a library into the code.
         */

        inject_in_file: {
            build_release_note:{
                options: {
                    files: [{
                        flatten: "<%= settings.injectVersionFlattenDestPath %>",
                        source: "<%= settings.injectVersionPath %>",
                        destinationFolder: "<%= settings.injectVersionDestinationPath %>",
                        replace: [
                            {
                                from: "{version}",
                                to: "<%= pkg.version %>"
                            }
                        ]
                    }]
                }
            }
        },

        /**
         * Settings for the prompt task. Used for asking for the release notes for the release version bump.
         */

        prompt: {
            build_release_note: {
                options: {
                    questions:[{
                        config          : 'version_bump.options.releaseNote',
                        type            : 'input',
                        message         : '<%= settings.releaseNoteMessage %>'.yellow
                    }]
                }
            },
            build_version_bump: {
                options: {
                    questions:[{
                        config          : 'version_bump.options.bumpType',
                        type            : 'list',
                        message         : '<%= settings.bumpVersionMessage %>'.yellow,
                        default         : 'build',
                        choices         : [
                            {name: "Major".yellow, value: "major"},
                            {name: "Minor".yellow, value: "minor"},
                            {name: "Build".yellow, value: "build"}
                        ]
                    }]
                }
            }

        },

        /**
         * Clean up after the release process.
         */

        clean: {
            pre_build: ['release/'],
            build_release: ['Scripts/*.min.js', 'Content/css/*.css', 'Content/css/*.scss']
        },

        run_webpack: {
            build_release: {
                webpackArguments: '<%= settings.webpackArguments %>'
            }
        }
    };
};

/**
 * Module export of the init function needed for setting up tasks.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.initPackage = function (grunt) {
    "use strict";

    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-version-bump/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-inject-in-file/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-visual-studio-assembly-version-bump/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-visual-studio-build/tasks');
    grunt.task.loadTasks('Grunt/local_tasks/grunt-run-webpack/tasks');

    grunt.registerTask('buildWebpackProdCode', ['run_webpack:build_release']);
    grunt.registerTask('copyComponentScssFiles', ['copy:component_scss_files', 'usebanner:component_scss_files']);
    grunt.registerTask('injectVersionInReleaseSource', ['inject_in_file:build_release_note']);
    grunt.registerTask('updateAssemblyInfoVersion', ['visual_studio_assembly_version']);
    grunt.registerTask('buildVisualStudioSolution', ['visual_studio_build']);
    grunt.registerTask('releaseBump', ['prompt:build_release_note', 'prompt:build_version_bump', 'version_bump:build']);
    grunt.registerTask('buildRelease', ['releaseBump', 'buildReleaseNoVersionBump']);
    grunt.registerTask('buildReleaseNoVersionBump',
        [
            'clean:pre_build',
            'copyDependencies',
            'buildJSProd',
            //'buildSCSS',
            //'buildSCSSDebug',
            'convertImages',
            'minifyImages',
            'buildIconFont',
            'buildKnockoutTemplate',
            'buildSVGTemplate',
            'copy:build_release',
            'injectVersionInReleaseSource',
            'createDependencyCache',
            'clean:build_release',
            'buildNuget'
        ]);
};