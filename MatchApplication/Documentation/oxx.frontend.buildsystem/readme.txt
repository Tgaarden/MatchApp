Copyright (C) 2016 Oxx
You may freely use, modify and/or distribute this file.

=======================================================================================
HVA ER KOMPONENTET
=======================================================================================

Dette er frontend build systemet til Oxx. Det er bygd på node.js, og Grunt task runner.

Det er en enkel løsning for å generere opp produksjonsklare Javascript og Css filer, samt
håndtering av bilder, svg-filer, typescript, og en hel del annen funksjonalitet.

=======================================================================================
KOMPABILITET
=======================================================================================

Build systemet er avhengig av på eksistere i et prosjekt med en bestemt filstruktur.
Denne filstrukturen installerer du ved å sette opp DefaultFrontendProject først. Denne pakken
har en dependency til build systemet, så da vil også dette bli installert.

Versjon 2.x.x av build systemet er ikke kompatibelt med med 1.x.x. versjonene.
De største endringene er gjort i selve build løsningen for JS of CSS. Systemet er også
blitt gjort betydelig mer robust, samt at det har blitt lagt til en dependecy control del, som
primært er noe som brukes ved utvikling av Oxx.Frontend komponenter.

Versjon 3.x.x skal ikke være et problem å bruke i en løsning som bruker en 2.x.x løsning, men
i den første oppdateringen må noen småting gjøres manuelt. Spør hvis du skal oppgradere en løsning,
så skal jeg hjelpe deg.

Oppdatering til versjon 4.x.x.
    IKKE OPPDATER OM DU ER AVHENGIG AV COMPASS!

    I versjon 4 har scss generering blitt fikset. Nå funker bl.a. debug generering av scss.
    Jeg har også byttet ut den vanlige scss løsningen med LibSass, så du er nå IKKE avhengig av
    Ruby lengre, for å kjøre scss. LibSass er ikke kompatibel med Compass, så hvis du trenger
    dette må du kjøre en 3.x.x versjon av build systemet.

    Det er også en ny løsning for import av alle partial filer. I devsetup filen finner du et array
    av Grunt filobjekter som laster inn scss filer i rekkefølgen de er satt opp. Du kan enkelt
    her styre filer som skal være, eller ikke være med, samt rekkefølge osv.

    HVIS DU KJØRER EN ENKELT FOLDER MED NODE_MODULES MÅ DENNE OPPDATERES:
    Du er nødt til å ta project.json filen som blir installert med denne utgaven av build systemet,
    kopiere den inn i folderen hvor nodes_modules er, og kjøre en 'npm install' i denne folderen.
    Dette vil installere de grunt taskene du ev. mangler i den globale nodes folderen din.

Oppdatering til versjon 4.1.x
    Siden folder med navn build er filtrert ut av git ignore filen har jeg byttet navn på denne folderen
    under Scripts til dev-build. Hvis du setter opp build systemet for første gang i et prosjekt
    vil alt funke som forventet, men hvis du oppdaterer et gammelt prosjekt med den nye versjonen
    må du endre foldernavnet fra 'build' til 'dev-build' for at dine egne tasks skal dukke opp
    i Grunt taskrunner.

=======================================================================================
HVORDAN LASTE NED OG INSTALLERE DET SOM TRENGS FOR Å KJØRE BUILD SYSTEMET
=======================================================================================

    I folderen Grunt/files/installs finner du 2 filer. Den ene heter main_install.bat.
    Kjør denne som ADMINISTRATOR, og den vil installere Chocolatey package manager, siste
    versjon av PowerShell, og nodeJS, samt et par nodeJS pakker du er avhengig av.
    Denne filen må kjøres for at ting skal virke.

    I tillegg finns en utils_install.bat fil, som inneholder en rekke utils de fleste
    utvikere har bruk for. Du bør åpne denne filen og fjerne ev. programmer du føler du
    ikke trenger, før du kjører den.
    Denne filen er mest ment som en enkel måte å få installert en del software som stort
    sett alle alikevel bruker.
    Det anbefales å kjøre filen som ADMINISTRATOR.

=======================================================================================
HVORDAN SETTE OPP BUILD SYSTEMET
=======================================================================================

Det er anbefalt å laste ned DefaultFrontendProject nuget pakken, når du starter et prosjekt.
Denne vil også inkludere build systemet. Hvis du skal legge til build systemet i en eksisterende
prosjekt hvor det ikke har vært installert før kan du snakke med meg, så hjelper jeg deg med det.

Systemet gir deg nå mulighet til å installere node_modules filene lokalt, inne i prosjektet,
eller bruke NodeLinker.exe programmet som ligger på roten av prosjektet, og lage en symbolic link
fra en enkelt installasjon av node_modules folderen på disken din.

Det anbefales å bruke den siste løsningen. Du kan enkelt lage deg en folder med alt du trenger
ved å kopiere package.json og gruntfile.js inn i en folder, og skrive 'npm install' i et terminal
vindu som peker på denne folderen. Det vil da bli installert en haug med filer her.

Etter dette kan du som sagt bare fyre opp NodeLinker.exe, og finne frem 'node-modules' folderen som
ble installert, og trykke legg til i prosjekt. Nodelinker husker hvor du har installert dette, så
neste gang du bruker denne trenger du bare å trykke på legg til knappen.

Når du nå kikker på prosjektet ditt har du en node_modules folder med en liten pil i øvre høyre hjørne
på på ikonet (Webstorm) som tilsier at alt nå er installert.

Høyreklikk på gruntfile.js, og velg 'Show Grunt Tasks' nederst i menyen som dukker opp. Du vil da
få opp en liste av alle tasks som er tilgjengelig i build systemet.

Den første du bør kjøre er _patchBuildSystemFilesToLatestInstalledVersion, som oppdaterer default prosjektet.

Deretter bør du kjøre _setupDevBuild som setter opp en folder under script kalt build, med en build js fil
som du kan bruke. Denne filen vil ikke bli overskrevet ved oppdatering av buildsystemet.

=======================================================================================
DEFAULT OPTIONS
=======================================================================================

De options valgene du trenger å tenke på, med mindre du må konfigurere noe veldig avansert,
finner du i gruntfile.js filen, på roten av prosjektet.

Alle settings må legges til i DevBuild.js filen i build folderen under Scripts. Denne filen
vil overleve eventuelle oppdateringer av build systemet. Alle andre filer vil bli overskrevet.

        cssRootFolder:
            description     : Rotfolderen for scss filer.
            default value   : 'Content/css/scss'.

----------------------------------------------------------------------------------------

        cssMinResultFolder:
            description     : Folder for ferdig minifisert css fil.
            default value   : 'Content/css'.

----------------------------------------------------------------------------------------

        autoPrefixBrowserCheckArray:
            description     : Streng for oppsett av prefix sjekk på alle css properties. Se CSSBuild.js for mer info.
            default value   : ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'].

----------------------------------------------------------------------------------------

        imageDestFolder:
            description     : folder for ferdige bilder.
            default value   : 'Images'.

----------------------------------------------------------------------------------------

        spriteSheetFromCssFilePath:
            description     : path mellom bildefolder, og css folder. Blir lagt til alle bildepather som genereres i scss.
            default value   : '../../Images'.

----------------------------------------------------------------------------------------

        javascriptSourceRoot:
            description     : Javascript rot folder.
            default value   : 'Scripts'.

----------------------------------------------------------------------------------------

        javascriptTempFolder:
            description     : Temp folder for midlertidige filer som blir generert av build systemet. Vil slettes ved endt build.
            default value   : 'Scripts/build'.

----------------------------------------------------------------------------------------

        javascriptDestFolder:
            description     : Folder for ferdig minifisert js fil.
            default value   : 'Scripts'.

----------------------------------------------------------------------------------------

        knockoutTemplateNameSpace:
            description     : Namespace for template js filen som build systemet genererer for Knockout templates.
            default value   : 'Oxx'.

----------------------------------------------------------------------------------------

        knockoutTemplateClassName:
            description     : Klassenavnet på template js filen som build systemet genererer  for Knockout templates.
            default value   : 'KnockoutTemplates'.

----------------------------------------------------------------------------------------

        templatesSourceDir:
            description     : folder med knockout html-template filer.
            default value   : 'Templates/**/*.html'.

----------------------------------------------------------------------------------------

        svgTemplateNameSpace:
            description     : Namespace for template js filen som build systemet genererer av SVG filer.
            default value   : 'Oxx'.

----------------------------------------------------------------------------------------

        svgTemplateClassName:
            description     : Klassenavnet på template js filen som build systemet genererer  for SVG filer.
            default value   : 'SVGTemplates'.

----------------------------------------------------------------------------------------

        svgToManagerFolder:
            description     : folder med svg template filer. Finnes under Images / convert som default.
            default value   : '_svg_to_manager'.

----------------------------------------------------------------------------------------

        useHashInFontName:
            description     : Legger til hash i fontnavn for å komme rundt caching av font filer under utvikling.
            default value   : true.
            valid values    : true, false

----------------------------------------------------------------------------------------

        fontFromCssFilePath:
            description     : path mellom font filer, og css folder. Blir lagt til alle fontpather som genereres i scss..
            default value   : '../../Content/fonts'.

----------------------------------------------------------------------------------------

        fontDestFolder:
            description     : folder hvor ferdige font-filer blir plassert.
            default value   : 'Content/fonts'.

----------------------------------------------------------------------------------------

        useHashInFontName:
            description     : Inkluder en hash i filnavnet til fonten basert på hvilke svg elementer som er inkludert i fonten.
                              Brukes som cachebuster av fontfilen. Hashen endres hver gang innholdet endres.
            default value   : true

----------------------------------------------------------------------------------------

        svgSize:
            description     : Størrelse, i pixler, på alle svg elementene som skal konverteres.
            default value   : 512

----------------------------------------------------------------------------------------

        wantedFontFormats:
            description     : Formater vi ønsker at løsningen skal lage for oss.
            default value   : 'eot,woff,ttf,svg'

----------------------------------------------------------------------------------------

        wantedFormatOrder:
            description     : Rekkefølgen på innlastingen i css for formatene vi har generert.
            default value   : 'eot,svg,woff,ttf'

----------------------------------------------------------------------------------------

        webFontCodeStartPoint:
            description     : Char verdien løsningen starter å plassere icons fra. Hvis du trenger å spesifisere hvilke char et ikon skal
                              bruke kan du bare la denne være, og bruke webFontCodePoints beskrevet under.

----------------------------------------------------------------------------------------

        webFontCodePoints:
            description     : Objekt for binding av en unicode verdi til en spesifikk svg-fil.
                              Settes opp som filnavn : char value par i dette objektet. Char value er en unicode
                              verdi. Det er en greit oversikt over unicode verdier på denne siden: http://www.unicodemap.org/range/1/Basic_Latin/
                              De verdiene du skal bruke er de som er av formatet U+00xx
            default value   : {}

----------------------------------------------------------------------------------------

        scssPartialFolder:
            description     : folder hvor partial scss filer blir plassert. IE. webfont, spritesheet osv.
            default value   : 'Content/css/scss/_generatedPartials'.

----------------------------------------------------------------------------------------

        imageRootFolder:
            description     : Rotfolder for alle bilder.
            default value   : 'Images/_buildSystem'.

----------------------------------------------------------------------------------------

        convertImagesFolder:
            description     : Folder hvor alle konverteringsmappene for bilder finnes. Er alltid plassert under imageRootFolder.
            default value   : '_convert'.

----------------------------------------------------------------------------------------

        sourceTemplateFile:
            description     : Folder hvor kildefil for en tekst template fil ligger. Brukes både av Knockout og SVG build.
            default value   : 'Grunt/templates/TemplateFile.txt'.

----------------------------------------------------------------------------------------

        targetTemplatePath:
            description     : Folder hvor ferdig js fil med knockout/svg templates blir plassert.
            default value   : 'Scripts/templates'.

----------------------------------------------------------------------------------------

        templateNameSpaceReplace:
            description     : verdi som blir erstattet med valgt namespace i kildefil for tekst templates.
            default value   : 'templateNameSpace'.

----------------------------------------------------------------------------------------

        templateClassNameReplace:
            description     : verdi som blir erstattet med valgt klassenavn i kildefil for tekst templates.
            default value   : 'templateName'.

----------------------------------------------------------------------------------------

        templateContentReplace:
            description     : verdi som blir erstattet med alt innhold i kildefil for tekst templates.
            default value   : 'templateContent'.

----------------------------------------------------------------------------------------

        nugetTemplateFile:
            description     : Path til tekstfil med nuGet template.
            default value   : 'Grunt/templates/NugetTemplate.txt'.

----------------------------------------------------------------------------------------

        nugetBuildFolder:
            description     : Path til hvor ferdig nuget fil blir lagret i prosjektet.
            default value   : 'release/nuget'.

----------------------------------------------------------------------------------------

        nugetServer:
            description     : Url til server vi ønsker å laste nuget pakken opp på.
            default value   : 'Http://oxxNugetServer'.

----------------------------------------------------------------------------------------

        nugetApiKey:
            description     : Api key som trengs for å få tilgang til å laste opp på nuget server.
            default value   : '6CBB35F8-72EC-47D6-8B81-191C5D0F7AB9'.

----------------------------------------------------------------------------------------

        includeFilesInNugetPackage:
            description     : Array med filer vi ønsker å inkludere i en nuget pakke.
                              Se globbing forklart under for utvalg av filer.
            default value   : [].

----------------------------------------------------------------------------------------

        releaseFolder:
            description     : Path for release package on buildRelease call.
            default value   : 'release'.

----------------------------------------------------------------------------------------

        documentationFolder:
            description     : Path to documentation folder in the solution.
            default value   : 'Documentation'.

----------------------------------------------------------------------------------------

        changeLogFileName:
            description     : Name of changelog file in the documentation folder.
            default value   : 'changelog.txt'.

----------------------------------------------------------------------------------------

        packageFilePath:
            description     : Name of package.json file in the documentation folder.
            default value   : 'package.json'.

----------------------------------------------------------------------------------------

        projectsRootFolder:
            description     : The root folder of all projects. Only needed for the dependency system.
            default value   : 'C:/webstorm/.oxx_components'.

----------------------------------------------------------------------------------------

        dependencyFilePath:
            description     : Path to the dependency json file.
            default value   : 'dependencies.json'

=======================================================================================
GRUNT TASKS
=======================================================================================

    buildIconFont:
        Bygger en ikon font basert på svg filer plassert i folderen Images/_buildSystem/_convert/_svg_to_icon_font.
        Font filen ender i Content/font, og all nødvendig css blir automatisk inkludert.

        Det er viktig at alle svg filene har samme størrelse, og at denne størrelsen er spesifisert i
        svgSize propertyen av gruntfile.js. Denne har en default verdi på 512px.

        Det er mulig å styre hvilket tegn som brukes for hvilket ikon i CSS ved å sette dette opp i codepoints propertyen
        i gruntfile.js. Se codepoints info over for hvordan dette funker.

----------------------------------------------------------------------------------------

    buildJS:
        Bygger en js fil av alle filene spesifisert i _build.json filen i Script folderen. Se under for forklaring på _build.json filene.

----------------------------------------------------------------------------------------

    buildJSProd:
        Samme som over, men jsHinter også filene dine. Er strengt tatt ikke nødvendig å kjøre siden ALLE utviklere kjører med jsHint påskrudd i Webstorm :)

----------------------------------------------------------------------------------------

    buildKnockoutTemplate:
        Løsning for å bygge Knockout templates av alle HTML filene som finnes i folderen spesifisert i templatesSourceDir propertyen i gruntfile.js.
        Disse templatene blir så tilgjengelig gjennom Oxx.Managers.KnockoutManager klassen. Se egen dokumentasjon av dette biblioteket.

        Se under for beskrivelse av hvordan HTML sidene må være satt opp, for at dette skal virke.

----------------------------------------------------------------------------------------

    buildNuget:
        Task for å bygge en nuGet pakke. Ant. ikke noe utviklere flest trenger å tenke på.

----------------------------------------------------------------------------------------

    buildRelease:
        Task som kjører igjennom alt av tasks som trengs for å lage en komplett release av løsningen. Tar seg også av å bumpe versjonsnummeret i project.json filen.
        Det er meningen at dette er en task du selv skal sette opp til å inneholde du trenger for en release. Du finner tasken i ReleaseBuild.js filen under Grunt/modules.
        Det kan være lurt å flytte denne ut herfra hvis du gjør endringer, så slipper du at endringene dine blir overskrevet ved ev. oppdatering av build systemet.

----------------------------------------------------------------------------------------

    buildReleaseNoVersionBump:
        Samme som over, men uten versjon bump.

----------------------------------------------------------------------------------------

    buildSCSS:
        Task for å bygge en css fil fra alle scss filene definert i _build.json filen i Content/css folderen. Denne tar seg av en hel del css relatert som automatisk vendor prefixes,
        max antall css selectorer i en fil (IE9 og IE10), samt minifisering og concatinering.

        Se under for forklaring på _build.json filene.

----------------------------------------------------------------------------------------

    buildSCSSDebug:
        Samme task som over, men inkluderer source maps, linenumbers, samt debug info i css filene.

----------------------------------------------------------------------------------------

    buildSVGTemplate:
        Task for å bygge en SVG-template fil, som brukes av Oxx.Managers.SVGManager klassen min for enkelt å injecte SVG i DOM.

        Se dokumentasjonen for Oxx.Managers.SVGManager for å se hvordan dette virker.

----------------------------------------------------------------------------------------

    buildTSDocumentation:
        Eksperimentell task for bygging av HTML dokumentajon av et sett med TS filer. Ikke ferdig, så denne kan ikke brukes enda. Når den er klar vil den ha en egen _build.json fil for
        å beskrive hvilke filer som skal være med i dokumentasjonen.

----------------------------------------------------------------------------------------

    convertImages:
        Task for å konvertere bilder som finnes i noen av folderne under Images/_buildSystem/_convert.

----------------------------------------------------------------------------------------

    CopyDependencies:
        Task for å kopiere dependency filer fra et annet prosjekt. Brukes primært ved utvikling av interne komponenter.

----------------------------------------------------------------------------------------

    createDependencyCache:
        Task for å lage en cache folder som andre prosjekter laster ned når de har en dependency til dette prosjektet.

----------------------------------------------------------------------------------------

    createDependencyFile:
        Task for å lage en dependency.json fil på roten av prosjektet. Definerer hvilke dependencies som finnes i prosjektet.

----------------------------------------------------------------------------------------

    generateTSRef:
        Task for å generere en TS fil med referanser til alle andre TS filer i prosjektet. Så du trenger bare å referere til denne filen
        i toppen av TS filer med dependencies til andre filer i prosjektet. Det kommer en watch versjon av denne i neste utgave av build systemet.

        For at dette skal fungere må du endre litt i filewatcher settingene for Typescript. Endre Arguments til '--sourcemap $FilePath$' så slipper du å få
        sirkulære referanser i TS som fører til Duplicate errors ved kompilering.

----------------------------------------------------------------------------------------

    minifyImages:
        Task som tar alle bilder som ligger under Images/_buildSystem og minifiserer disse. Lager også png fallbacks av alle svg filer for IE8.

----------------------------------------------------------------------------------------

    releaseBump:
        Task for å endre versjonsnummer på prosjektet.

----------------------------------------------------------------------------------------

    Ellers er det en del start watch tasks som starter file watch løsninger for Kncokout, SVG, convertImages, generateTSRef, iconFont, minifyImages og SCSS build.

=======================================================================================
GRUNT FILE OBJECT
=======================================================================================

Hentet fra "dokumentasjonen" til Grunt. Brukes primært i nuget build løsning. Følgende er tilgjengelig.

{expand: true, cwd: '', src: ['', '!'], flatten: false, dest: '', filter: 'isFile'}

expand Set to true to enable the following options:

    cwd - All src matches are relative to (but don't include) this path.
    src - Pattern(s) to match, relative to the cwd. Se GRUNT GLOBBING for eksempler.
    dest - Destination path prefix.
    flatten - Remove all path parts from generated dest paths.
    filter - Usually set to isFile. Checks if the source is a file on disk.
    rename - This function is called for each matched src file, (after extension renaming and flattening).
             The dest and matched src path are passed in, and this function must return a new dest value.
             If the same dest is returned more than once, each src which used it will be added to an array of sources for it.

=======================================================================================
GRUNT GLOBBING
=======================================================================================

Grunt har støtte for en rekke løsninger for å lage regexp liknende uttrykk for å velge et gitt sett med filer.

Typiske varianter du kan få bruk for når du setter opp build files, hvor dette brukes mye:

*.js,                   - velger alle filer med .js i navn.
test*.js                - velger alle filer som begynner på test, og ender med .js, testfil.js vil bli valgt.
/**/*.js                - valger alle filer med .js i navn i folder, og ALLE underfoldere.
*.{js, ts}              - velger alle filer med enten .js, eller .ts i navn.
['*.js', '!myfile.js']  - velger alle js filer i folder, untatt myfile.js.

=======================================================================================
BUILD FILES
=======================================================================================

Builds filene i css og js mappen har følgende struktur, hvis du benytter deg av alt som er støttet av buildsystemet:

{
    "packages": [
        {
            "packageId"                 : "Oxx.Frontend.ProjectName",
            "nameModifier"              : "",
            "files"                     : [
                ""
            ],
            "processedFilesDestination" : "Folder/Path"
        }
    ]
}

Av disse er kun files noe du MÅ inkludere.
Hvis du ikke har inkludert en packageId, blir filene spesifisert i files pakket ned med samme navn som det som er spesifisert i package.json filen.

nameModifier gir deg muligheten til å legge til en modifier på navnet. Så hvis du ikke har inkludert en packageId, men vil bygge flere pakker, kan
du gi de forskjellige pakkene en nameModifier verdi, som vil bli lagt til navnet på pakken.

files er et array av filer du ønsker å legge med i filen du bygger. Denne propertien støtter vanlige strings, strings med glob patterns, og Grunt file objekter.

processedFilesDestination gir deg mulighet til å spesifisere hvor filen du bygger skal ende. Hvis denne ikke er spesifisert ender den bygde filen i Script/css folderen.

Så hvis du skal bygge noe så enkelt som mulig vil dette bygge en fil av alle js-filene i Script/ts/Oxx folderen:

{
    "packages": [
        {
            "files"                     : [
                "Scripts/ts/Oxx/**/*.js"
            ]
        }
    ]
}

Legg merke til glob møsteret for å spesifisere alle underfoldere, men bare js filene den finner.

Hvis du har filer som må lastes inn før andre kan disse spesifiseres over den generelle fil globben.

{
    "packages": [
        {
            "files"                     : [
                "Scripts/ts/Oxx/utils/ArrayUtils.js",
                "Scripts/ts/Oxx/**/*.js"
            ]
        }
    ]
}

ArrayUtils vil nå bli lagt til før alle andre filer. Løsningen er smart nok til å ikke legge ArrayUtils til i filen mer enn en gang.

Løsningen støtter å bygge så mange filer som du føler du trenger, bare legg til objekter med setup i packages arrayet.

=======================================================================================
KNOCKOUT TEMPLATE FILES
=======================================================================================

    Beskrivelse kommer i neste versjon.

