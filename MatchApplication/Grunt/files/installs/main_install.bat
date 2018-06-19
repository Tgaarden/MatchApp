Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
choco install -y chocolateygui
choco install -y nuget.commandline
choco install -y nodejs
choco install -y yarn

REM These commands might fail before a restart of your computer. Just run the file again, after restarting.
npm install -g node-sass
npm rebuild node-sass
npm install -g grunt-cli