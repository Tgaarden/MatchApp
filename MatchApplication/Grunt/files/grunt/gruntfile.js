/**
 * THIS FILE WILL BE OVERWRITTEN ON BUILD SYSTEM UPDATES. DO NOT EDIT!
 * USE THE '_setupDevBuild' TASK TO SET UP YOUR OWN BUILD FILE, AND USE THIS FOR
 * YOUR OWN SETTINGS AND TASKS.
 */

module.exports = function(grunt) {
    'use strict';

    var module,
        configObject = {
            pkg: grunt.file.readJSON('package.json')
        },
        buildModules = [
            './Grunt/modules/KnockoutTemplatesBuild.js',
            './Grunt/modules/JavascriptBuild.js',
            './Grunt/modules/CSSBuild.js',
            './Grunt/modules/ImageBuild.js',
            './Grunt/modules/IconFontsBuild.js',
            './Grunt/modules/SVGTemplateBuild.js',
            './Grunt/modules/nuGetBuild.js',
            './Grunt/modules/ReleaseBuild.js',
            './Grunt/modules/DependencyBuild.js',
            './Grunt/modules/DeveloperSetup.js'
        ],
        devModule = './Scripts/dev-build/DevBuild.js',

        //Your own settings for the build system. More settings exist in each file modules file.
        developerSettings = {
            //CSSBuild
            cssBuildFileUrl                 : 'Content/css/_build.json',
            scssRootFolder                  : 'Content/css/scss',
            cssMinResultFolder              : 'Content/css',
            scssPartialFiles                : [
                {expand: true, cwd: 'Content/css/scss', src: '_constants/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: '_scss.related/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'normalize/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'base/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'generated.partials/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/atoms/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/molecules/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/organisms/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/templates/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'content/pages/**/*.scss'},
                {expand: true, cwd: 'Content/css/scss', src: 'oxx.frontend/**/*.scss'}

            ],
            scssPartialFilePath             : 'Content/css/scss/_partial_imports.scss',
            autoPrefixBrowserCheckArray     : ['> 1%', 'last 2 versions'],

            //ImageBuild
            imageDestFolder                 : 'Images',
            spriteSheetFromCssFilePath      : '../../Images',
            originalSvgFileDestination      : "Images/__original_svg_files/",

            //JavascriptBuild
            jsBuildFileUrl                  : 'Scripts/_build.json',
            javascriptSourceRoot            : 'Scripts',
            javascriptTempFolder            : 'Scripts/temp',
            javascriptDestFolder            : 'Scripts',
            typescriptReferenceRoot         : 'Scripts',

            //Webpack build
            webpackArguments                : ["run" ,"build.production.version"],

            //Auto import script files
            sourceFile                      : null,
            packageId                       : null,
            buildFilesToMergeIntoResult     : [],
            excludeFilesFromAutoBuild       : [], //Array of strings we want to exclude from the auto included files.
            removeFileDuplicates            : true,
            // Using Oxx.Loaders.AssetsLoader. Takes care of Url.Content: '\\.load\\(([^)]+)\\)'
            // Using script tags: '<script.*?src=["|\'](.*?)["|\']'
            // Using Url.Content inside script tags: '<script.*?src="@Url\.Content\(["|']~\/(.*)["|']\)'
            searchRegExps                   : ['\\.load\\(([^)]+)\\)'],
            targetBuildFile                 : 'Scripts/_build.json',

            //KnockoutTemplateBuild
            knockoutMainTemplateNameSpace   : 'Oxx',
            knockoutSubTemplateNameSpace    : 'Knockout',
            knockoutTemplateClassName       : 'KnockoutTemplates',
            templatesSourceDir              : 'Templates/**/*.html',
            templateWrapperClassName        : 'knockout-template-wrapper',

            //SVGTemplateBuild
            svgMainTemplateNameSpace        : 'Oxx',
            svgSubTemplateNameSpace         : 'Svg',
            svgTemplateClassName            : 'SvgTemplates',
            svgToManagerFolder              : '_svg_to_manager',

            //IconFontsBuild
            useHashInFontName               : true,
            svgSize                         : 512,
            fontDecent                      : 0,
            fontFromCssFilePath             : '../../../fonts/IconFont',
            fontDestFolder                  : 'Content/fonts/IconFont',
            wantedFontFormats               : 'eot,woff,ttf,svg',
            wantedFormatOrder               : 'eot,svg,woff,ttf',
            webFontCodeStartPoint           : 0xF101,
            webFontCodePoints               : {
                //'glyphName' : Char value.
            },

            //Multiple
            scssPartialFolder               : 'Content/css/scss/generated.partials',
            imageRootFolder                 : 'Images/_buildSystem',
            convertImagesFolder             : '_convert',
            sourceTemplateFile              : 'Grunt/files/templates/classTemplate.txt',
            targetTemplatePath              : 'Scripts/templates',
            templateNameSpaceReplace        : 'templateNameSpace',
            templateClassNameReplace        : 'templateName',
            templateContentReplace          : 'templateContent',

            //nuGet
            nugetTemplateFile               : 'Grunt/files/templates/NugetTemplate.txt',
            nugetBuildFolder                : 'release/nuget',
            nugetServer                     : 'Http://oxxNugetServer',
            nugetApiKey                     : '6CBB35F8-72EC-47D6-8B81-191C5D0F7AB9',
            includeFilesInNugetPackage      : [
            ],

            //Visual Studio
            buildCommandSourceArguments     : [null, '/t:Clean,Build', '/p:Configuration=Release'], //The first null is replaced with the solutionFilePath value.
            msBuildPath                     : 'C:/Program Files (x86)/Microsoft Visual Studio/2017/Professional/MSBuild/15.0/Bin/MSBuild.exe',
            solutionFilePath                : '', //Add full path to solution file.
            assemblyFilePath                : undefined, //Add full path to AssemblyInfo.cs file.. Accepts both a string, or an array of strings.
            assemblyVersionSearchString     : '\\[assembly: AssemblyVersion+\\(\\"[\\d.]+\\"\\)\\]',
            assemblyVersionReplaceString    : '[assembly: AssemblyVersion("{version}")]',
            assemblyFileVersionSearchString : '\\[assembly: AssemblyFileVersion+\\(\\"[\\d.]+\\"\\)\\]',
            assemblyFileVersionReplaceString: '[assembly: AssemblyFileVersion("{version}")]',

            //Release
            releaseFolder                   : 'release',
            documentationFolder             : "Documentation/project",
            changeLogFileName               : "changelog.txt",
            packageFilePath                 : "package.json",
            componentScssSourceFolder       : 'content/organisms/',
            injectVersionPath               : ["release/Scripts/*.js", "release/Scripts/nonCompiled/ts/Oxx/**/*.*", "release/Content/css/**/*.css"],
            injectVersionDestinationPath    : null,
            injectVersionFlattenDestPath    : false,

            //Dependency
            projectsRootFolder              : 'c:/webstorm/.oxx_components',
            dependencyFilePath              : 'dependencies.json',

            //Devsetup
            tsConfigFilePath                : 'tsconfig.json',
            tsConfigTemplateSource          : 'Grunt/files/templates/tsconfig.json.template',
            tsConfigDefaultProjectFolders   : ['.dependency-cache', 'Content', 'Documentation', 'Grunt', 'Images', 'node_modules', 'release'],
            tsConfigScriptFolders           : ['Scripts/ts', 'Scripts/typings']

        };

    //Load grunt utils file.
    require('./Grunt/utils/GruntUtils.js').extendUnderscore(grunt);

    //Init the modules specified in the buildModules array. These contains all Grunt tasks used by the system.
    for(var i = 0, length = buildModules.length; i < length; ++i){
        initModule(buildModules[i]);
    }

    configObject.developerSettings = developerSettings;
    grunt.util._.deepExtend(configObject.settings, developerSettings);
    initModule(devModule);
    grunt.initConfig(configObject);

    /**************************************************************************************/
    /*UTIL FUNCTIONS **********************************************************************/
    /**************************************************************************************/

    /**
     * Method for initializing a module, and add both settings, and tasks in the file to Grunt.
     * @param {string}  modulePath
     */

    function initModule(modulePath){
        if(grunt.file.isFile(modulePath)){
            module = require(modulePath);
            grunt.util._.deepExtend(configObject, module.options(grunt));
            module.initPackage(grunt);
        }
    }
};