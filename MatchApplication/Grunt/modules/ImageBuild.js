/**
 * Module export of the options for the Image build grunt job.
 * @param {Object}  grunt - The grunt object.
 */

module.exports.options = function (grunt) {
    "use strict";

    return{
        /**
         * Settings for the grunt job. Change settings here, not in the script below!
         */

        settings: {
            imageRootFolder             : 'Images/_buildSystem',
            imageDestFolder             : 'Images',
            spriteSheetFromCssFilePath  : '../../Images',
            dataUriPrefix               : 'uri-',
            spriteSheetPrefix           : 'sprite-',
            convertImagesFolder         : '_convert',
            dataUriFolder               : '_css_embed',
            spriteSheetFolder           : '_png_to_spritesheet',
            png32ToPng8Folder           : '_png32_to_png8',
            spriteSheetFileName         : 'spriteSheet',
            scssPartialFolder           : 'Content/css/scss/generated.partials',
            scssDataUriFileName         : '_dataUriVariables',
            scssSpriteSheetFileName     : '_spriteSheetVariables',
            ie8PngFolder                : 'ie8png'
        },

        /**
         * Settings for creating the data url version of images found in the dataUriFolder folder.
         */

        datauri: {
            image_convert: {
                options: {
                    varPrefix: '<%= settings.dataUriPrefix %>',
                    varSuffix: ''
                },
                src: [
                    '<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.dataUriFolder %>/**/*.*',
                    '!<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.dataUriFolder %>/**/*.txt'
                ],
                dest: '<%= settings.scssPartialFolder %>/<%= settings.scssDataUriFileName %>.scss'
            }
        },


        /**
         * Settings for plugin converting a set of images to a sprite sheet.
         */

        sprite: {
            image_convert: {
                algorithm: 'binary-tree',
                padding: 2,
                engine: 'pngsmith',
                cssFormat: 'scss',
                cssVarMap: function (sprite) {
                    if(typeof grunt.config.data.settings.spriteSheetFromCssFilePath === "string" && grunt.config.data.settings.spriteSheetFromCssFilePath.length > 0){
                        sprite.image = grunt.config.data.settings.spriteSheetFromCssFilePath + '/' + grunt.config.data.settings.spriteSheetFileName + '.png';
                    }

                    sprite.name = grunt.config.data.settings.spriteSheetPrefix + sprite.name;
                },
                src: '<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.spriteSheetFolder %>/**/*.png',
                destCSS: '<%= settings.scssPartialFolder %>/<%= settings.scssSpriteSheetFileName %>.scss',
                destImg: '<%= settings.imageDestFolder %>/<%= settings.spriteSheetFileName %>.png'
            }
        },

        svgmin: {
            image_minification: {
                options: {
                    plugins: [
                        {removeViewBox: false},
                        {removeUselessStrokeAndFill: true}
                    ]
                },
                files: [
                    {
                        expand: true,
                        src: [
                        '<%= settings.imageRootFolder %>/**/*.svg',
                        '!<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/**/*.*'
                        ],
                        flatten: true,
                        dest: '<%= settings.imageDestFolder %>',
                        ext: '.svg'
                    }
                ]
            }
        },

        /**
         * Settings for imagemin. Will minify jpg, png and gif files.
         */

        imagemin: {
            image_minification: {
                options: {
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true,
                    cache: false
                },
                files: [
                    {
                        expand: true,
                        src:[
                            '<%= settings.imageRootFolder %>/**/*.png',
                            '!<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/**/*.*'
                        ],
                        flatten: true,
                        dest: '<%= settings.imageDestFolder %>', ext: '.png'
                    },
                    {
                        expand: true,
                        src: '<%= settings.imageRootFolder %>/**/*.jpg',
                        flatten: true,
                        dest: '<%= settings.imageDestFolder %>',
                        ext: '.jpg'
                    },
                    {
                        expand: true,
                        src: '<%= settings.imageRootFolder %>/**/*.gif',
                        flatten: true,
                        dest: '<%= settings.imageDestFolder %>',
                        ext: '.gif'
                    }
                ]
            }
        },

        /**
         * Settings for pngmin, for converting a png from png32, to png8.
         */

        pngmin: {
            image_minification: {
                options: {
                    speed: 3,
                    colors: 256,
                    ext: '.png',
                    force: true
                },
                files: [
                    {
                        src: '<%= settings.imageRootFolder %>/<%= settings.convertImagesFolder %>/<%= settings.png32ToPng8Folder %>/**/*.png',
                        dest: '<%= settings.imageDestFolder %>'
                    }
                ]
            }
        },

        /**
         * File watch for watching the image root folder for changes..
         */

        watch: {
            image_convert: {
                files: ['<%= settings.imageRootFolder %>/**/*.{png, jpg, gif, svg}'],
                tasks: ['convertImages'],
                options: {
                    spawn: false
                }
            },
            image_minification: {
                files: ['<%= settings.imageRootFolder %>/**/*.{png, jpg, gif, svg}'],
                tasks: ['minifyImages'],
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

    grunt.task.loadTasks('Grunt/local_tasks/grunt-resolve-glob/tasks/');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-pngmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-datauri-variables');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-spritesmith');

    grunt.registerTask('convertImages', [
        'resolve_glob:datauri:image_convert',
        'resolve_glob:sprite:image_convert'
    ]);

    grunt.registerTask('minifyImages', [
        'newer:svgmin:image_minification',
        'newer:imagemin:image_minification',
        'pngmin:image_minification'
    ]);

    grunt.registerTask('startMinifyImagesWatch', ['watch:image_minification']);
    grunt.registerTask('startConvertImagesWatch', ['watch:image_convert']);
};